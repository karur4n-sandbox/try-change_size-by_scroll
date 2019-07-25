import bgImageSrc from "./images/bg.jpg";
import maskImageSrc from "./images/irasutoya.png";
import { loadImage } from "./loadImage";

let canvasEl: HTMLCanvasElement | undefined = undefined;
let canvasContext: CanvasRenderingContext2D | null = null;
let bgImage: ImageBitmap | undefined = undefined;
let maskImage: ImageBitmap | undefined = undefined;

let maskScale = 100;

let touchStartY = 0;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

document.addEventListener("DOMContentLoaded", async () => {
  canvasEl = document.getElementById("canvas") as HTMLCanvasElement;

  canvasEl.style.width = windowWidth + "px";
  canvasEl.style.height = windowHeight + "px";

  var scale = window.devicePixelRatio;
  canvasEl.width = windowWidth * scale;
  canvasEl.height = windowHeight * scale;

  canvasContext = canvasEl.getContext("2d");

  const result = await Promise.all([
    loadImage(bgImageSrc),
    loadImage(maskImageSrc)
  ]);

  bgImage = result[0] as ImageBitmap;
  maskImage = result[1] as ImageBitmap;

  window.addEventListener("wheel", e => {
    window.requestAnimationFrame(() => {
      clearCanvas();

      maskScale = (() => {
        const next = maskScale + e.deltaY;

        return next >= 0 ? next : 0;
      })();

      draw(maskScale);
    });
  });

  window.addEventListener("touchstart", e => {
    touchStartY = e.changedTouches[0].clientY;
  });

  window.addEventListener("touchmove", e => {
    window.requestAnimationFrame(() => {
      clearCanvas();

      maskScale = (() => {
        const latestY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - latestY;
        const next = maskScale - deltaY * 0.1;

        return next >= 0 ? next : 0;
      })();

      draw(maskScale);
    });
  });

  draw(maskScale);
});

function clearCanvas() {
  canvasContext!.clearRect(0, 0, canvasEl!.width, canvasEl!.height);
  canvasContext!.globalCompositeOperation = "source-over";
}

function draw(scale: number) {
  if (scale === 0) {
    return;
  }

  canvasContext!.drawImage(bgImage!, 0, 0, canvasEl!.width, canvasEl!.height);

  canvasContext!.globalCompositeOperation = "destination-in";

  const drawWidth = maskImage!.width * scale * 0.01;
  const drawHeight = maskImage!.height * scale * 0.01;

  canvasContext!.drawImage(
    maskImage!,
    0,
    0,
    maskImage!.width,
    maskImage!.height,
    canvasEl!.width / 2 - drawWidth / 2,
    canvasEl!.height / 2 - drawHeight / 2,
    drawWidth,
    drawHeight
  );
}
