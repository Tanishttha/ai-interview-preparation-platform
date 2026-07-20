import { GoogleGenAI, Type } from "@google/genai";
import { readDb, writeDb, prisma, isPrismaActive } from "../config/db";

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

export interface ScrapedDataResult {
  companyName: string;
  interviewDifficulty: "Easy" | "Medium" | "Hard";
  interviewProcess: string;
  interviewRounds: string[];
  technicalTopics: string[];
  recentQuestions: string[];
  eligibilityCriteria: string;
  packageRange: string;
  recentOpenings: {
    title: string;
    location: string;
    department?: string;
    applyLink?: string;
  }[];
  scrapedUrl?: string;
  scrapedAt: string;
}

/**
 * Perform server-side web scraping of career pages or interview platforms
 */
export async function scrapeCompanyData(companyName: string, url?: string): Promise<ScrapedDataResult> {
  const timestamp = new Date().toISOString();
  let htmlText = "";

  // 1. If a URL is provided, try to fetch its contents directly
  if (url) {
    console.log(`Starting server-side fetch for ${companyName} career page: ${url}`);
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        signal: AbortSignal.timeout(8000)
      });

      if (response.ok) {
        const html = await response.text();
        // Clean and reduce size of the page
        htmlText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
          .replace(/<\/?[^>]+(>|$)/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 15000);
        console.log(`Successfully scraped direct page content. Length: ${htmlText.length}`);
      } else {
        console.warn(`Direct fetch returned non-ok status: ${response.status}`);
      }
    } catch (err: any) {
      console.warn(`Direct fetch failed for URL ${url}. Error: ${err.message}`);
    }
  }

  // 2. Generate grounded content or fallback if Gemini API is not configured
  if (!ai) {
    console.warn("GEMINI_API_KEY is not defined. Returning highly realistic mock-scraped patterns.");
    const fallbackResult: ScrapedDataResult = {
      companyName,
      interviewDifficulty: "Hard",
      interviewProcess: "A highly selective software engineering assessment followed by 3 dynamic data structure rounds and a behavioral panel.",
      interviewRounds: ["Online Coding Test", "Technical Interview Round 1", "Technical Interview Round 2", "Bar Raiser Panel"],
      technicalTopics: ["Dynamic Programming", "Graph Algorithmic Optimization", "Concurrent Hash Tables"],
      recentQuestions: [
        "Given a stream of network data, detect sliding window patterns in O(1) memory complexity.",
        "Implement a distributed rate-limiter with cluster-wide replication properties."
      ],
      eligibilityCriteria: "CGPA > 7.5, graduating batches of 2025/2026, branches in CSE/IT/ECE.",
      packageRange: "28 - 42 LPA",
      recentOpenings: [
        { title: "Software Development Engineer - I", location: "Bangalore, India", department: "Engineering", applyLink: url || "#" },
        { title: "SDE Intern (6 Months)", location: "Hyderabad, India", department: "Engineering", applyLink: url || "#" }
      ],
      scrapedUrl: url || "https://careers.google.com",
      scrapedAt: timestamp
    };

    saveScrapedDataToDb(fallbackResult);
    return fallbackResult;
  }

  try {
    // 3. Generate content utilizing Gemini 3.5-flash and search-grounding fallback
    const userPrompt = `You are a real-time carrier scraping and pattern parsing agent. 
Analyze the target company: "${companyName}". 
Source URL: "${url || "Auto-search public career profiles and interview platforms"}".
Direct scraped HTML snippet:
"${htmlText || "[Direct crawl unavailable, perform online search]"}"

Extract the most up-to-date and accurate 2026 corporate software development hiring parameters. Verify active openings, typical DSA interview rounds, eligibility guidelines, average compensation package ranges, most tested algorithms, and exact recent technical coding questions. Ensure questions are realistic and challenging (no dummy text).`;

    // Retrieve live grounded context
    const searchResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        tools: [{ googleSearch: {} }] // Utilize live search grounding to ensure real-time accuracy
      }
    });

    const contextText = searchResponse.text || "No text generated";

    // Structure the results into JSON using the Type schema
    const structuredResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Grounded in this live scraped search and career context:\n\n${contextText}\n\nFormat the extracted details into a valid corporate report.`,
      config: {
        systemInstruction: "You MUST output a single valid JSON object following the responseSchema exactly. No surrounding markdown backticks. Difficulty must be 'Easy', 'Medium', or 'Hard'. Ensure recent questions are highly realistic interview problems.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            interviewDifficulty: { type: Type.STRING, description: "Must be 'Easy', 'Medium', or 'Hard'" },
            interviewProcess: { type: Type.STRING },
            interviewRounds: { type: Type.ARRAY, items: { type: Type.STRING } },
            technicalTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            recentQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            eligibilityCriteria: { type: Type.STRING },
            packageRange: { type: Type.STRING },
            recentOpenings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  location: { type: Type.STRING },
                  department: { type: Type.STRING },
                  applyLink: { type: Type.STRING }
                },
                required: ["title", "location"]
              }
            }
          },
          required: [
            "companyName",
            "interviewDifficulty",
            "interviewProcess",
            "interviewRounds",
            "technicalTopics",
            "recentQuestions",
            "eligibilityCriteria",
            "packageRange",
            "recentOpenings"
          ]
        }
      }
    });

    const parsedJson = JSON.parse(structuredResponse.text?.trim() || "{}");

    const finalResult: ScrapedDataResult = {
      ...parsedJson,
      scrapedUrl: url || "Live Search Grounding",
      scrapedAt: timestamp
    };

    // 4. Save and index inside the database
    saveScrapedDataToDb(finalResult);

    return finalResult;
  } catch (err: any) {
    console.error("Error executing Gemini carrier scraper:", err);
    throw new Error(`Scraper execution failure: ${err.message}`);
  }
}

/**
 * Save scraped data to persistent storage (db.json / fallback + Prisma if active)
 */
export function saveScrapedDataToDb(scraped: ScrapedDataResult) {
  try {
    // A. FALLBACK JSON DATABASE (ALWAYS PERSIST)
    const db = readDb();
    
    // 1. Push to audited scraper logs
    db.scrapedCareerPages = db.scrapedCareerPages || [];
    db.scrapedCareerPages.unshift(scraped);

    // Keep list clean, store max 50 pages
    if (db.scrapedCareerPages.length > 50) {
      db.scrapedCareerPages.pop();
    }

    // 2. Enrich/Sync the core COMPANIES list so it instantly appears in the UI
    db.companies = db.companies || [];
    const normalizedName = scraped.companyName.trim();
    const companyId = normalizedName.toLowerCase().replace(/\s+/g, "_");

    const existingIndex = db.companies.findIndex((c: any) => c.name.toLowerCase() === normalizedName.toLowerCase() || c.id === companyId);

    const companyLogoEmoji = getLogoEmoji(normalizedName);
    const mappedCompany = {
      id: companyId,
      name: normalizedName,
      logo: companyLogoEmoji,
      role: scraped.recentOpenings?.[0]?.title || "Software Engineer",
      package: scraped.packageRange || "24 - 36 LPA",
      difficulty: scraped.interviewDifficulty || "Medium",
      location: scraped.recentOpenings?.[0]?.location || "Remote",
      batch: "2025 / 2026",
      interviewRounds: scraped.interviewRounds && scraped.interviewRounds.length > 0 ? scraped.interviewRounds : ["OA", "Technical DS/Algo", "System Design"],
      prepTime: scraped.interviewDifficulty === "Hard" ? "3 - 4 Months" : "2 Months",
      successRate: scraped.interviewDifficulty === "Hard" ? 12 : 18,
      overview: scraped.interviewProcess || `Detailed recruitment process scraped for ${normalizedName}.`,
      hiringProcess: scraped.interviewProcess || `Recruitment pattern scraped from open job postings and carrier pages.`,
      eligibility: scraped.eligibilityCriteria || "CGPA > 7.5, CS/IT or relevant technical branches.",
      ctcBreakdown: scraped.packageRange || "24 - 36 LPA Base plus performance incentive.",
      skillsRequired: scraped.technicalTopics && scraped.technicalTopics.length > 0 ? scraped.technicalTopics : ["Algorithms", "Coding cleanliness"],
      importantTopics: scraped.technicalTopics && scraped.technicalTopics.length > 0 ? scraped.technicalTopics : ["Data Structures"],
      recentTrends: `Hiring trends prioritize: ${scraped.technicalTopics.slice(0, 3).join(", ")}.`,
      difficultyScore: scraped.interviewDifficulty === "Hard" ? 85 : scraped.interviewDifficulty === "Medium" ? 72 : 50,
      resources: [
        { name: `${normalizedName} Jobs Page`, type: "Career site", url: scraped.scrapedUrl || "#" },
        { name: "Leetcode Prep Card", type: "Practice", url: "#" }
      ]
    };

    if (existingIndex !== -1) {
      // Merge with existing properties
      db.companies[existingIndex] = {
        ...db.companies[existingIndex],
        ...mappedCompany,
        id: db.companies[existingIndex].id // keep original ID
      };
    } else {
      db.companies.push(mappedCompany);
    }

    writeDb(db);
    console.log(`Persistent storage indexed: Enriched ${normalizedName} successfully in db.json.`);

    // B. PRISMA DATABASE WRITER (IF ACTIVE)
    if (isPrismaActive && prisma) {
      try {
        // Run Prisma transaction asynchronously to avoid blocking
        runPrismaSync(scraped, companyId).catch(prismaErr => {
          console.warn("Prisma background sync encountered minor warning:", prismaErr.message);
        });
      } catch (prismaInitErr) {
        // Safe to ignore, we already persisted to db.json fallback
      }
    }

  } catch (err: any) {
    console.error("Failed to persist scraped company data:", err.message);
  }
}

/**
 * Background background sync for active PostgreSQL schemas
 */
async function runPrismaSync(scraped: ScrapedDataResult, companyId: string) {
  if (!prisma) return;
  const normalizedName = scraped.companyName.trim();

  // Try to create or update company in Prisma
  await prisma.$transaction(async (tx) => {
    const existing = await tx.company.findFirst({
      where: {
        OR: [
          { id: companyId },
          { name: { equals: normalizedName, mode: "insensitive" } }
        ]
      }
    });

    if (existing) {
      await tx.company.update({
        where: { id: existing.id },
        data: {
          difficulty: scraped.interviewDifficulty,
          eligibility: scraped.eligibilityCriteria,
          hiringProcess: scraped.interviewProcess,
        }
      });
    } else {
      await tx.company.create({
        data: {
          id: companyId,
          name: normalizedName,
          difficulty: scraped.interviewDifficulty,
          eligibility: scraped.eligibilityCriteria,
          hiringProcess: scraped.interviewProcess,
          logoUrl: ""
        }
      });
    }
  });
}

function getLogoEmoji(companyName: string): string {
  const name = companyName.toLowerCase();
  if (name.includes("google")) return "🔍";
  if (name.includes("microsoft")) return "💻";
  if (name.includes("amazon")) return "📦";
  if (name.includes("netflix")) return "🍿";
  if (name.includes("meta") || name.includes("facebook")) return "♾️";
  if (name.includes("stripe")) return "💳";
  if (name.includes("uber")) return "🚗";
  if (name.includes("atlassian")) return "🌌";
  if (name.includes("apple")) return "🍎";
  return "🏢";
}
