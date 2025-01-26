import mongoose, { Schema, Document, Model } from "mongoose";

// Define the `IUser` interface
export interface IUser extends Document {
  username: string;
  passwordHash: string;
  totalGamesPlayed?: number;
  totalWins?: number;
  totalPoints: number;
  categoryStats?: Map<
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
    correctAnswer: string;
    explanation: string;
  }>;

}

// Define the `UserSchema` with consistent modifiers
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    totalGamesPlayed: { type: Number, default: 0, required: false },
    totalWins: { type: Number, default: 0, required: false },
    totalPoints: { type: Number, default: 0, required: true },

    categoryStats: {
      type: Map,
      of: {
        gamesPlayed: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        winPercentage: { type: Number, default: 0 },
      },
    },

    gameHistory: {
      type: [{
        category: { type: String, required: true },
        question: { type: String, required: true },
        choices: { type: [String] },
        chosenOption: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        playedAt: { type: Date, default: Date.now },
        correctAnswer: { type: String, required: true },
        explanation: { type: String, required: true }
      }],
      required: false,
      default: []
    },



  },
  { timestamps: true }
);

// Create and export the `User` model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
