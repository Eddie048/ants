type Ant = {
  x: number;
  y: number;
  direction: number;
  hasFood: boolean;
};

type Anthill = {
  x: number;
  y: number;
  ants: number;
  food: number;
};

type Food = {
  x: number;
  y: number;
  food: number;
};

type Pheremone = {
  x: number;
  y: number;
  timer: number;
};

export { type Ant, type Anthill, type Food, type Pheremone };
