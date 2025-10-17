import {Schema , model , Document , Types} from 'mongoose';
export interface INFT extends Document{
    tokenId: number;
    creator: Types.ObjectId;
    owner: Types.ObjectId;
    name: string;
    description: string;
    image: string;
    tokenURI: string;
    category: 'art' | 'music' | 'collectible';
    purchasable: boolean;
    price?: number;
    isListed: boolean;
    attributes: Array<{
        trait_type: string;
        value: string;
    }>;
    createdAt: Date;
    updatedAt: Date;   
}
const nftSchema = new Schema<INFT>(
  {
    tokenId: {
      type: Number,
      required: true,
      index: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    tokenURI: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['art', 'music', 'collectible'],
      required: true,
    },
    purchasable: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
    },
    isListed: {
      type: Boolean,
      default: false,
    },
    attributes: [{
      trait_type: String,
      value: String,
    }],
  },
  {
    timestamps: true,
  }
);

nftSchema.index({ creator: 1 });
nftSchema.index({ owner: 1 });
nftSchema.index({ category: 1 });
nftSchema.index({ purchasable: 1 });

export const NFT = model<INFT>('NFT', nftSchema);