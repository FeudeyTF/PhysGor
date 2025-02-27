import { Difficulty } from "./Difficulty";
import { PhysicsCategory } from "./PhysicsCategory";

export type PhysicsLaw = {
  id?: string;
  name: string;
  description: string;
  formula?: string;
  year?: number;
  discoveredBy?: string;
  category: PhysicsCategory;
  difficulty: Difficulty;
  class: number;
};