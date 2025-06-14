export const vertexShaderSrc = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;

export const fragmentShaderSrc = `
precision mediump float;
uniform vec4 u_color;
void main() {
  gl_FragColor = u_color;
}
`;
