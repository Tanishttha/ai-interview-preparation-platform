import { Request, Response } from "express";
import { scrapeCompanyData } from "../services/scraper_service";
import { prisma } from "../config/db";

export class ScraperController {
  /**
   * Trigger a server-side web scraper crawl on a career page or interview board
   */
  async triggerScrape(req: Request, res: Response) {
    const { companyName, url } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: "Missing required parameter: companyName" });
    }

    try {
      console.log(`ScraperController triggered for company: ${companyName}, URL: ${url || "none"}`);
      const result = await scrapeCompanyData(companyName, url);
      return res.status(200).json({
        success: true,
        message: `Successfully crawled and parsed career intelligence for ${companyName}.`,
        data: result
      });
    } catch (err: any) {
      console.error("ScraperController failed:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "An unexpected error occurred during server-side scraping."
      });
    }
  }

  /**
   * Retrieve the audit trail history of scraped company data for the RAG knowledge base
   */
  async getScrapedHistory(req: Request, res: Response) {
    try {
      const history = await prisma.company.findMany({
        orderBy: { updatedAt: 'desc' }
      });
      return res.status(200).json(history);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
