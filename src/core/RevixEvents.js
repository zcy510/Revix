// RevixEvents.js - 事件系统
export class RevixEventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
        return this;
    }

    off(event, callback) {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
        return this;
    }

    emit(event, ...args) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
        return this;
    }

    once(event, callback) {
        const onceCallback = (...args) => {
            this.off(event, onceCallback);
            callback(...args);
        };
        return this.on(event, onceCallback);
    }
}

// 预定义的事件类型
export const RevixEvents = {
    NODE_SELECTED: 'nodeSelected',
    NODE_DESELECTED: 'nodeDeselected',
    NODE_HOVER: 'nodeHover',
    NODE_CLICK: 'nodeClick',
    CAMERA_MOVED: 'cameraMoved',
    RENDER_START: 'renderStart',
    RENDER_END: 'renderEnd',
    ERROR: 'error'
}; 