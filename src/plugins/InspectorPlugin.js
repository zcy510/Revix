// InspectorPlugin.js - 检查器插件
import { BasePlugin } from './PluginManager.js';
import { RevixEvents } from '../core/RevixEvents.js';

export class InspectorPlugin extends BasePlugin {
    constructor(options = {}) {
        super(options);
        this.panel = null;
        this.currentNode = null;
    }

    init(renderer, pluginManager) {
        super.init(renderer, pluginManager);
        
        // 监听节点选择事件
        this.renderer.on(RevixEvents.NODE_SELECTED, (node) => {
            this.showNodeInfo(node);
        });

        this.renderer.on(RevixEvents.NODE_DESELECTED, () => {
            this.hidePanel();
        });

        this.createPanel();
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: none;
            max-height: 80vh;
            overflow-y: auto;
        `;

        document.body.appendChild(this.panel);
    }

    showNodeInfo(node) {
        this.currentNode = node;
        this.panel.style.display = 'block';
        
        this.panel.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; color: #333;">节点信息</h3>
                <div style="color: #666; font-size: 12px;">ID: ${node._id || node.id}</div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <strong>类型:</strong> ${node.type || 'Unknown'}
            </div>
            
            <div style="margin-bottom: 12px;">
                <strong>边界:</strong> [${node.bounds?.join(', ') || 'N/A'}]
            </div>
            
            <div style="margin-bottom: 12px;">
                <strong>背景色:</strong> 
                <span style="display: inline-block; width: 20px; height: 16px; background: ${node.backgroundColor || '#ccc'}; border: 1px solid #ddd; vertical-align: middle; margin-left: 8px;"></span>
                ${node.backgroundColor || '#ccc'}
            </div>
            
            ${node.text ? `<div style="margin-bottom: 12px;"><strong>文本:</strong> ${node.text}</div>` : ''}
            
            ${node.children && node.children.length > 0 ? 
                `<div style="margin-bottom: 12px;"><strong>子节点:</strong> ${node.children.length} 个</div>` : ''}
            
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #eee;">
                <button onclick="this.parentElement.parentElement.style.display='none'" 
                        style="background: #007AFF; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    关闭
                </button>
            </div>
        `;
    }

    hidePanel() {
        if (this.panel) {
            this.panel.style.display = 'none';
        }
        this.currentNode = null;
    }

    destroy() {
        super.destroy();
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
    }
} 