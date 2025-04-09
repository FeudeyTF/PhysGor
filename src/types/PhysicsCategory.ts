export enum PhysicsCategory {
  Mechanics = "Mechanics",
  Thermodynamics = "Thermodynamics",
  Electromagnetism = "Electromagnetism",
  Optics = "Optics",
}

export function translatePhysicsCategory(category: PhysicsCategory) {
  switch (category) {
    default:
    case PhysicsCategory.Mechanics:
      return "Механика";
    case PhysicsCategory.Thermodynamics:
      return "Термодинамика";
    case PhysicsCategory.Electromagnetism:
      return "Электромагнетизм";
    case PhysicsCategory.Optics:
      return "Оптика";
  }
}