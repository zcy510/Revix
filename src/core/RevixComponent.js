// RevixComponent.js - 视图组件基类
export class RevixComponent {
    constructor(config = {}) {
        this.id = config.id || this.generateId();
        this.bounds = config.bounds || [0, 0, 100, 100];
        this.backgroundColor = config.backgroundColor || '#cccccc';
        this.textColor = config.textColor || '#000000';
        this.text = config.text || '';
        this.type = config.type || 'View';
        this.visible = config.visible !== false;
        this.children = config.children || [];
        this.metadata = config.metadata || {};
        
        // 为每个子组件分配ID
        this.children.forEach((child, index) => {
            if (!child.id) {
                child.id = this.generateId();
            }
        });
    }

    generateId() {
        return Math.floor(Math.random() * 0xFFFFFF) + 1;
    }

    addChild(child) {
        if (!child.id) {
            child.id = this.generateId();
        }
        this.children.push(child);
        return this;
    }

    removeChild(childId) {
        this.children = this.children.filter(child => child.id !== childId);
        return this;
    }

    setBounds(bounds) {
        this.bounds = bounds;
        return this;
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
        return this;
    }

    setText(text) {
        this.text = text;
        return this;
    }

    setVisible(visible) {
        this.visible = visible;
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            bounds: this.bounds,
            backgroundColor: this.backgroundColor,
            textColor: this.textColor,
            text: this.text,
            type: this.type,
            visible: this.visible,
            children: this.children.map(child => 
                child instanceof RevixComponent ? child.toJSON() : child
            ),
            metadata: this.metadata
        };
    }

    static fromJSON(json) {
        const component = new RevixComponent({
            id: json.id,
            bounds: json.bounds,
            backgroundColor: json.backgroundColor,
            textColor: json.textColor,
            text: json.text,
            type: json.type,
            visible: json.visible,
            metadata: json.metadata
        });

        if (json.children) {
            component.children = json.children.map(child => 
                RevixComponent.fromJSON(child)
            );
        }

        return component;
    }
} 