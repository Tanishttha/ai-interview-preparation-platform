import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { CodingRepository } from '../repositories/coding_repository';
import { runOnJudge0, getJudge0LanguageId } from '../services/judge0_service';

const codingRepository = new CodingRepository();

interface TestCase {
  input: any;
  expectedOutput: any;
}

export class CodingController {
  async listQuestions(req: AuthenticatedRequest, res: Response) {
    const { category, difficulty } = req.query;
    try {
      const list = await codingRepository.getAllQuestions(
        category ? String(category) : undefined,
        difficulty ? String(difficulty) : undefined
      );
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getQuestion(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const question = await codingRepository.findQuestionById(id);
      if (!question) return res.status(404).json({ error: "Question not found" });
      res.json(question);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Actually compiles and runs the submitted code through Judge0. This
   * replaces what used to be an LLM asked to *pretend* to be a sandbox.
   *
   * `mode: 'run'` — executes the code once (against the first sample test
   *   case's input if the question has one, else with empty stdin) and
   *   returns the real stdout/stderr. Nothing is persisted.
   *
   * `mode: 'submit'` — if the question has an authored `harness` for the
   *   selected language, wraps the candidate's code and runs it against
   *   every test case, comparing actual vs. expected output for a real
   *   pass/fail verdict. If no harness is authored for this
   *   question/language, it falls back to a single real execution and says
   *   so explicitly — it does NOT fabricate a verdict.
   */
  async submitCode(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized.' });

    const { questionId, code, language, mode } = req.body as {
      questionId?: string;
      code?: string;
      language?: string;
      mode?: 'run' | 'submit';
    };

    if (!code) return res.status(400).json({ error: "No source code provided for compilation." });
    if (!getJudge0LanguageId(language || '')) {
      return res.status(400).json({ error: `Unsupported language: "${language}". Supported: javascript, typescript, python, java, c, cpp, csharp, go, ruby, rust, kotlin, php.` });
    }

    const isSubmit = mode === 'submit';

    try {
      const question = questionId ? await codingRepository.findQuestionById(questionId) : null;
      const testCases: TestCase[] = (question?.testCases as any) || [];
      const harness: Record<string, string> | null = (question?.harness as any) || null;
      const languageKey = (language || '').toLowerCase();

      // --- Graded run: harness + test cases authored for this question/language ---
      if (isSubmit && harness?.[languageKey] && testCases.length > 0) {
        const caseResults = [];
        let allPassed = true;
        let maxTime = 0;
        let maxMemory = 0;

        for (const [idx, testCase] of testCases.entries()) {
          const wrappedCode = harness[languageKey]
            .replace('__CANDIDATE_CODE__', code)
            .replace('__TEST_INPUT__', JSON.stringify(testCase.input));

          const result = await runOnJudge0({ code: wrappedCode, language: languageKey });
          const actualOutput = result.stdout.trim();
          const expected = typeof testCase.expectedOutput === 'string'
            ? testCase.expectedOutput.trim()
            : JSON.stringify(testCase.expectedOutput);

          const passed = result.statusDescription === 'Accepted' && actualOutput === expected;
          if (!passed) allPassed = false;
          if (result.timeMs) maxTime = Math.max(maxTime, result.timeMs);
          if (result.memoryKb) maxMemory = Math.max(maxMemory, result.memoryKb);

          caseResults.push({
            case: idx + 1,
            passed,
            status: result.statusDescription,
            expected,
            actual: actualOutput || result.stderr || result.compileOutput
          });

          // Stop at the first compile error — every case will fail identically
          if (result.statusDescription === 'Compilation Error') break;
        }

        const status = allPassed ? 'Accepted' : (caseResults.some(c => c.status === 'Compilation Error') ? 'Compile Error' : 'Failed');
        const feedback = allPassed
          ? `All ${caseResults.length} test case(s) passed.`
          : `${caseResults.filter(c => c.passed).length}/${caseResults.length} test case(s) passed. First failure: ${JSON.stringify(caseResults.find(c => !c.passed))}`;

        const submission = await codingRepository.createSubmission({
          userId,
          questionId: questionId || question?.id || 'unknown',
          code,
          language: languageKey,
          status,
          runtime: maxTime,
          memory: maxMemory,
          feedback
        });

        return res.json({
          success: allPassed,
          status: submission.status,
          runtime: `${maxTime} ms`,
          memory: `${(maxMemory / 1024).toFixed(2)} MB`,
          feedback,
          testResults: caseResults
        });
      }

      // --- Plain execution: "Run" mode, or "Submit" with no authored harness ---
      const stdin = testCases[0]?.input !== undefined
        ? (typeof testCases[0].input === 'string' ? testCases[0].input : JSON.stringify(testCases[0].input))
        : '';

      const result = await runOnJudge0({ code, language: languageKey, stdin });
      const executed = result.statusDescription === 'Accepted' || result.statusDescription === 'Exited with error';
      const output = result.stdout || result.stderr || result.compileOutput || '(no output)';

      let submissionRecord = null;
      if (isSubmit) {
        submissionRecord = await codingRepository.createSubmission({
          userId,
          questionId: questionId || question?.id || 'unknown',
          code,
          language: languageKey,
          status: result.statusDescription === 'Accepted' ? 'Executed' : result.statusDescription,
          runtime: result.timeMs || 0,
          memory: result.memoryKb || 0,
          feedback: harness
            ? 'Executed successfully, but this question has no test cases configured for automated grading.'
            : 'Executed successfully, but this question has no authored auto-grading harness yet — output shown is raw program output, not a verified pass/fail verdict.'
        });
      }

      return res.json({
        success: result.statusDescription === 'Accepted',
        status: submissionRecord?.status || result.statusDescription,
        runtime: `${result.timeMs || 0} ms`,
        memory: `${((result.memoryKb || 0) / 1024).toFixed(2)} MB`,
        feedback: submissionRecord?.feedback || (executed ? 'Program executed.' : `Execution failed: ${result.statusDescription}`),
        rawOutput: output,
        stderr: result.stderr,
        compileOutput: result.compileOutput
      });
    } catch (err: any) {
      // Deliberately NOT falling back to a fabricated "passed" result here —
      // an honest failure is safer than a fake success for a code judge.
      console.error('Judge0 execution error:', err);
      res.status(502).json({
        error: `Could not execute code: ${err.message}. Check that JUDGE0_API_URL (and JUDGE0_API_KEY, if using a rate-limited provider) is configured correctly.`
      });
    }
  }
}
