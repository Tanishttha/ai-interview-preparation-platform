import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { readDb, writeDb } from '../config/db';

export class UtilityController {
  // Calendar Events
  async getCalendar(req: AuthenticatedRequest, res: Response) {
    try {
      const db = readDb();
      res.json(db.calendarEvents || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createCalendarEvent(req: AuthenticatedRequest, res: Response) {
    const { title, date, time, description } = req.body;
    if (!title || !date) return res.status(400).json({ error: "Missing title or date" });
    try {
      const db = readDb();
      const newEvent = {
        id: `event_${Date.now()}`,
        title,
        date,
        time: time || "12:00",
        description: description || ""
      };
      db.calendarEvents = db.calendarEvents || [];
      db.calendarEvents.push(newEvent);
      writeDb(db);
      res.status(201).json(newEvent);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Notes Module
  async getNotes(req: AuthenticatedRequest, res: Response) {
    try {
      const db = readDb();
      res.json(db.notes || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createNote(req: AuthenticatedRequest, res: Response) {
    const { title, content, folder } = req.body;
    try {
      const db = readDb();
      const newNote = {
        id: `note_${Date.now()}`,
        title: title || "Untitled Note",
        content: content || "",
        folder: folder || "Unsorted",
        updatedAt: new Date().toISOString().split('T')[0]
      };
      db.notes = db.notes || [];
      db.notes.push(newNote);
      writeDb(db);
      res.status(201).json(newNote);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateNote(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { title, content, folder } = req.body;
    try {
      const db = readDb();
      db.notes = db.notes || [];
      const index = db.notes.findIndex((n: any) => n.id === id);
      if (index === -1) return res.status(404).json({ error: "Note not found" });

      db.notes[index] = {
        ...db.notes[index],
        title: title !== undefined ? title : db.notes[index].title,
        content: content !== undefined ? content : db.notes[index].content,
        folder: folder !== undefined ? folder : db.notes[index].folder,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      writeDb(db);
      res.json(db.notes[index]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteNote(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const db = readDb();
      db.notes = db.notes || [];
      db.notes = db.notes.filter((n: any) => n.id !== id);
      writeDb(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Bookmarks Module
  async getBookmarks(req: AuthenticatedRequest, res: Response) {
    try {
      const db = readDb();
      res.json(db.bookmarks || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async toggleBookmark(req: AuthenticatedRequest, res: Response) {
    const { companyId } = req.body;
    if (!companyId) return res.status(400).json({ error: "Missing companyId" });
    try {
      const db = readDb();
      db.bookmarks = db.bookmarks || [];
      const index = db.bookmarks.indexOf(companyId);
      if (index === -1) {
        db.bookmarks.push(companyId);
      } else {
        db.bookmarks.splice(index, 1);
      }
      writeDb(db);
      res.json({ bookmarks: db.bookmarks });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Notifications Module
  async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const db = readDb();
      res.json(db.notifications || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async markNotificationRead(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const db = readDb();
      db.notifications = db.notifications || [];
      const index = db.notifications.findIndex((n: any) => n.id === id);
      if (index !== -1) {
        db.notifications[index].isRead = true;
      }
      writeDb(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
