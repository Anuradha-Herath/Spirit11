import mongoose, { Schema, Document } from 'mongoose';

export interface Player extends Document {
  name: string;
  university: string;
  category: 'Batsman' | 'Bowler' | 'All-Rounder';
  totalRuns: number;
  ballsFaced: number;
  wickets: number;
  oversBowled: number;
  runsConceded: number;
  points: number;
  value: number;
  readOnly: boolean; // For dataset players
}

const playerSchema: Schema = new Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  category: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder'], required: true },
  totalRuns: { type: Number, required: true },
  ballsFaced: { type: Number, required: true },
  wickets: { type: Number, required: true },
  oversBowled: { type: Number, required: true },
  runsConceded: { type: Number, required: true },
  points: { type: Number, required: true },
  value: { type: Number, required: true },
  readOnly: { type: Boolean, default: false }
});

export const PlayerModel = mongoose.model<Player>('Player', playerSchema);