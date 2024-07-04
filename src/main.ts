// Initialize canvas and rendering context with correct width and height
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;
const c = <CanvasRenderingContext2D>canvas.getContext("2d");

var frame = 0;

const antSight = 100;
const antDistance = 2;

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

const hill: Anthill = {
  x: Math.random() * (canvas.width - 100) + 50,
  y: Math.random() * (canvas.height - 100) + 50,
  ants: 5,
  food: 0,
};

const ants: Ant[] = [];

const render = () => {
  // Clear screen
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background color
  c.fillStyle = "sandybrown";
  c.fillRect(0, 0, canvas.width, canvas.height);

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
  // Recursive
  window.requestAnimationFrame(animationLoop);

  // Handle anthill
  if (hill.ants > 0 && frame % 150 == 0) {
    hill.ants -= 1;
    ants.push({
      x: hill.x,
      y: hill.y,
      direction: Math.random() * Math.PI * 2,
      hasFood: false,
    });
  }

  // Handle ants
  for (let ant of ants) {
    ant.x += Math.cos(ant.direction) * antDistance;
    ant.y += Math.sin(ant.direction) * antDistance;
    ant.direction =
      (ant.direction + Math.random() * 0.3 - 0.15) % (Math.PI * 2);
    // if (ant.x > canvas.width) ant.x = canvas.width;
    // if (ant.x < 0) ant.x = 0;
    // if (ant.y > canvas.height) ant.y = canvas.height;
    // if (ant.y < 0) ant.y = 0;

    // If ant hits a border, reverse direction
    if (ant.x > canvas.width || ant.x < 0 || ant.y > canvas.height || ant.y < 0)
      ant.direction = (ant.direction + Math.PI) % (Math.PI * 2);
  }

  render();

  // Set framerate to approximately 30fps
  frame += 1;
  await sleep(33);
};

// Start animation loop
window.requestAnimationFrame(animationLoop);
