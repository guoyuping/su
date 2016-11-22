module su {
    /**
	 * @class  Sortable
	 * @param  {HTMLElement}  element
	 * @param  {Object}       [options]
	 */
    export class Sortable {
        element: HTMLElement;
        options;
        nativeDraggable;
        defaults = {
            group: Math.random(),
            sort: true,
            disabled: false,
            store: null,
            handle: null,
            scroll: true,
            scrollSensitivity: 30,
            scrollSpeed: 10,
            draggable: /[uo]l/i.test(this.element.nodeName) ? 'li' : '>*',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            ignore: 'a, img',
            filter: null,
            animation: 0,
            setData: function (dataTransfer, dragEl) {
                dataTransfer.setData('Text', dragEl.textContent);
            },
            dropBubble: false,
            dragoverBubble: false,
            dataIdAttr: 'data-id',
            delay: 0,
            forceFallback: false,
            fallbackClass: 'sortable-fallback',
            fallbackOnBody: false,
            fallbackTolerance: 0,
            fallbackOffset: { x: 0, y: 0 }
        };
        constructor(element, options) {
            if (!(element && element.nodeType && element.nodeType === 1)) {
                throw 'Sortable: `element` must be HTMLelementement, and not ' + {}.toString.call(element);
            }
            this.element = element; // root element
            this.options = su.lang.object({}).merge(this.defaults).merge(options).get();
            //this.options = options = lib.extend({}, options);
            // Set default options
            // for (let name in this.defaults) {
            //     !(name in this.options) && (this.options[name] = this.defaults[name]);
            // }
            // Export instance
            this.element[expando] = this;
            _prepareGroup(this.options);
            // Bind all private methods
            for (var fn in this) {
                if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                    this[fn] = this[fn].bind(this);
                }
            }
            // Setup drag mode
            this.nativeDraggable = this.options.forceFallback ? false : supportDraggable;
            // Bind events
            _on(this.element, 'mousedown', this._onTapStart);
            _on(this.element, 'touchstart', this._onTapStart);
            _on(this.element, 'pointerdown', this._onTapStart);

            if (this.nativeDraggable) {
                _on(this.element, 'dragover', this);
                _on(this.element, 'dragenter', this);
            }
            touchDragOverListeners.push(this._onDragOver);

            // Restore sorting
            options.store && this.sort(options.store.get(this));

        }








        // Default options













    }
}