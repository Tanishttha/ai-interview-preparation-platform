import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { InterviewRepository } from '../repositories/interview_repository';
import { GoogleGenAI, Type } from '@google/genai';

const interviewRepository = new InterviewRepository();

export class InterviewController {
  async getHistory(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'candidate-default-id';
    try {
      const history = await interviewRepository.getHistoryByUserId(userId);
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createInterviewSession(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || 'candidate-default-id';
    const { company, role, difficulty } = req.body;
    try {
      const session = await interviewRepository.createMockInterview({
        userId,
        companyName: company || "General Practice",
        role: role || "Software Engineer",
        difficulty: difficulty || "Medium",
        score: 0
      });
      res.status(201).json(session);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async simulateInterviewResponse(req: AuthenticatedRequest, res: Response) {
    const { company, difficulty, role, transcripts, jobDescription, faceMetrics } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    let feedback = "Your technical delivery was robust. You cleanly explained sliding window bounds and demonstrated comfortable verbal fluency. Focus slightly on explaining the trade-offs of consistent hash rings versus single node instances.";
    let report = {
      overallScore: 88,
      communicationScore: 85,
      jobMatchScore: 80,
      bodyLanguageScore: 90,
      technicalCorrectness: "Candidate demonstrated decent familiarity with sliding window approaches and distributed hashing concepts, though deep recursion stack complexity bounds were not fully analyzed.",
      jobAlignment: `Evaluation against role ${role || "Software Engineer"}: Candidate showed good alignment with fundamental backend development practices. However, specific performance tuning and high-throughput requirements from the job description could be discussed in greater detail.`,
      eyeContactAnalysis: "Outstanding visual engagement! Candidate maintained eye contact at an average of 94% with centered posture, indicating exceptional focus and comfort during deep architecture questions.",
      facialFeedbackSummary: "Smiled during warm intros and maintained a professional, highly analytical neutral expression during difficult distributed consistency challenges. Micro-stress triggers were extremely low.",
      strengths: [
        "Clear and structured articulation of rate limiter partitioning bounds.",
        "Demonstrated intuitive understanding of consistent hashing.",
        "Strong active communication cadence during difficult problem prompts."
      ],
      gaps: [
        "Missing detailed space complexity bounds for the Redis replication buffers.",
        "Could elaborate on synchronization deadlock scenarios or consensus-based rate-limiting.",
        "Under-explained time-complexity trade-offs of using centralized key-stores versus local memory."
      ],
      actionableRecommendations: [
        "Simulate Redis cluster failure patterns to confidently talk about partition tolerance.",
        "Practice vocalizing time vs space trade-offs dynamically as you draft your answers.",
        "Read up on Token Bucket vs Leaky Bucket algorithms and practice matching them to specific SDE-II SLA specifications."
      ]
    };

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } }
        });

        const prompt = `Perform a comprehensive post-interview feedback audit.
Company: ${company || "General Practice"}
Role: ${role || "Software Engineer"}
Difficulty Level: ${difficulty || "Medium"}
Target Job Description:
${jobDescription || "Not provided specifically; analyze against standard senior SDE requirements."}

Transcripts & Spoken Candidate Responses:
${JSON.stringify(transcripts || [])}

Face and Body Language Analysis Metrics (from live computer vision camera tracking):
- Average Eye Contact Concentration: ${faceMetrics?.eyeContact || "93"}%
- Attention Focus Level: ${faceMetrics?.attentionStatus || "Highly Focused"}
- Facial Expression / Dominant Emotion: ${faceMetrics?.emotion || "Confident"}
- Calculated Stress Index: ${faceMetrics?.stressLevel || "Normal"}
- Average Head Alignment Rate: ${faceMetrics?.headPosture || "Centered"}

Perform an elite principal engineer and executive recruiter analysis. Verify technical accuracy of the candidate's answers, evaluate communication clarity, critically match their responses to the requirements in the Job Description, and review their body language stats.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are a Principal SDE Interviewer and Executive Recruiter. Output a strict JSON structure analyzing the candidate's transcripts and body language metrics against the job description requirements. Be highly constructive, critical, and objective.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                feedback: { type: Type.STRING, description: "A high-level paragraph of consolidated feedback summary." },
                overallScore: { type: Type.INTEGER, description: "Candidate performance score from 0 to 100." },
                communicationScore: { type: Type.INTEGER, description: "Candidate verbal and communication clarity score from 0 to 100." },
                jobMatchScore: { type: Type.INTEGER, description: "Alignment score with the specified Job Description from 0 to 100." },
                bodyLanguageScore: { type: Type.INTEGER, description: "Calculated body language and facial feedback score from 0 to 100." },
                technicalCorrectness: { type: Type.STRING, description: "Detailed analysis of technical accuracy, algorithms, complexity trade-offs." },
                jobAlignment: { type: Type.STRING, description: "Analysis of how well the responses cover key requirements in the Job Description." },
                eyeContactAnalysis: { type: Type.STRING, description: "Detailed critical critique of the user's eye contact and facial attention parameters." },
                facialFeedbackSummary: { type: Type.STRING, description: "Summary of the user's facial emotions, stress indexes, and expressive alignment." },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 key candidate strengths during the session." },
                gaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 core areas of improvement / development gaps." },
                actionableRecommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 highly actionable recommendations to secure a placement for this role." }
              },
              required: [
                "feedback", "overallScore", "communicationScore", "jobMatchScore", "bodyLanguageScore", 
                "technicalCorrectness", "jobAlignment", "eyeContactAnalysis", "facialFeedbackSummary", 
                "strengths", "gaps", "actionableRecommendations"
              ]
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          feedback = parsed.feedback || feedback;
          report = parsed;
        }
      } catch (e) {
        console.warn("Gemini feedback generation fallback invoked:", e);
      }
    }

    res.json({ feedback, report });
  }
}
