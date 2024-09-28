import { currentState } from "../hooks/index.js";

const acceptedTypes = {
    "button": 1,
    "selectmenu": 2,
    "textinput": 3,
    "modal": 4
}

class Component {
    constructor(run) {
        /** 
         * @type {Function}
         */
        this.run = run;

        /** 
         * @type {number} 
         */
        this.render = 0;

        /** 
         * @type {import('../lib').RenderTarget} 
         */
        this.target;

        /**
         * @type {number}
         */
        this.id;

        /**
         * @type {unknown[]}
         */
        this.props = [];

        this.hooks = {
            list: [],
            pendingEffects: []
        }
    }

    /** @type {number} */
    static currentId;

    /** @type {number} */
    static currentRenderIndex;

    /** @type {Map<string, number>} */
    static typeCache = new Map();
    
    static generateId(type) {
        if(!currentState.component) throw new Error('This Element can\'t be used outside a Diseact Component')

        if(this.currentId != currentState.component.id || this.currentRenderIndex != currentState.component.render) {
            this.typeCache.clear();
        }

        this.currentId = currentState.component.id;
        this.currentRenderIndex = currentState.component.render;

        let n = this.typeCache.get(type) ?? 0;
        n += 1;

        this.typeCache.set(type, n);

        return `${this.currentId}${acceptedTypes[type]}${n}`;
    }
}

export default Component;