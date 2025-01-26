import mongoose, { Schema, Document, Model } from "mongoose";

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
  }>;

}

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
        gamesPlayed: { type: Number, default: 0, required: false },
        correctAnswers: { type: Number, default: 0, required: false },
        winPercentage: { type: Number, default: 0, required: false },
      },
      required: false,
    },
    gameHistory: [
      {
        category: { type: String, required: false },
        question: { type: String, required: false },
        choices: [{ type: String, required: false }],
        chosenOption: { type: String, required: false },
        isCorrect: { type: Boolean, required: false },
        playedAt: { type: Date, default: Date.now, required: false },
      },
    ],

  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
