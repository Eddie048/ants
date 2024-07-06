import { Anthill, Ant, Food, Pheremone } from "./types";

class Renderer {
  hill: Anthill;
  ants: Ant[];
  worldFood: Food[];
  pheremones: Pheremone[];
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(
    hill: Anthill,
    ants: Ant[],
    food: Food[],
    pheremones: Pheremone[],
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.hill = hill;
    this.ants = ants;
    this.worldFood = food;
    this.pheremones = pheremones;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  // Rendering loop to draw everything on the page
  renderLoop = () => {
    // Recursive
    window.requestAnimationFrame(this.renderLoop);

    // Clear screen
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw background color
    this.ctx.fillStyle = "sandybrown";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw pheremones
    this.ctx.fillStyle = "lime";
    for (let pheremone of this.pheremones) {
      this.ctx.globalAlpha = pheremone.timer / 1000;
      this.ctx.beginPath();
      this.ctx.arc(pheremone.x, pheremone.y, 50, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;

    // Draw food
    this.ctx.fillStyle = "green";
    for (let food of this.worldFood) {
      this.ctx.beginPath();
      this.ctx.arc(
        food.x,
        food.y,
        Math.sqrt(food.food / Math.PI) * 3 + 5,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }

    // Draw anthill
    this.ctx.fillStyle = "saddlebrown";
    this.ctx.beginPath();
    this.ctx.arc(this.hill.x, this.hill.y, 20, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw ants
    this.ctx.fillStyle = "black";
    for (let ant of this.ants) {
      this.ctx.beginPath();
      this.ctx.ellipse(ant.x, ant.y, 10, 3, ant.direction, 0, Math.PI * 2);
      this.ctx.fill();
    }
  };
}

export default Renderer;
