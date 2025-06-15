// RevixCore.js - WebGL 3D View Tree Renderer (with Camera Controls)
import { mat4 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';

export class RevixRenderer {
    constructor(canvas, viewTree) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl');
        this.viewTree = viewTree;
        if (!this.gl) throw new Error('WebGL not supported');
        this.viewMap = new Map(); // id -> viewNode
        this.selectedId = null;

        this.initGL();
        this.initShaders();
        this.initBuffers();
        this.initPickingBuffer();
        this.initCamera();
        this.initEvents();
    }

    initGL() {
        const gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }

    initShaders() {
        const gl = this.gl;

        const vsSource = `
      attribute vec3 a_position;
      uniform mat4 u_matrix;
      void main() {
        gl_Position = u_matrix * vec4(a_position, 1.0);
      }
    `;

        const fsSource = `
            precision mediump float;
            uniform vec4 u_color;
            uniform vec4 u_highlightColor;
            uniform bool u_useHighlight;

            void main() {
                gl_FragColor = u_useHighlight ? u_highlightColor : u_color;
            }
    `;

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsSource);
        gl.compileShader(vs);

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSource);
        gl.compileShader(fs);

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        this.program = program;
        this.a_position = gl.getAttribLocation(program, 'a_position');
        this.u_matrix = gl.getUniformLocation(program, 'u_matrix');
        this.u_color = gl.getUniformLocation(program, 'u_color');
        this.u_highlightColor = gl.getUniformLocation(program, 'u_highlightColor');
        this.u_useHighlight = gl.getUniformLocation(program, 'u_useHighlight');
    }

    initBuffers() {
        this.vertexBuffer = this.gl.createBuffer();
    }

    initPickingBuffer() {
        const gl = this.gl;
        const fb = gl.createFramebuffer();
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.clientWidth, this.canvas.clientHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    
        this.pickingFramebuffer = fb;
        this.pickingTexture = tex;
      }

    initCamera() {
        this.camera = {
            distance: 400,
            angleX: 0,
            angleY: 0,
            dragging: false,
            dragMode: null, // 'rotate' or 'pan'
            lastX: 0,
            lastY: 0,
            offsetX: 0,
            offsetY: 0,
            fov: Math.PI / 4
        };
    }

    initEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.camera.dragMode = 'rotate'; // 左键旋转
            } else if (e.button === 1) {
                this.camera.dragMode = 'pan'; // 右键平移
            } else {
                this.camera.dragging = false;
                this.camera.dragMode = null;
                return; // 忽略其他键
            }

            this.camera.dragging = true;
            this.camera.lastX = e.clientX;
            this.camera.lastY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            this.camera.dragging = false;
            this.camera.dragMode = null;
        });

        window.addEventListener('mouseleave', () => {
            this.camera.dragging = false;
            this.camera.dragMode = null;
        });
        window.addEventListener('blur', () => {
            this.camera.dragging = false;
            this.camera.dragMode = null;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.camera.dragging) return;
            const dx = e.clientX - this.camera.lastX;
            const dy = e.clientY - this.camera.lastY;
            this.camera.lastX = e.clientX;
            this.camera.lastY = e.clientY;
            if (this.camera.dragMode === 'rotate') {
                // 示例：更新旋转角度
                this.camera.angleY += dx * 0.01;
                this.camera.angleX += dy * 0.01;
            } else if (this.camera.dragMode === 'pan') {
                // 平移相机
                this.camera.offsetX += dx * 1.0;
                this.camera.offsetY -= dy * 1.0;
            }
        });

        window.addEventListener('resize', () => this.resize());


        this.canvas.addEventListener('wheel', (e) => {
            this.camera.distance += e.deltaY * 0.5;
            this.camera.distance = Math.max(50, Math.min(2000, this.camera.distance));
        });

        // 添加点击事件处理
        this.canvas.addEventListener('click', (e) => {
            if (this.camera.dragging) return; // 如果正在拖动，不处理点击

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 渲染拾取场景
            this.renderPickingScene();

            // 获取点击位置的ID
            const id = this.getPickedId(x, y);

            // 如果点击到了某个对象
            if (id > 0) {
                this.selectedId = id;
                const node = this.viewMap.get(id);
                if (node) {
                    console.log('Selected node:', node);
                }
            } else {
                this.selectedId = null;
            }
        });
    }

    drawView(bounds, colorVec4, z, isSelected = false) {
        const gl = this.gl;
        const [l, t, r, b] = bounds;
        const vertices = new Float32Array([
            l, b, z, r, b, z, r, t, z,
            l, b, z, r, t, z, l, t, z,
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(this.a_position);
        gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

        const aspect = this.canvas.width / this.canvas.height;
        const projection = mat4.create();
        const view = mat4.create();
        const model = mat4.create();

        mat4.perspective(projection, this.camera.fov, aspect, 0.1, 5000);
        const eye = [
            this.camera.distance * Math.sin(this.camera.angleY) * Math.cos(this.camera.angleX) * -1,
            this.camera.distance * Math.sin(this.camera.angleX),
            this.camera.distance * Math.cos(this.camera.angleY) * Math.cos(this.camera.angleX),
        ];
        mat4.lookAt(view, eye, [0, 0, 0], [0, 1, 0]);

        const matrix = mat4.create();
        mat4.multiply(matrix, projection, view);
        mat4.multiply(matrix, matrix, model);
        mat4.translate(matrix, matrix, [
            this.camera.offsetX,
            this.camera.offsetY,
            0
        ]);


        gl.uniformMatrix4fv(this.u_matrix, false, matrix);
        gl.uniform4fv(this.u_color, colorVec4);
        gl.uniform4fv(this.u_highlightColor, [1.0, 1.0, 0.0, 1.0]); // 黄色高亮
        gl.uniform1i(this.u_useHighlight, isSelected);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    renderPickingScene() {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.renderTreeForPicking(this.viewTree);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    renderTreeForPicking(rootNode, depth = 0) {
        const z = depth * 10;
        const id = rootNode._id;
        const color = this.idToColor(id);
        this.drawView(rootNode.bounds, color, z);

        if (rootNode.children) {
            rootNode.children.forEach(child => this.renderTreeForPicking(child, depth + 1));
        }
    }

    renderTree(rootNode, depth = 0) {
        const z = depth * 10;
        const color = this.hexToVec4(rootNode.backgroundColor || '#cccccc');
        const isSelected = rootNode._id === this.selectedId;
        this.drawView(rootNode.bounds, color, z, isSelected);

        if (rootNode.children) {
            rootNode.children.forEach(child => this.renderTree(child, depth + 1));
        }
    }

    getPickedId(x, y) {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
        const pixel = new Uint8Array(4);
        gl.readPixels(x, this.canvas.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return this.colorToId(pixel[0], pixel[1], pixel[2]);
    }

    hexToVec4(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = ((bigint >> 16) & 255) / 255;
        const g = ((bigint >> 8) & 255) / 255;
        const b = (bigint & 255) / 255;
        return [r, g, b, 1.0];
    }

    clear() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    resize() {
        const gl = this.gl;
        const canvas = this.canvas;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }

    idToColor(id) {
        const r = (id >> 16) & 0xff;
        const g = (id >> 8) & 0xff;
        const b = id & 0xff;
        
        return [r / 255, g / 255, b / 255, 1.0];
      }
    
      colorToId(r, g, b) {
        return (r << 16) | (g << 8) | b;
      }

}
