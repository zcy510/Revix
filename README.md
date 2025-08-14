# Revix

Revix 是一个轻量级的 JavaScript 库，用于在浏览器中可视化原生 Android/iOS 的视图树。只需提供视图层级的 JSON 数据，Revix 就能重建 UI 布局，并支持交互式图层查看，是调试、UI 检查和视觉回归测试的理想工具。

## ✨ 特性

- 🎯 **精确还原** - 支持 Android/iOS 视图树的精确还原
- 🔍 **交互式调试** - 支持图层点击、选择和信息查看
- 🎨 **样式还原** - 支持原生视图样式和布局的还原
- 📦 **轻量级** - 无依赖，体积小巧
- 🚀 **简单易用** - 提供多种便捷的 API
- 🔌 **插件系统** - 支持自定义插件扩展功能
- 📱 **事件系统** - 完整的事件监听和处理机制
- 🛠️ **TypeScript** - 完整的 TypeScript 类型支持

## 📦 安装

```bash
npm install revix
```

## 🚀 快速开始

### 最简单的使用方式

```javascript
import { createExample } from 'revix';

const canvas = document.getElementById('revix-canvas');
const revix = createExample(canvas);
```

### 从 JSON 数据创建

```javascript
import { createFromJSON } from 'revix';

const jsonData = {
    bounds: [-100, 100, 100, -100],
    backgroundColor: '#ff9999',
    children: [
        {
            bounds: [-80, 80, 0, 0],
            backgroundColor: '#99ccff',
            text: 'Hello World'
        }
    ]
};

const canvas = document.getElementById('revix-canvas');
const revix = createFromJSON(canvas, jsonData);
```

### 自定义配置

```javascript
import { createRevix } from 'revix';

const canvas = document.getElementById('revix-canvas');
const revix = createRevix(canvas, {
    viewTree: customViewTree,
    enableInspector: true,  // 启用检查器插件
    autoRender: true        // 自动渲染
});
```

## 🛠️ API 文档

### 工厂函数

| 函数 | 描述 |
|------|------|
| `createRevix(canvas, options)` | 创建 Revix 实例 |
| `createExample(canvas, options)` | 创建示例实例 |
| `createFromJSON(canvas, json, options)` | 从 JSON 创建实例 |

### 视图树构建器

```javascript
import { ViewTreeBuilder } from 'revix';

const viewTree = new ViewTreeBuilder()
    .createRoot({ backgroundColor: '#f0f0f0' })
    .addContainer({ bounds: [-150, 150, 150, -150] })
    .enterView(0)
        .addTextView({ 
            bounds: [-120, 120, 120, 80], 
            text: '标题', 
            backgroundColor: '#e8f4fd' 
        })
        .addButton({ 
            bounds: [-50, 50, 50, 10], 
            text: '按钮', 
            backgroundColor: '#007AFF' 
        })
        .addImageView({ 
            bounds: [-100, 30, -20, -30], 
            text: '[图片]' 
        })
    .exitView()
    .build();
```

### 事件系统

```javascript
// 监听节点选择事件
revix.on('nodeSelected', (node) => {
    console.log('选中节点:', node);
});

// 监听节点取消选择事件
revix.on('nodeDeselected', () => {
    console.log('取消选择');
});

// 监听相机移动事件
revix.on('cameraMoved', (camera) => {
    console.log('相机位置:', camera);
});
```

### 插件系统

```javascript
// 注册自定义插件
class MyPlugin extends BasePlugin {
    init(renderer, pluginManager) {
        // 插件初始化逻辑
    }
    
    destroy() {
        // 插件清理逻辑
    }
}

revix.pluginManager.register('myPlugin', new MyPlugin());

// 获取已注册的插件
const inspector = revix.pluginManager.get('inspector');
```

## 📋 视图树数据格式

视图树数据应该是一个 JSON 对象，包含以下属性：

```javascript
{
    id: 1,                    // 节点ID
    type: "View",             // 视图类型
    bounds: [0, 0, 100, 100], // 边界 [left, top, right, bottom]
    backgroundColor: "#ffffff", // 背景颜色
    textColor: "#000000",     // 文本颜色
    text: "Hello World",      // 文本内容
    visible: true,            // 是否可见
    children: [],             // 子视图数组
    metadata: {}              // 自定义元数据
}
```

## 🎮 交互控制

- **左键拖拽** - 旋转视角
- **右键拖拽** - 平移视角
- **滚轮** - 缩放
- **点击** - 选择节点

## 🔌 内置插件

### InspectorPlugin (检查器插件)

自动显示选中节点的详细信息，包括：
- 节点类型和ID
- 边界坐标
- 背景颜色
- 文本内容
- 子节点数量

```javascript
// 手动注册检查器插件
import { InspectorPlugin } from 'revix';
revix.pluginManager.register('inspector', new InspectorPlugin());
```

## 📝 示例

查看 `examples/` 目录下的完整示例：

- [基础使用示例](./examples/basic-usage.html) - 展示基本功能
- [插件开发示例](./examples/plugin-development.html) - 如何开发自定义插件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发环境设置

```bash
git clone https://github.com/zcy510/Revix.git
cd Revix
npm install
npm run dev
```

## 📄 许可证

MIT