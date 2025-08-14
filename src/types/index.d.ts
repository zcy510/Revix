// Revix TypeScript 类型定义

export interface ViewNode {
    id?: number;
    _id?: number;
    type?: string;
    bounds: [number, number, number, number]; // [left, top, right, bottom]
    backgroundColor?: string;
    textColor?: string;
    text?: string;
    visible?: boolean;
    children?: ViewNode[];
    metadata?: Record<string, any>;
}

export interface RevixOptions {
    viewTree?: ViewNode;
    enableInspector?: boolean;
    autoRender?: boolean;
    camera?: {
        distance?: number;
        angleX?: number;
        angleY?: number;
        fov?: number;
    };
}

export interface PluginOptions {
    enabled?: boolean;
    [key: string]: any;
}

export interface RevixRenderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    viewTree: ViewNode | null;
    selectedId: number | null;
    pluginManager: PluginManager;
    
    // 事件系统
    on(event: string, callback: Function): this;
    off(event: string, callback: Function): this;
    emit(event: string, ...args: any[]): this;
    once(event: string, callback: Function): this;
    
    // 渲染方法
    clear(): void;
    resize(): void;
    renderTree(rootNode: ViewNode, depth?: number): void;
    renderPickingScene(): void;
    
    // 视图树管理
    setViewTree(viewTree: ViewNode): void;
    
    // 相机控制
    camera: {
        distance: number;
        angleX: number;
        angleY: number;
        offsetX: number;
        offsetY: number;
        fov: number;
    };
}

export interface RevixComponent {
    id: number;
    bounds: [number, number, number, number];
    backgroundColor: string;
    textColor: string;
    text: string;
    type: string;
    visible: boolean;
    children: RevixComponent[];
    metadata: Record<string, any>;
    
    addChild(child: RevixComponent): this;
    removeChild(childId: number): this;
    setBounds(bounds: [number, number, number, number]): this;
    setBackgroundColor(color: string): this;
    setText(text: string): this;
    setVisible(visible: boolean): this;
    toJSON(): ViewNode;
    static fromJSON(json: ViewNode): RevixComponent;
}

export interface ViewTreeBuilder {
    root: RevixComponent | null;
    currentPath: RevixComponent[];
    
    createRoot(config?: Partial<ViewNode>): this;
    addView(config?: Partial<ViewNode>): this;
    enterView(index?: number): this;
    exitView(): this;
    getCurrentNode(): RevixComponent;
    
    addButton(config?: Partial<ViewNode>): this;
    addTextView(config?: Partial<ViewNode>): this;
    addImageView(config?: Partial<ViewNode>): this;
    addContainer(config?: Partial<ViewNode>): this;
    
    build(): RevixComponent;
    static fromJSON(json: ViewNode | string): RevixComponent;
    static createExample(): RevixComponent;
}

export interface PluginManager {
    renderer: RevixRenderer;
    plugins: Map<string, BasePlugin>;
    hooks: Map<string, Function[]>;
    
    register(name: string, plugin: BasePlugin): this;
    unregister(name: string): this;
    get(name: string): BasePlugin | undefined;
    addHook(name: string, callback: Function): this;
    executeHook(name: string, ...args: any[]): this;
    getPluginNames(): string[];
}

export interface BasePlugin {
    options: PluginOptions;
    enabled: boolean;
    renderer?: RevixRenderer;
    pluginManager?: PluginManager;
    
    init(renderer: RevixRenderer, pluginManager: PluginManager): void;
    enable(): void;
    disable(): void;
    destroy(): void;
}

export interface InspectorPlugin extends BasePlugin {
    panel: HTMLElement | null;
    currentNode: ViewNode | null;
    
    showNodeInfo(node: ViewNode): void;
    hidePanel(): void;
}

// 事件类型
export const RevixEvents: {
    NODE_SELECTED: 'nodeSelected';
    NODE_DESELECTED: 'nodeDeselected';
    NODE_HOVER: 'nodeHover';
    NODE_CLICK: 'nodeClick';
    CAMERA_MOVED: 'cameraMoved';
    RENDER_START: 'renderStart';
    RENDER_END: 'renderEnd';
    ERROR: 'error';
};

// 工厂函数
export function createRevix(canvas: HTMLCanvasElement, options?: RevixOptions): RevixRenderer;
export function createExample(canvas: HTMLCanvasElement, options?: RevixOptions): RevixRenderer;
export function createFromJSON(canvas: HTMLCanvasElement, jsonData: ViewNode | string, options?: RevixOptions): RevixRenderer;

// 默认导出
export default RevixRenderer; 