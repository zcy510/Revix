# Revix
Revix is a lightweight JavaScript library that visualizes native Android/iOS view trees directly in the browser. Just provide a JSON dump of the view hierarchy, and Revix will reconstruct the UI layout with interactive layers, making it ideal for debugging, UI inspection, and visual regression workflows.

Revix 是一个轻量级的 JavaScript 库，用于在浏览器中可视化原生 Android/iOS 的视图树。只需提供视图层级的 JSON 数据，Revix 就能重建 UI 布局，并支持交互式图层查看，是调试、UI 检查和视觉回归测试的理想工具。

## 特性

- 🎯 支持 Android/iOS 视图树的精确还原
- 🔍 交互式图层查看和调试
- 🎨 支持原生视图样式和布局的还原
- 📦 轻量级，无依赖
- 🚀 简单易用的 API

## 安装

```bash
npm install revix
```


## 使用方法

```javascript
import { RevixRenderer } from './core/RevixCore.js';

    const viewTree = {
      bounds: [-100, 100, 100, -100],
      backgroundColor: '#ff9999',
      _id: 1,
      children: [
        {
          bounds: [-80, 80, 0, 0],
          backgroundColor: '#99ccff',
          _id: 2,
        },
        {
          bounds: [10, 90, 90, 10],
          backgroundColor: '#99ff99',
          _id: 3,
          children: [
            {
              bounds: [30, 70, 70, 30],
              backgroundColor: '#ffff99',
              _id: 4
            }
          ]
        }
      ]
    };

    const canvas = document.getElementById('revix-canvas');
    const renderer = new RevixRenderer(canvas, viewTree);

    // ✅ 启动渲染循环
    function renderLoop() {
    renderer.clear();
    renderer.resize();
    renderer.renderPickingScene(); // 先渲染拾取场景
    renderer.renderTree(viewTree);  // 再渲染主场景
    requestAnimationFrame(renderLoop);
    }
    renderLoop();
```

## 视图树数据格式

视图树数据应该是一个 JSON 对象，包含以下属性：

- `type`: 视图类型（如 View、TextView、Button 等）
- `bounds`: 视图边界 [x, y, width, height]
- `children`: 子视图数组
- `text`: 文本内容（适用于 TextView、Button 等）
- `backgroundColor`: 背景颜色
- `textColor`: 文本颜色
- 其他原生视图属性...

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT