import { vertexShaderSrc, fragmentShaderSrc } from './shader.js';

export function initRenderer(canvas) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return null;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  gl.program = program;
  return gl;
}

export function drawViewTree(gl, viewTree) {
  gl.clearColor(1, 1, 1, 1); // white background
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawNode(gl, viewTree);
}

function drawNode(gl, node) {
  const [x1, y1, x2, y2] = node.bounds; // pixel coordinates
  const canvas = gl.canvas;

  const fx = x => (x / canvas.width) * 2 - 1;
  const fy = y => 1 - (y / canvas.height) * 2;

  const xL = fx(x1);
  const yT = fy(y1);
  const xR = fx(x2);
  const yB = fy(y2);

  const vertices = new Float32Array([
    xL, yT, xR, yT,
    xL, yB, xR, yB
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(gl.program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const colorLoc = gl.getUniformLocation(gl.program, 'u_color');
  gl.uniform4f(colorLoc, 0.2, 0.6, 0.9, 1.0); // blue rectangle

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // draw children
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      drawNode(gl, child);
    }
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link failed:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}
