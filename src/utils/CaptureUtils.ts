import html2canvas from "html2canvas";
import { download_canvas } from "./DownloadUtils";

function resize_canvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  if (window.devicePixelRatio === 1) {
    return canvas;
  }

  const ratio = 1 / window.devicePixelRatio;
  const newCanvas = document.createElement("canvas");
  newCanvas.width = canvas.width * ratio;
  newCanvas.height = canvas.height * ratio;

  const ctx = newCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
  return newCanvas;
}

export async function capture_and_save(id: string, filename: string, resize: boolean=false) {
  let canvas = await html2canvas(document.getElementById(id)!);
  if (resize) {
    canvas = resize_canvas(canvas);
  }

  download_canvas(canvas, filename);
}
