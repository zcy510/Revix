// Revix Library Entry Point

// 核心模块
export { RevixRenderer } from './core/RevixCore.js';
export { RevixComponent } from './core/RevixComponent.js';
export { RevixEventEmitter, RevixEvents } from './core/RevixEvents.js';

// 工具模块
export { ViewTreeBuilder } from './utils/ViewTreeBuilder.js';

// 插件系统
export { PluginManager, BasePlugin } from './plugins/PluginManager.js';
export { InspectorPlugin } from './plugins/InspectorPlugin.js';

// 便捷的工厂函数
import { RevixRenderer } from './core/RevixCore.js';
import { ViewTreeBuilder } from './utils/ViewTreeBuilder.js';
import { PluginManager } from './plugins/PluginManager.js';
import { InspectorPlugin } from './plugins/InspectorPlugin.js';

// 创建Revix实例的便捷函数
export function createRevix(canvas, options = {}) {
    const renderer = new RevixRenderer(canvas, options.viewTree || null);
    
    // 添加插件管理器
    renderer.pluginManager = new PluginManager(renderer);
    
    // 自动注册检查器插件
    if (options.enableInspector !== false) {
        renderer.pluginManager.register('inspector', new InspectorPlugin());
    }
    
    // 启动渲染循环
    if (options.autoRender !== false) {
        function renderLoop() {
            renderer.clear();
            renderer.resize();
            renderer.renderPickingScene();
            renderer.renderTree(renderer.viewTree);
            requestAnimationFrame(renderLoop);
        }
        renderLoop();
    }
    
    return renderer;
}

// 快速创建示例
export function createExample(canvas, options = {}) {
    const viewTree = ViewTreeBuilder.createExample();
    return createRevix(canvas, { ...options, viewTree });
}

// 从JSON创建实例
export function createFromJSON(canvas, jsonData, options = {}) {
    const viewTree = ViewTreeBuilder.fromJSON(jsonData);
    return createRevix(canvas, { ...options, viewTree });
}

// Default export
export default RevixRenderer;