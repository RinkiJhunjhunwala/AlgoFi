import { Schema , model, Document } from 'mongoose';
export interface IUser extends Documents{
    walletAdd: string;
    username?: string;
    email?: string;
    email?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: {
        twitter?: string;
        website?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
const userSchema = new Schema<IUser>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      sparse: true,
    },
    email: {
      type: String,
      sparse: true,
    },
    bio: String,
    avatar: String,
    socialLinks: {
      twitter: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);