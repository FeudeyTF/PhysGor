import { Difficulty } from "./types/Difficulty";
import config from "./config.json";

export const difficulties: Difficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
  Difficulty.VeryHard,
];

export const schoolClasses: number[] = [7, 8, 9, 10, 11];

export const API_URL = "http://" + config.api.ip + ":" + config.api.port + "/" + config.api.baseUrl;