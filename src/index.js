import { initRenderer, drawViewTree } from './renderer.js';

export function renderViewTree(viewTree, container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.appendChild(canvas);

  const gl = initRenderer(canvas);
  if (!gl) return;

  drawViewTree(gl, viewTree);
}
