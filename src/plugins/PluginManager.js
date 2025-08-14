// PluginManager.js - 插件管理器
export class PluginManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.plugins = new Map();
        this.hooks = new Map();
    }

    // 注册插件
    register(name, plugin) {
        if (this.plugins.has(name)) {
            console.warn(`Plugin ${name} already registered, overwriting...`);
        }

        this.plugins.set(name, plugin);
        
        // 初始化插件
        if (typeof plugin.init === 'function') {
            plugin.init(this.renderer, this);
        }

        return this;
    }

    // 卸载插件
    unregister(name) {
        const plugin = this.plugins.get(name);
        if (plugin && typeof plugin.destroy === 'function') {
            plugin.destroy();
        }
        this.plugins.delete(name);
        return this;
    }

    // 获取插件
    get(name) {
        return this.plugins.get(name);
    }

    // 添加钩子
    addHook(name, callback) {
        if (!this.hooks.has(name)) {
            this.hooks.set(name, []);
        }
        this.hooks.get(name).push(callback);
        return this;
    }

    // 执行钩子
    executeHook(name, ...args) {
        if (this.hooks.has(name)) {
            this.hooks.get(name).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in hook ${name}:`, error);
                }
            });
        }
        return this;
    }

    // 获取所有插件名称
    getPluginNames() {
        return Array.from(this.plugins.keys());
    }
}

// 基础插件类
export class BasePlugin {
    constructor(options = {}) {
        this.options = options;
        this.enabled = true;
    }

    init(renderer, pluginManager) {
        this.renderer = renderer;
        this.pluginManager = pluginManager;
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    destroy() {
        this.enabled = false;
    }
} 