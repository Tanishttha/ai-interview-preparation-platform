import { Router } from "express";
import { prisma } from "../prisma";
import admin from "../lib/firebaseAdmin";

const router = Router();

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required",
      });
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const {
      uid,
      email,
      name,
      picture,
    } = decoded;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not found in Firebase token",
      });
    }

    // Find existing user
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Create or update user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firebaseUid: uid,
          name: name || email.split("@")[0],
          photoURL: picture ?? "",
        },
      });
    } else {
      user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          firebaseUid: uid,
          name: name || email.split("@")[0],
          photoURL: picture ?? "",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
    });
  }
});

export default router;