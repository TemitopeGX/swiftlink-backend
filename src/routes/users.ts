import express from "express";
import db from "../db";
import { User } from "../models/delivery";
import { sql } from "kysely";

const router = express.Router();

interface CreateUserRequest {
  firebaseUid: string;
  email: string;
  name: string;
  role: "business" | "rider" | "user";
}

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { firebaseUid, email, name, role } = req.body as CreateUserRequest;
    const user = await db
      .insertInto("users")
      .values({
        id: sql`gen_random_uuid()`,
        firebase_uid: firebaseUid,
        email,
        name,
        role,
        created_at: sql`now()`,
        updated_at: sql`now()`,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await db
      .selectFrom("users")
      .where("id", "=", req.params.id)
      .selectAll()
      .executeTakeFirst();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

// Update user
router.patch("/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updateData: Partial<User> = {
      updated_at: new Date(),
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    const user = await db
      .updateTable("users")
      .set(updateData)
      .where("id", "=", req.params.id)
      .returningAll()
      .executeTakeFirstOrThrow();
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    await db
      .deleteFrom("users")
      .where("id", "=", req.params.id)
      .executeTakeFirstOrThrow();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Get user by Firebase UID
router.get("/firebase/:firebaseUid", async (req, res) => {
  try {
    const user = await db
      .selectFrom("users")
      .where("firebase_uid", "=", req.params.firebaseUid)
      .selectAll()
      .executeTakeFirst();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user by Firebase UID:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

export default router;
