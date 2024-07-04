// Initialize canvas and rendering context with correct width and height
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;
const c = <CanvasRenderingContext2D>canvas.getContext("2d");

var frame = 0;

const animationLoop = () => {
  // Recursive
  window.requestAnimationFrame(animationLoop);

  // Clear screen
  c.clearRect(0, 0, canvas.width, canvas.height);

  frame += 1;
};

// Start animation loop
window.requestAnimationFrame(animationLoop);
