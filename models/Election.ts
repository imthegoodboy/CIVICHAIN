import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  voterAddress: string;
  candidate: string;
  timestamp: Date;
}

export interface IElection extends Document {
  electionId: number;
  creatorAddress: string;
  title: string;
  description: string;
  candidates: string[];
  votingType: 'SingleChoice' | 'Ranked' | 'Quadratic';
  startTime: Date;
  endTime: Date;
  status: 'Pending' | 'Active' | 'Ended' | 'Cancelled';
  totalVotes: number;
  votes: Map<string, number>;
  voterAddresses: string[];
  isPrivate: boolean;
  rewardAmount: number;
  contractAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VoteSchema: Schema = new Schema({
  voterAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  candidate: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ElectionSchema: Schema = new Schema(
  {
    electionId: {
      type: Number,
      required: true,
      unique: true,
    },
    creatorAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    candidates: [{
      type: String,
      required: true,
    }],
    votingType: {
      type: String,
      enum: ['SingleChoice', 'Ranked', 'Quadratic'],
      default: 'SingleChoice',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Ended', 'Cancelled'],
      default: 'Pending',
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    votes: {
      type: Map,
      of: Number,
      default: {},
    },
    voterAddresses: [{
      type: String,
      lowercase: true,
    }],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    rewardAmount: {
      type: Number,
      default: 0,
    },
    contractAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ElectionSchema.index({ electionId: 1 });
ElectionSchema.index({ status: 1 });
ElectionSchema.index({ endTime: 1 });

export default mongoose.models.Election || mongoose.model<IElection>('Election', ElectionSchema);

