import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../prisma';
// TODO: Migrate Bookmarks and Notifications to Prisma.
// They currently depend on readDb()/writeDb() and must be converted before the JSON database can be removed.

export class UtilityController {
  // Calendar Events
  async getCalendar(req: AuthenticatedRequest, res: Response) {
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      const user = await prisma.user.findFirst({ where: { firebaseUid } });
      if (!user) {
        return res.json([]);
      }

      const events = await prisma.calendarEvent.findMany({
        where: { userId: user.id },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' }
        ]
      });

      res.json(events);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createCalendarEvent(req: AuthenticatedRequest, res: Response) {
    const { title, date, time, description } = req.body;
    if (!title || !date) return res.status(400).json({ error: "Missing title or date" });
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      let user = await prisma.user.findFirst({ where: { firebaseUid } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            firebaseUid,
            email: req.user?.email ?? `${firebaseUid}@firebase.local`,
            name: req.user?.name ?? 'User'
          }
        });
      }

      const event = await prisma.calendarEvent.create({
        data: {
          userId: user.id,
          title,
          date,
          time: time || '12:00',
          description: description || ''
        }
      });

      res.status(201).json(event);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Notes Module
  async getNotes(req: AuthenticatedRequest, res: Response) {
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      // TODO: Ensure the User model contains a firebaseUid field (preferably @unique).
      // If it does not, add it to schema.prisma and run prisma generate + prisma db push.
      const user = await prisma.user.findFirst({
        where: { firebaseUid }
      });

      if (!user) {
        return res.json([]);
      }

      const notes = await prisma.note.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
      });

      res.json(notes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createNote(req: AuthenticatedRequest, res: Response) {
    const { title, content, folder } = req.body;
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      // TODO: Ensure the User model contains a firebaseUid field (preferably @unique).
      // If it does not, add it to schema.prisma and run prisma generate + prisma db push.
      let user = await prisma.user.findFirst({
        where: { firebaseUid }
      });

      if (!user) {
        // TODO: Populate required fields such as email, name, etc. from the authenticated Firebase token before creating the user.
        user = await prisma.user.create({
          data: {
            firebaseUid,
            email: req.user?.email ?? `${firebaseUid}@firebase.local`,
            name: req.user?.name ?? 'User'
          }
        });
      }

      const newNote = await prisma.note.create({
        data: {
          userId: user.id,
          title: title || "Untitled Note",
          content: content || "",
          folder: folder || "Unsorted"
        }
      });

      res.status(201).json(newNote);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateNote(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { title, content, folder } = req.body;
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      // TODO: Ensure the User model contains a firebaseUid field (preferably @unique).
      // If it does not, add it to schema.prisma and run prisma generate + prisma db push.
      const user = await prisma.user.findFirst({
        where: { firebaseUid }
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (folder !== undefined) updateData.folder = folder;
      updateData.updatedAt = new Date();

      const result = await prisma.note.updateMany({
        where: {
          id,
          userId: user.id
        },
        data: updateData
      });

      if (result.count === 0) {
        return res.status(404).json({ error: "Note not found" });
      }

      const updatedNote = await prisma.note.findUnique({
        where: { id }
      });

      res.json(updatedNote);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteNote(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      // TODO: Ensure the User model contains a firebaseUid field (preferably @unique).
      // If it does not, add it to schema.prisma and run prisma generate + prisma db push.
      const user = await prisma.user.findFirst({
        where: { firebaseUid }
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const result = await prisma.note.deleteMany({
        where: {
          id,
          userId: user.id
        }
      });

      if (result.count === 0) {
        return res.status(404).json({ error: "Note not found" });
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Bookmarks Module
  async getBookmarks(req: AuthenticatedRequest, res: Response) {
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      const user = await prisma.user.findFirst({ where: { firebaseUid } });
      if (!user) {
        return res.json([]);
      }

      const bookmarks = await prisma.bookmark.findMany({ where: { userId: user.id } });
      res.json(bookmarks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async toggleBookmark(req: AuthenticatedRequest, res: Response) {
    const { companyId } = req.body;
    if (!companyId) return res.status(400).json({ error: "Missing companyId" });
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      let user = await prisma.user.findFirst({ where: { firebaseUid } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            firebaseUid,
            email: req.user?.email ?? `${firebaseUid}@firebase.local`,
            name: req.user?.name ?? 'User'
          }
        });
      }

      const existingBookmark = await prisma.bookmark.findFirst({
        where: { userId: user.id, companyId }
      });

      if (existingBookmark) {
        await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
      } else {
        await prisma.bookmark.create({
          data: { userId: user.id, companyId }
        });
      }

      const bookmarks = await prisma.bookmark.findMany({ where: { userId: user.id } });
      res.json({ bookmarks });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Notifications Module
  async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      const user = await prisma.user.findFirst({ where: { firebaseUid } });
      if (!user) {
        return res.json([]);
      }

      const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      res.json(notifications);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async markNotificationRead(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const firebaseUid = req.user?.uid;
      if (!firebaseUid) return res.status(401).json({ error: "Unauthorized" });

      const user = await prisma.user.findFirst({ where: { firebaseUid } });
      if (!user) return res.status(404).json({ error: "User not found" });

      await prisma.notification.updateMany({
        where: { id, userId: user.id },
        data: { isRead: true }
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
