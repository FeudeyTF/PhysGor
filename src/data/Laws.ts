import { Difficulty } from "../types/Difficulty";
import { PhysicsLaw } from "../types/PhysicsLaw";

export const physicsLaws: PhysicsLaw[] = [
  {
    id: '1',
    name: "1-й закон Ньютона",
    description: "Существуют такие системы отсчёта, называемые инерциальными, относительно которых материальные точки, когда на них не действуют никакие силы (или действуют силы взаимно уравновешенные), находятся в состоянии покоя или равномерного прямолинейного движения.",
    category: 'Механика',
    discoveredBy: 'Исаак Ньютон',
    year: 1687,
    class: 7,
    difficulty: Difficulty.Easy
  },
  {
    id: '2',
    name: "2-й закон Ньютона",
    description: "В инерциальной системе отсчёта ускорение, которое получает материальная точка с постоянной массой, прямо пропорционально равнодействующей всех приложенных к ней сил и обратно пропорционально её массе.",
    formula: "F = ma",
    category: 'Механика',
    discoveredBy: 'Исаак Ньютон',
    year: 1687,
    class: 7,
    difficulty: Difficulty.Easy
  },
  {
    id: '3',
    name: "3-й закон Ньютона",
    description: "Материальные точки взаимодействуют друг с другом силами, имеющими одинаковую природу, направленными вдоль прямой, соединяющей эти точки, равными по модулю и противоположными по направлению:",
    formula: "F₁₂ = -F₂₁",
    category: 'Механика',
    discoveredBy: 'Исаак Ньютон',
    year: 1687,
    class: 7,
    difficulty: Difficulty.Easy
  },
  {
    id: '4',
    name: "Закон всемирного тяготения",
    description: "Все тела притягиваются друг к другу, сила всемирного тяготения прямо пропорциональна произведению масс тел и обратно пропорциональна квадрату расстояния между ними.",
    formula: "F = G(m₁m₂/r²)",
    category: 'Механика',
    discoveredBy: 'Исаак Ньютон',
    year: 1687,
    class: 7,
    difficulty: Difficulty.Easy
  },
  {
    id: '5',
    name: "Первое начало термодинамики",
    description: "Энергия не может быть создана или уничтожена в изолированной системе; она может быть только преобразована из одной формы в другую.",
    formula: "ΔU = Q - W",
    category: 'Термодинамика',
    discoveredBy: 'Рудольф Клаузиус',
    year: 1850,
    class: 7,
    difficulty: Difficulty.Easy
  },
  {
    id: '6',
    name: "Второе начало Термодинамики",
    description: "Энтропия замкнутой системы увеличивается.",
    formula: "ΔS ≥ 0",
    category: 'Термодинамика',
    discoveredBy: 'Рудольф Клаузиус',
    year: 1850,
    class: 7,
    difficulty: Difficulty.Easy
  },
  {
    id: '7',
    name: "Закон электромагнитной индукции",
    description: "Для любого замкнутого контура порождаемая в нём магнитным полем электродвижущая сила (ЭДС) равна скорости изменения магнитного потока через этот контур, взятой со знаком минус.",
    formula: "ε = -dΦ/dt",
    category: 'Электромагнетизм',
    discoveredBy: 'Майкл Фарадей',
    year: 1831,
    class: 7,
    difficulty: Difficulty.Easy
  }
];

export const categories = Array.from(
  new Set(physicsLaws.map(law => law.category))
);