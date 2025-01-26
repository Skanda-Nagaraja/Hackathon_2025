import mongoose, { Schema, Document, Model } from "mongoose";

// Define the `IUser` interface
export interface IUser extends Document {
  username: string;
  passwordHash: string;
  totalGamesPlayed?: number;
  totalWins?: number;
  categoryStats?: Record<
    string,
    {
      gamesPlayed: number;
      correctAnswers: number;
      winPercentage: number;
    }
  >;
  gameHistory?: Array<{
    category: string;
    question: string;
    choices: string[];
    chosenOption: string;
    isCorrect: boolean;
    playedAt: Date;
  }>;
}

// Define the `UserSchema` with consistent modifiers
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    totalGamesPlayed: { type: Number, default: 0 },
    totalWins: { type: Number, default: 0 },
    categoryStats: {
      type: Map,
      of: {
        gamesPlayed: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        winPercentage: { type: Number, default: 0 },
      },
    },
    gameHistory: {
      type: [
        {
          category: { type: String, required: true },
          question: { type: String, required: true },
          choices: [{ type: String, required: true }],
          chosenOption: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
          playedAt: { type: Date, default: Date.now },
        },
      ],
      required: false, // Align with the interface
    },
  },
  { timestamps: true }
);

// Create and export the `User` model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
