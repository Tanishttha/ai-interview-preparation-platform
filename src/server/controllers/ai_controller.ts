import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export class AIController {
  // 1. AI Chat Helper (/api/ai/chat)
  async chat(req: AuthenticatedRequest, res: Response) {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing message parameter.' });
    }

    try {
      if (ai) {
        const formattedHistory = (history || [])
          .map((h: any) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
          .join('\n');

        const prompt = `You are the PrepAI Helper, a friendly, extremely helpful, and skilled technical preparation assistant.
Respond to the user's latest message based on the previous conversation history.

Conversation History:
${formattedHistory}

User's Latest Message: ${message}

Provide a helpful, direct, and concise response in Markdown. Keep the tone encouraging, technical, and professional. Avoid filler words.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });

        return res.json({ response: response.text });
      } else {
        // Offline / No-Key Fallback
        return res.json({
          response: `[Simulated Mode] I received your message: "${message}". To unlock real-time Gemini AI chat capabilities, please configure the \`GEMINI_API_KEY\` secret in the platform Settings panel. Currently, I am operating in mock mode to ensure local routes function correctly.`
        });
      }
    } catch (err: any) {
      console.error('AI Chat Helper Error:', err);
      return res.status(500).json({ error: err.message || 'An error occurred during generating response.' });
    }
  }

  // 2. AI Career Coach (/api/ai/coach)
  async coach(req: AuthenticatedRequest, res: Response) {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing message parameter.' });
    }

    try {
      if (ai) {
        const formattedHistory = (history || [])
          .map((h: any) => `${h.sender === 'user' ? 'User' : 'Coach'}: ${h.text}`)
          .join('\n');

        const prompt = `You are the PrepAI Career Coach, an elite technical recruiter and placement strategist who helps candidates land SDE offers at top companies.
Respond to the user's latest career-coaching query based on the conversation history.

Conversation History:
${formattedHistory}

User's Latest Query: ${message}

Provide actionable advice about recruitment pipelines, technical skill scaling, compensation trends, or profile refinement strategies. Use scannable formatting (bullet points, bold highlights) and keep the tone direct, professional, and highly motivating.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });

        return res.json({ response: response.text });
      } else {
        // Offline / No-Key Fallback
        return res.json({
          response: `[Simulated Mode] As your AI Career Coach, I received your query: "${message}". 
          
Here are 3 quick placement strategy recommendations:
1. **Target Key Frameworks**: Deepen your skill set in React, TypeScript, and Docker since top tiers prioritize containerization.
2. **Optimize Problem Solving**: Solve 3-5 sliding-window and graph-traversal problems on our Coding Sandbox daily to keep algorithmic fluency high.
3. **Configure API Secrets**: Add your \`GEMINI_API_KEY\` in the Settings menu to receive live, real-time recruiting forecasts tailored to your exact CV!`
        });
      }
    } catch (err: any) {
      console.error('AI Career Coach Error:', err);
      return res.status(500).json({ error: err.message || 'An error occurred during generating response.' });
    }
  }

  // 3. AI Personalized Roadmap (/api/ai/roadmap)
  async generateRoadmap(req: AuthenticatedRequest, res: Response) {
    const { targetCompany, targetRole, currentSkills, collegeYear, timeAvailable } = req.body;
    if (!targetCompany || !targetRole) {
      return res.status(400).json({ error: 'Missing targetCompany or targetRole.' });
    }

    try {
      if (ai) {
        const prompt = `Generate a highly personalized week-wise SDE preparation roadmap for ${targetCompany} targeting the ${targetRole} role.
Current Skills / Tech Stack: ${currentSkills}
College / Current Year: ${collegeYear}
Time Available: ${timeAvailable}

Create a realistic week-by-week preparation structure. Based on the time available (e.g. 1 Month = 4 weeks, 2 Months = 8 weeks, 3 Months = 12 weeks), generate the corresponding number of weeks (maximum 8 weeks to keep things compact).

For each week, define:
1. week: number (1, 2, 3...)
2. title: string (e.g., "Fundamentals & Binary Trees")
3. progress: number (always 0)
4. tasks: array of objects containing:
   - id: string (unique task ID, e.g., "1-1", "1-2")
   - text: string (specific, highly actionable preparation task, problem suggestion, or system design concept)
   - completed: boolean (always false)
   - category: string (one of "Coding", "Fundamentals", "Technical", "System Design", "HR")`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  progress: { type: Type.INTEGER },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        completed: { type: Type.BOOLEAN },
                        category: { type: Type.STRING },
                      },
                      required: ['id', 'text', 'completed', 'category'],
                    },
                  },
                },
                required: ['week', 'title', 'progress', 'tasks'],
              },
            },
          },
        });

        const roadmapData = JSON.parse(response.text.trim());
        return res.json(roadmapData);
      } else {
        // Fallback static structural roadmap tailored slightly to inputs
        const mockWeeks = [
          {
            week: 1,
            title: `Structural Fundamentals & ${targetCompany} Warm-up`,
            progress: 0,
            tasks: [
              { id: '1-1', text: `Deepen core Big-O knowledge and optimize space/time constraints for ${targetRole} prep.`, completed: false, category: 'Fundamentals' },
              { id: '1-2', text: `Solve 10 Two-Pointer and Sliding Window challenges based on ${targetCompany} typical formats.`, completed: false, category: 'Coding' },
              { id: '1-3', text: `Analyze standard memory heaps, arrays, and GC behaviors.`, completed: false, category: 'Technical' }
            ]
          },
          {
            week: 2,
            title: 'Linked Lists & Cache Maps',
            progress: 0,
            tasks: [
              { id: '2-1', text: 'Implement singly and doubly linked list reversal and cycle detection.', completed: false, category: 'Coding' },
              { id: '2-2', text: 'Study hash collision resolution algorithms, load factors, and LRU cache structures.', completed: false, category: 'Technical' },
              { id: '2-3', text: `Prepare high-scoring STAR behavioral answers tailored for ${targetCompany}'s work culture.`, completed: false, category: 'HR' }
            ]
          },
          {
            week: 3,
            title: 'Graphs, Trees & System Architecture',
            progress: 0,
            tasks: [
              { id: '3-1', text: 'Master DFS/BFS & recursive validation algorithms across BSTs.', completed: false, category: 'Coding' },
              { id: '3-2', text: 'Solve 5 graph topological layout, Dijkstra or Prim implementations.', completed: false, category: 'Coding' },
              { id: '3-3', text: 'Study standard Load Balancers, vertical vs horizontal scaling, and CDN edge protocols.', completed: false, category: 'System Design' }
            ]
          }
        ];
        return res.json(mockWeeks);
      }
    } catch (err: any) {
      console.error('AI Roadmap Generation Error:', err);
      return res.status(500).json({ error: err.message || 'An error occurred during roadmap generation.' });
    }
  }

  // 4. AI Google Calendar Remind/ICS Generation (/api/ai/calendar/remind)
  async scheduleRemind(req: AuthenticatedRequest, res: Response) {
    const { title, company, date, time, durationMinutes } = req.body;
    if (!date || !time) {
      return res.status(400).json({ error: 'Missing date or time parameter.' });
    }

    try {
      // 1. Reconstruct start and end timestamps in standard ICS format (YYYYMMDDTHHMMSSZ)
      const dateParts = date.split('-'); // e.g. ["2026", "07", "19"]
      const timeParts = time.split(':'); // e.g. ["15", "30"]
      
      const startYear = dateParts[0];
      const startMonth = dateParts[1];
      const startDay = dateParts[2];
      const startHour = timeParts[0];
      const startMin = timeParts[1];

      const startObj = new Date(
        parseInt(startYear),
        parseInt(startMonth) - 1,
        parseInt(startDay),
        parseInt(startHour),
        parseInt(startMin)
      );

      const endObj = new Date(startObj.getTime() + (durationMinutes || 45) * 60000);

      const toIcsString = (d: Date) => {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const dtStart = toIcsString(startObj);
      const dtEnd = toIcsString(endObj);
      const dtStamp = toIcsString(new Date());

      const eventTitle = title || `SDE Interview Practice with PrepAI`;
      const eventLocation = company ? `${company} Recruitment Channel` : 'PrepAI Simulator Room';

      // 2. Generate clean, valid iCalendar (.ics) content block
      const icsFileContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//PrepAI//Candidate Mock Interview System//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:prepai_event_${Date.now()}@prepai.ai`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${eventTitle}`,
        `LOCATION:${eventLocation}`,
        `DESCRIPTION:Automatic PrepAI session reminder. Get ready for your ${company || 'SDE'} mock practice session! Prepare questions about core system architectures, data structures, and behaviors.`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:SDE Practice session is starting soon!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const fileName = `prepai-schedule-${company ? company.toLowerCase() : 'practice'}.ics`;

      return res.json({
        success: true,
        icsFileContent,
        fileName,
      });
    } catch (err: any) {
      console.error('AI Calendar Generation Error:', err);
      return res.status(500).json({ error: err.message || 'An error occurred during generating calendar file.' });
    }
  }

  // 5. AI Code Review (/api/ai/review)
  async reviewCode(req: AuthenticatedRequest, res: Response) {
    const { code, language, problemTitle } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No source code provided.' });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    try {
      if (apiKey) {
        const aiInstance = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } }
        });
        const prompt = `You are an elite Senior SDE Interviewer and static analyzer. Review this candidate's code submission for the problem "${problemTitle || 'Coding Challenge'}".
Language: ${language || 'typescript'}
Code:
${code}

Provide a robust code review report in Markdown format. Cover:
1. **Algorithmic Correctness**: Is the logic fully correct? Are there edge cases or boundary issues?
2. **Time & Space Complexity**: Evaluate asymptotic complexity. Does it match the optimal solution?
3. **Suggestions**: Provide 2-3 precise refactoring tips to improve readability, performance, or memory.

Be highly professional, clear, and constructive.`;

        const response = await aiInstance.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });

        return res.json({ review: response.text });
      } else {
        return res.json({
          review: `### AI Code Review (Simulated Mode)
- **Algorithmic Correctness**: 100% correct structure. Code successfully follows expected logical steps.
- **Time Complexity**: Optimal O(N) asymptotic scale.
- **Space Complexity**: O(1) constant auxiliary space.
- **Suggestions**:
  1. Add parameter validations to avoid null pointer reference errors.
  2. Optimize memory allocations by reusing arrays or list elements where applicable.
  3. Ensure your GEMINI_API_KEY is configured in the platform Settings to enable real-time Gemini AI code audits!`
        });
      }
    } catch (err: any) {
      console.error('Code Review Error:', err);
      return res.status(500).json({ error: err.message || 'An error occurred during code review generation.' });
    }
  }
}
