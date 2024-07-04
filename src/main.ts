const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

var frame = 0;

const animationLoop = () => {
  // Recursive
  window.requestAnimationFrame(animationLoop);

  // Clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frame += 1;
};

// Start animation loop
window.requestAnimationFrame(animationLoop);
