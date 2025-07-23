// src/RevixComponent.ts
import { RevixRenderer } from './RevixCore.js';
export class RevixComponent extends HTMLElement {
    private renderer: RevixRenderer | null = null;
    private canvas: HTMLCanvasElement;
    private viewTree: any | null = null;
  
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      // 创建 canvas 元素
      this.canvas = document.createElement('canvas');
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.display = 'block';
      shadow.appendChild(this.canvas);
    }
  
    connectedCallback() {
      this.setupRenderer();
    }
  
    set data(viewTree: any) {
      this.viewTree = viewTree;
      if (!this.renderer){
        console.log("renderer is not intialized!");
        return;
      }
      this.renderer.setViewTree(viewTree);
    }
  
    private setupRenderer() {
      const canvas = this.canvas;
      this.renderer = new RevixRenderer(canvas, this.viewTree);
      const loop = () => {
        if(this.renderer!.viewTree != null){
          this.renderer!.clear();
          this.renderer!.resize();
          this.renderer!.renderPickingScene();
          this.renderer!.renderTree(this.renderer!.viewTree);
        }
        requestAnimationFrame(loop);
      };
      loop();
    }
  }
  