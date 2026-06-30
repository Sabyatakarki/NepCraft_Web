import mongoose, { Schema, Document } from "mongoose";

export interface IArtisan extends Document {
  name: string;
  role: string;
  location: string;
  bio: string;
  image: string;
  experience: number;
}

const ArtisanSchema = new Schema<IArtisan>(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IArtisan>("Artisan", ArtisanSchema);