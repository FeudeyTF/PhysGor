import { Difficulty } from "./Difficulty";
import { PhysicsCategory } from "./PhysicsCategory";

export type Note = {
  title: string;
  text: string;
};

export type PhysicsLaw = {
  id?: string;
  name: string;
  description: string;
  notes?: Note[];
  formula?: string;
  year?: number;
  discoveredBy?: string;
  category: PhysicsCategory;
  difficulty: Difficulty;
  class: number;
};