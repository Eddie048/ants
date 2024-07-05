// Initialize canvas and rendering context with correct width and height
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;
const c = <CanvasRenderingContext2D>canvas.getContext("2d");

var frame = 0;

const antSight = 100;
const antSpeed = 2;

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

const hill: Anthill = {
  x: Math.random() * (canvas.width - 100) + 50,
  y: Math.random() * (canvas.height - 100) + 50,
  ants: 5,
  food: 0,
};

const ants: Ant[] = [];

// Populate world food
const worldFood: Food[] = [];
for (let i = 0; i < 10; i++) {
  worldFood.push({
    x: Math.random() * (canvas.width - 100) + 50,
    y: Math.random() * (canvas.height - 100) + 50,
    food: Math.random() * 20 + 10,
  });
}

const render = () => {
  // Clear screen
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background color
  c.fillStyle = "sandybrown";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  c.fillStyle = "green";
  for (let food of worldFood) {
    c.beginPath();
    c.arc(food.x, food.y, Math.sqrt(food.food / Math.PI) * 3, 0, Math.PI * 2);
    c.fill();
  }

  // Draw anthill
  c.fillStyle = "saddlebrown";
  c.beginPath();
  c.arc(hill.x, hill.y, 20, 0, Math.PI * 2);
  c.fill();

  //Draw ants
  c.fillStyle = "black";
  for (let ant of ants) {
    c.beginPath();
    c.ellipse(ant.x, ant.y, 10, 3, ant.direction, 0, Math.PI * 2);
    c.fill();
  }
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const animationLoop = async () => {
  // Update anthill
  if (hill.ants > 0 && frame % 150 == 0) {
    hill.ants -= 1;
    ants.push({
      x: hill.x,
      y: hill.y,
      direction: Math.random() * Math.PI * 2,
      hasFood: false,
    });
  }

  // Update ants
  for (let ant of ants) {
    // If ant has food, returns to anthill
    if (ant.hasFood) {
      // Get direction to anthill
      let hillDirection = Math.atan((hill.y - ant.y) / (hill.x - ant.x));
      if (hill.x - ant.x < 0) hillDirection += Math.PI;

      if (hillDirection < 0) hillDirection += Math.PI * 2;

      let delta = ant.direction - hillDirection;
      if (
        (delta > 0 && delta < -1 * delta + Math.PI * 2) ||
        (delta < 0 && delta + Math.PI * 2 < -1 * delta)
      )
        ant.direction -= 0.1;
      else ant.direction += 0.1;
    } else {
      // Looking for food, wander randomly
      ant.direction = ant.direction + Math.random() * 0.3 - 0.15;

      // If ant hits a border, reverse direction
      if (
        ant.x > canvas.width ||
        ant.x < 0 ||
        ant.y > canvas.height ||
        ant.y < 0
      )
        ant.direction += Math.PI;
    }

    // Normalize ant direction
    ant.direction = ant.direction % (Math.PI * 2);
    if (ant.direction < 0) ant.direction += Math.PI * 2;

    // Ensure ant is within the borders
    if (ant.x > canvas.width) ant.x = canvas.width;
    if (ant.x < 0) ant.x = 0;
    if (ant.y > canvas.height) ant.y = canvas.height;
    if (ant.y < 0) ant.y = 0;

    // Update ant position with current direction and speed
    ant.x += Math.cos(ant.direction) * antSpeed;
    ant.y += Math.sin(ant.direction) * antSpeed;
  }

  // Render current state
  render();

  // Set framerate to approximately 60fps
  frame += 1;
  await sleep(17);

  // Recursive
  window.requestAnimationFrame(animationLoop);
};

// Start animation loop
window.requestAnimationFrame(animationLoop);
