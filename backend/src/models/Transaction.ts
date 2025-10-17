import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  txHash: string;
  from: Types.ObjectId;
  to?: Types.ObjectId;
  nft: Types.ObjectId;
  type: 'mint' | 'transfer' | 'sale' | 'list' | 'delist';
  price?: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    txHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    nft: {
      type: Schema.Types.ObjectId,
      ref: 'NFT',
      required: true,
    },
    type: {
      type: String,
      enum: ['mint', 'transfer', 'sale', 'list', 'delist'],
      required: true,
    },
    price: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
    blockNumber: Number,
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });
transactionSchema.index({ nft: 1 });
transactionSchema.index({ status: 1 });

export const Transaction = model<ITransaction>('Transaction', transactionSchema);