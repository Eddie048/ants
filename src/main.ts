import Renderer from "./renderer";
import { Ant, Anthill, Food } from "./types";

// Initialize canvas and rendering context with correct width and height
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

// Time counter
var tick = 0;

const antSight = 200;
const antSpeed = 2;

const hill: Anthill = {
  x: Math.random() * (canvas.width - 100) + 50,
  y: Math.random() * (canvas.height - 100) + 50,
  ants: 20,
  food: 0,
};

const ants: Ant[] = [];

const updateDirection = (
  atX: number,
  atY: number,
  curDirection: number,
  toX: number,
  toY: number
) => {
  // Get direction to target
  let targetDirection = Math.atan((toY - atY) / (toX - atX));
  if (toX - atX < 0) targetDirection += Math.PI;

  if (targetDirection < 0) targetDirection += Math.PI * 2;

  let delta = curDirection - targetDirection;

  // Get direction towards target
  if (
    (delta > 0 && delta < -1 * delta + Math.PI * 2) ||
    (delta < 0 && delta + Math.PI * 2 < -1 * delta)
  )
    return (curDirection -= 0.1);
  else return (curDirection += 0.1);
};

// Populate world food
const worldFood: Food[] = [];
for (let i = 0; i < 20; i++) {
  worldFood.push({
    x: Math.random() * (canvas.width - 100) + 50,
    y: Math.random() * (canvas.height - 100) + 50,
    food: Math.random() * 10,
  });
}

// Logic loop to update everything
const updateLoop = () => {
  setTimeout(updateLoop, 17);

  // Update anthill
  if (hill.ants > 0 && tick % 50 == 0) {
    hill.ants -= 1;
    ants.push({
      x: hill.x,
      y: hill.y,
      direction: Math.random() * Math.PI * 2,
      hasFood: false,
    });
  }

  // Update ants
  for (let a = 0; a < ants.length; a++) {
    // If ant has food, returns to anthill
    if (ants[a].hasFood) {
      // If at anthill, go inside and deposit food
      if (
        Math.sqrt(
          Math.pow(hill.y - ants[a].y, 2) + Math.pow(hill.x - ants[a].x, 2)
        ) < 15
      ) {
        hill.ants++;
        hill.food++;
        ants.splice(a, 1);
        a--;
        continue;
      }

      // Turn towards anthill
      ants[a].direction = updateDirection(
        ants[a].x,
        ants[a].y,
        ants[a].direction,
        hill.x,
        hill.y
      );
    } else {
      // Find distance to nearest food
      let distance = Number.MAX_VALUE;
      let foodIndex = -1;
      for (let f = 0; f < worldFood.length; f++) {
        let tempDist = Math.sqrt(
          Math.pow(worldFood[f].y - ants[a].y, 2) +
            Math.pow(worldFood[f].x - ants[a].x, 2)
        );

        if (tempDist < distance) {
          foodIndex = f;
          distance = tempDist;
        }
      }

      // If found food, eat it
      if (foodIndex != -1 && distance < 10) {
        worldFood[foodIndex].food--;
        if (worldFood[foodIndex].food <= 0) worldFood.splice(foodIndex, 1);
        ants[a].hasFood = true;
      } else if (foodIndex != -1 && distance < antSight) {
        // If near food, go towards it
        ants[a].direction = updateDirection(
          ants[a].x,
          ants[a].y,
          ants[a].direction,
          worldFood[foodIndex].x,
          worldFood[foodIndex].y
        );
      } else {
        // Looking for food, wander randomly
        ants[a].direction = ants[a].direction + Math.random() * 0.3 - 0.15;

        // If ant hits a border, reverse direction
        if (
          ants[a].x > canvas.width ||
          ants[a].x < 0 ||
          ants[a].y > canvas.height ||
          ants[a].y < 0
        )
          ants[a].direction += Math.PI;
      }
    }

    // Normalize ant direction
    ants[a].direction = ants[a].direction % (Math.PI * 2);
    if (ants[a].direction < 0) ants[a].direction += Math.PI * 2;

    // Ensure ant is within the borders
    if (ants[a].x > canvas.width) ants[a].x = canvas.width;
    if (ants[a].x < 0) ants[a].x = 0;
    if (ants[a].y > canvas.height) ants[a].y = canvas.height;
    if (ants[a].y < 0) ants[a].y = 0;

    // Update ant position with current direction and speed
    ants[a].x += Math.cos(ants[a].direction) * antSpeed;
    ants[a].y += Math.sin(ants[a].direction) * antSpeed;
  }

  tick++;
};

// Start logic loop
updateLoop();

// Start render loop
const renderer = new Renderer(
  hill,
  ants,
  worldFood,
  <CanvasRenderingContext2D>canvas.getContext("2d"),
  canvas.width,
  canvas.height
);
renderer.renderLoop();
