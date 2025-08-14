// ViewTreeBuilder.js - 视图树构建工具
import { RevixComponent } from '../core/RevixComponent.js';

export class ViewTreeBuilder {
    constructor() {
        this.root = null;
        this.currentPath = [];
    }

    // 创建根视图
    createRoot(config = {}) {
        this.root = new RevixComponent({
            type: 'RootView',
            bounds: config.bounds || [-200, 200, 200, -200],
            backgroundColor: config.backgroundColor || '#f0f0f0',
            ...config
        });
        this.currentPath = [this.root];
        return this;
    }

    // 添加子视图
    addView(config = {}) {
        const view = new RevixComponent(config);
        this.getCurrentNode().addChild(view);
        return this;
    }

    // 进入子视图（用于链式调用）
    enterView(index = 0) {
        const currentNode = this.getCurrentNode();
        if (currentNode.children && currentNode.children[index]) {
            this.currentPath.push(currentNode.children[index]);
        }
        return this;
    }

    // 返回父视图
    exitView() {
        if (this.currentPath.length > 1) {
            this.currentPath.pop();
        }
        return this;
    }

    // 获取当前节点
    getCurrentNode() {
        return this.currentPath[this.currentPath.length - 1];
    }

    // 构建常见的UI组件
    addButton(config = {}) {
        return this.addView({
            type: 'Button',
            backgroundColor: config.backgroundColor || '#007AFF',
            textColor: config.textColor || '#FFFFFF',
            text: config.text || 'Button',
            ...config
        });
    }

    addTextView(config = {}) {
        return this.addView({
            type: 'TextView',
            backgroundColor: config.backgroundColor || '#FFFFFF',
            textColor: config.textColor || '#000000',
            text: config.text || 'Text',
            ...config
        });
    }

    addImageView(config = {}) {
        return this.addView({
            type: 'ImageView',
            backgroundColor: config.backgroundColor || '#E5E5EA',
            text: config.text || '[Image]',
            ...config
        });
    }

    addContainer(config = {}) {
        return this.addView({
            type: 'Container',
            backgroundColor: config.backgroundColor || '#F2F2F7',
            ...config
        });
    }

    // 构建完成，返回根节点
    build() {
        return this.root;
    }

    // 从JSON数据构建视图树
    static fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        return RevixComponent.fromJSON(json);
    }

    // 创建示例视图树
    static createExample() {
        return new ViewTreeBuilder()
            .createRoot({ backgroundColor: '#f0f0f0' })
            .addContainer({ bounds: [-150, 150, 150, -150], backgroundColor: '#ffffff' })
            .enterView(0)
                .addTextView({ bounds: [-120, 120, 120, 80], text: 'Hello Revix!', backgroundColor: '#e8f4fd' })
                .addButton({ bounds: [-50, 50, 50, 10], text: 'Click Me', backgroundColor: '#007AFF' })
                .addImageView({ bounds: [-100, 30, -20, -30], text: '[Logo]', backgroundColor: '#ffeb3b' })
            .exitView()
            .build();
    }
} 