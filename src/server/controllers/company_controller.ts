import { Request, Response } from 'express';
import { CompanyRepository } from '../repositories/company_repository';

const companyRepository = new CompanyRepository();

export class CompanyController {
  async listCompanies(req: Request, res: Response) {
    const { search, difficulty } = req.query;
    try {
      const list = await companyRepository.getAll(
        search ? String(search) : undefined,
        difficulty ? String(difficulty) : undefined
      );
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCompanyDetails(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const company = await companyRepository.findById(id);
      if (!company) {
        return res.status(404).json({ error: 'Company details not found.' });
      }
      res.json(company);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async checkEligibility(req: Request, res: Response) {
    const { id } = req.params;
    const { cgpa, backlogs, branch } = req.body;
    try {
      const company = await companyRepository.findById(id);
      if (!company) return res.status(404).json({ error: 'Company not found.' });

      // Match eligibility rules
      let eligible = true;
      const reasons: string[] = [];

      if (cgpa && cgpa < 7.5) {
        eligible = false;
        reasons.push("CGPA lies below the benchmark threshold of 7.5");
      }
      if (backlogs && backlogs > 0) {
        eligible = false;
        reasons.push("The recruiter criteria specifies no active backlogs.");
      }

      res.json({
        eligible,
        reasons: reasons.length > 0 ? reasons : ["Your current metrics matches all target requisites perfectly!"],
        criteria: company.eligibility || "CGPA > 7.5, open to major engineering disciplines."
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createCompany(req: Request, res: Response) {
    try {
      const company = await companyRepository.create(req.body);
      res.status(201).json(company);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
