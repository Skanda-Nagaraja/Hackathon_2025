import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case "GET":
        const users = await User.find({});
        return res.status(200).json(users);

      case "POST":
        const { username, passwordHash } = req.body;

        if (!username || !passwordHash) {
          return res.status(400).json({ error: "Username and passwordHash are required" });
        }

        const newUser = new User({
          username,
          passwordHash,
          totalGamesPlayed: 0,
          totalWins: 0,
          categoryStats: {},
          gameHistory: [],
        });

        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error in /api/users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
