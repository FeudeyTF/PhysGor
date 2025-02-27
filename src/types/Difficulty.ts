export enum Difficulty {
  Easy = "Легко",
  Medium = "Средне",
  Hard = "Сложно",
  VeryHard = "Очень сложно"
}

export function DifficultyToColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.Easy:
      return '#4caf50';
    case Difficulty.Medium:
      return '#ff9800';
    case Difficulty.Hard:
      return '#f44336';
    case Difficulty.VeryHard:
      return '#9c27b0';
    default:
      return '#757575';
  }
}