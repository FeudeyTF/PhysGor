export enum TrainingMode {
  Flashcard = "flashcard",
  MultipleChoice = "multipleChoice",
  Matching = "matching",
  FormulaWriting = "formulaWriting",
}

export interface TrainingModeOption {
  id: TrainingMode;
  label: string;
  description: string;
  icon?: string;
}
