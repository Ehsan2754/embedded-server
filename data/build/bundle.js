
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class BitConverter {
        static ToSingle(buffer, index) {
            return new DataView(buffer).getFloat32(index, true);
        }
        static ToInt16(buffer, index) {
            return new DataView(buffer).getInt16(index, true);
        }
        static ToUInt16(buffer, index) {
            return new DataView(buffer).getUint16(index, true);
        }
        static ToUInt32(buffer, index) {
            return new DataView(buffer).getUint32(index, true);
        }
        static GetBytes(integer) {
            const buffer = new Uint8Array(4);
            for (let i = 0; i < 4; i++) {
                buffer[i] = (integer >> (i * 8) & 255);
            }
            return buffer;
        }
    }

    const crctab16 = new Uint16Array([0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0, 0x0280, 0xC241,
        0xC601, 0x06C0, 0x0780, 0xC741, 0x0500, 0xC5C1, 0xC481, 0x0440,
        0xCC01, 0x0CC0, 0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40,
        0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0, 0x0880, 0xC841,
        0xD801, 0x18C0, 0x1980, 0xD941, 0x1B00, 0xDBC1, 0xDA81, 0x1A40,
        0x1E00, 0xDEC1, 0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41,
        0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0, 0x1680, 0xD641,
        0xD201, 0x12C0, 0x1380, 0xD341, 0x1100, 0xD1C1, 0xD081, 0x1040,
        0xF001, 0x30C0, 0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240,
        0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0, 0x3480, 0xF441,
        0x3C00, 0xFCC1, 0xFD81, 0x3D40, 0xFF01, 0x3FC0, 0x3E80, 0xFE41,
        0xFA01, 0x3AC0, 0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840,
        0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0, 0x2A80, 0xEA41,
        0xEE01, 0x2EC0, 0x2F80, 0xEF41, 0x2D00, 0xEDC1, 0xEC81, 0x2C40,
        0xE401, 0x24C0, 0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640,
        0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0, 0x2080, 0xE041,
        0xA001, 0x60C0, 0x6180, 0xA141, 0x6300, 0xA3C1, 0xA281, 0x6240,
        0x6600, 0xA6C1, 0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441,
        0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0, 0x6E80, 0xAE41,
        0xAA01, 0x6AC0, 0x6B80, 0xAB41, 0x6900, 0xA9C1, 0xA881, 0x6840,
        0x7800, 0xB8C1, 0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41,
        0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1, 0xBC81, 0x7C40,
        0xB401, 0x74C0, 0x7580, 0xB541, 0x7700, 0xB7C1, 0xB681, 0x7640,
        0x7200, 0xB2C1, 0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041,
        0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0, 0x5280, 0x9241,
        0x9601, 0x56C0, 0x5780, 0x9741, 0x5500, 0x95C1, 0x9481, 0x5440,
        0x9C01, 0x5CC0, 0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40,
        0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0, 0x5880, 0x9841,
        0x8801, 0x48C0, 0x4980, 0x8941, 0x4B00, 0x8BC1, 0x8A81, 0x4A40,
        0x4E00, 0x8EC1, 0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41,
        0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0, 0x4680, 0x8641,
        0x8201, 0x42C0, 0x4380, 0x8341, 0x4100, 0x81C1, 0x8081, 0x4040]);
    /**
     * Calculate the 16-bit CRC of data with predetermined length.
     * @param data array of bytes
     */
    function crc16(data) {
        let byteData = new Uint8Array(data);
        let crc = 0xFFFF;
        for (const byte of byteData) {
            crc = crc >>> 8 ^ crctab16[(crc ^ byte) & 0xff];
        }
        return new Uint8Array([crc & 0b11111111, crc >> 8 & 0b11111111]);
    }

    class Commands {
        /**
         * Get lab info command (mode, configs, type, etc.)
         * @constructor
         */
        static getInfo() {
            const writeMessage = new Uint8Array(6);
            writeMessage[0] = this.startByte;
            writeMessage[1] = BitConverter.GetBytes(writeMessage.byteLength)[0];
            writeMessage[2] = BitConverter.GetBytes(writeMessage.byteLength)[1];
            writeMessage[3] = this.proto_msgType_getInfo;
            const crc = this.calculateMessageCrc16(writeMessage);
            writeMessage[4] = crc[0];
            writeMessage[5] = crc[1];
            console.log(writeMessage);
            return writeMessage;
        }
        static errorMessage() {
            const writeMessage = new Uint8Array(6);
            writeMessage[0] = this.startByte;
            writeMessage[1] = BitConverter.GetBytes(writeMessage.byteLength)[0];
            writeMessage[2] = BitConverter.GetBytes(writeMessage.byteLength)[1];
            writeMessage[3] = this.unsupportMsg;
            const crc = this.calculateMessageCrc16(writeMessage);
            writeMessage[4] = crc[0];
            writeMessage[5] = crc[1];
            return writeMessage;
        }
        /**
         * Get read sensor values command
         * @constructor
         */
        static getSensorValues() {
            if (this._readSensorValuesMessage != undefined)
                return this._readSensorValuesMessage;
            const writeMessage = new Uint8Array(6);
            writeMessage[0] = this.startByte;
            writeMessage[1] = BitConverter.GetBytes(writeMessage.byteLength)[0];
            writeMessage[2] = BitConverter.GetBytes(writeMessage.byteLength)[1];
            writeMessage[3] = this.data_exchange;
            const crc = this.calculateMessageCrc16(writeMessage);
            writeMessage[4] = crc[0];
            writeMessage[5] = crc[1];
            this._readSensorValuesMessage = writeMessage;
            return this._readSensorValuesMessage;
        }
        /**
         * Get write scales (modes) of accelerometer and conductometer message
         * @param accelScale
         * @param conductScale
         * @constructor
         */
        static setScales(accelScale, conductScale) {
            const writeMessage = new Uint8Array(8);
            writeMessage[0] = this.startByte;
            writeMessage[1] = BitConverter.GetBytes(writeMessage.byteLength)[0];
            writeMessage[2] = BitConverter.GetBytes(writeMessage.byteLength)[1];
            writeMessage[3] = this.data_exchange;
            writeMessage[4] = accelScale;
            writeMessage[5] = conductScale;
            const crc = this.calculateMessageCrc16(writeMessage);
            writeMessage[6] = crc[0];
            writeMessage[7] = crc[1];
            return writeMessage;
        }
        /**
         * Get factory values message
         * @constructor
         */
        static getFactorySettings() {
            const writeMessage = new Uint8Array(6);
            writeMessage[0] = this.startByte;
            writeMessage[1] = BitConverter.GetBytes(writeMessage.byteLength)[0];
            writeMessage[2] = BitConverter.GetBytes(writeMessage.byteLength)[1];
            writeMessage[3] = this.get_HW_Config;
            const crc = this.calculateMessageCrc16(writeMessage);
            writeMessage[4] = crc[0];
            writeMessage[5] = crc[1];
            return writeMessage;
        }
        /**
         * Get user values message
         * @param dataOffset
         * @param dataLength
         * @constructor
         */
        static getUserSettings(dataOffset, dataLength) {
            const writeMessage = new Uint8Array(8);
            writeMessage[0] = this.startByte;
            writeMessage[1] = BitConverter.GetBytes(writeMessage.byteLength)[0];
            writeMessage[2] = BitConverter.GetBytes(writeMessage.byteLength)[1];
            writeMessage[3] = this.get_UserData;
            writeMessage[4] = dataOffset;
            writeMessage[5] = dataLength;
            const crc = this.calculateMessageCrc16(writeMessage);
            writeMessage[6] = crc[0];
            writeMessage[7] = crc[1];
            return writeMessage;
        }
        static calculateMessageCrc16(bytes) {
            return crc16(bytes.slice(0, bytes.byteLength - 2));
        }
        static checkAnswer(answerArray) {
            if (answerArray.byteLength < 6)
                return false;
            const byteBuffer = new Uint8Array(answerArray);
            const crc = this.calculateMessageCrc16(byteBuffer);
            return crc[0] == byteBuffer[byteBuffer.byteLength - 2] &&
                crc[1] == byteBuffer[byteBuffer.byteLength - 1];
        }
    }
    Commands.userDataLength = 108;
    Commands.unsupportMsg = 0xFF;
    Commands.startByte = 0xAA;
    Commands.data_exchange = 0x10;
    Commands.get_HW_Config = 0x31;
    Commands.get_UserData = 0x41;
    Commands.get_ArchiveBt = 0x22;
    Commands.set_UserData = 0x40;
    Commands.proto_msgType_getInfo = 0x00;
    Commands.archive_Control = 0x20;
    Commands.getArchive = 0x21;
    Commands.proto_msgType_bootloader_get_FW_Cfg = 0x83;

    var LabType;
    (function (LabType) {
        LabType[LabType["None"] = 0] = "None";
        LabType[LabType["Phys"] = 1] = "Phys";
        LabType[LabType["Chem"] = 2] = "Chem";
        LabType[LabType["Eco"] = 3] = "Eco";
        LabType[LabType["Bio"] = 4] = "Bio";
    })(LabType || (LabType = {}));

    class ResponseParser {
        /**
         * Convert from byte to bit array
         * @param byte
         * @private
         */
        static byteToBits(byte) {
            const bits = [];
            for (let i = 0; i < 8; i++) {
                bits[i] = (byte & (1 << i)) != 0;
            }
            return bits;
        }
        /**
         * parse lab type
         * @param buffer
         */
        static parseLabType(buffer) {
            console.log(buffer);
            return new Uint8Array(buffer)[10];
        }
        /**
         * parse factory settings
         * @param buffer
         */
        static parseFactorySettings(buffer) {
            return {
                k_Channel0: BitConverter.ToSingle(buffer, 0),
                delta_Channel0: BitConverter.ToSingle(buffer, 4),
                k_Channel1: BitConverter.ToSingle(buffer, 8),
                delta_Channel1: BitConverter.ToSingle(buffer, 12),
                k1_Channel2: BitConverter.ToSingle(buffer, 16),
                delta1_Channel2: BitConverter.ToSingle(buffer, 20),
                k2_Channel2: BitConverter.ToSingle(buffer, 24),
                delta2_Channel2: BitConverter.ToSingle(buffer, 28),
                pointT_Channel2: BitConverter.ToSingle(buffer, 32),
                k1_Channel3: BitConverter.ToSingle(buffer, 36),
                delta1_Channel3: BitConverter.ToSingle(buffer, 40),
                delta_LightSensor: BitConverter.ToSingle(buffer, 44),
                delta_HumiditySensor: BitConverter.ToSingle(buffer, 48),
                delta_TempOutsideSensor: BitConverter.ToSingle(buffer, 52),
                delta_AbsolutePressureSensor: BitConverter.ToSingle(buffer, 56),
                k2_Channel3: BitConverter.ToSingle(buffer, 60),
                delta2_Channel3: BitConverter.ToSingle(buffer, 64),
                k3_Channel3: BitConverter.ToSingle(buffer, 68),
                delta3_Channel3: BitConverter.ToSingle(buffer, 72),
            };
        }
        /**
         * parse factory settings when uses short messages
         * @param buffer
         */
        static parseFactorySettingsShortMessage(buffer) {
            return {
                k_Channel0: BitConverter.ToSingle(buffer, 8),
                delta_Channel0: BitConverter.ToSingle(buffer, 12),
                k_Channel1: BitConverter.ToSingle(buffer, 16),
                delta_Channel1: BitConverter.ToSingle(buffer, 20),
                k1_Channel2: BitConverter.ToSingle(buffer, 24),
                delta1_Channel2: BitConverter.ToSingle(buffer, 28),
                k2_Channel2: BitConverter.ToSingle(buffer, 32),
                delta2_Channel2: BitConverter.ToSingle(buffer, 36),
                pointT_Channel2: BitConverter.ToSingle(buffer, 40),
                k1_Channel3: BitConverter.ToSingle(buffer, 44),
                delta1_Channel3: BitConverter.ToSingle(buffer, 48),
                delta_LightSensor: BitConverter.ToSingle(buffer, 52),
                delta_HumiditySensor: BitConverter.ToSingle(buffer, 56),
                delta_TempOutsideSensor: BitConverter.ToSingle(buffer, 60),
                delta_AbsolutePressureSensor: BitConverter.ToSingle(buffer, 64),
                k2_Channel3: BitConverter.ToSingle(buffer, 68),
                delta2_Channel3: BitConverter.ToSingle(buffer, 72),
                k3_Channel3: BitConverter.ToSingle(buffer, 76),
                delta3_Channel3: BitConverter.ToSingle(buffer, 80),
            };
        }
        /**
         * parse user settings
         * @param labType
         * @param buffer
         */
        static parseUserSettings(labType, buffer) {
            const settings = {};
            console.log(buffer);
            switch (labType) {
                case LabType.Phys:
                    settings.k_TempSensor = BitConverter.ToSingle(buffer, 0);
                    settings.delta_TempSensor = BitConverter.ToSingle(buffer, 4);
                    settings.k_TeslametrSensor = BitConverter.ToSingle(buffer, 12);
                    settings.delta_TeslametrSensor = BitConverter.ToSingle(buffer, 16);
                    settings.k_VoltmeterSensor = BitConverter.ToSingle(buffer, 24);
                    settings.delta_VoltmeterSensor = BitConverter.ToSingle(buffer, 28);
                    settings.k_AmpermetrSensor = BitConverter.ToSingle(buffer, 36);
                    settings.delta_AmpermetrSensor = BitConverter.ToSingle(buffer, 40);
                    settings.delta_AbsolutePressureSensor = BitConverter.ToSingle(buffer, 48);
                    break;
                case LabType.Chem:
                    settings.k_pHSensor = BitConverter.ToSingle(buffer, 0);
                    settings.delta_pHSensor = BitConverter.ToSingle(buffer, 4);
                    settings.k_TempSensor = BitConverter.ToSingle(buffer, 12);
                    settings.delta_TempSensor = BitConverter.ToSingle(buffer, 16);
                    settings.k1_ConductivitySensor = BitConverter.ToSingle(buffer, 24);
                    settings.delta1_ConductivitySensor = BitConverter.ToSingle(buffer, 28);
                    settings.k2_ConductivitySensor = BitConverter.ToSingle(buffer, 32);
                    settings.delta2_ConductivitySensor = BitConverter.ToSingle(buffer, 46);
                    settings.k3_ConductivitySensor = BitConverter.ToSingle(buffer, 40);
                    settings.delta3_ConductivitySensor = BitConverter.ToSingle(buffer, 44);
                    break;
                case LabType.Eco:
                    // TODO: Add eco lab
                    break;
                case LabType.Bio:
                    settings.k_pHSensor = BitConverter.ToSingle(buffer, 0);
                    settings.delta_pHSensor = BitConverter.ToSingle(buffer, 4);
                    settings.k_TempSensor = BitConverter.ToSingle(buffer, 12);
                    settings.delta_TempSensor = BitConverter.ToSingle(buffer, 16);
                    settings.delta_TempOutsideSensor = BitConverter.ToSingle(buffer, 24);
                    settings.delta_HumiditySensor = BitConverter.ToSingle(buffer, 28);
                    settings.delta_LightSensor = BitConverter.ToSingle(buffer, 32);
                    break;
            }
            console.log(settings);
            return settings;
        }
        /**
         * parse sensors values
         * @param buffer
         * @constructor
         */
        static ParseRawValues(buffer) {
            const byteBuffer = new Uint8Array(buffer);
            console.log(BitConverter.ToSingle(buffer, 16));
            const state = this.byteToBits(byteBuffer[4]);
            return {
                time: Date.now(),
                pressureOk: state[3],
                humidityOk: state[2],
                lightOk: state[1],
                accelerometerOk: state[0],
                conductometerMode: byteBuffer[5],
                tempADC: BitConverter.ToInt16(buffer, 12) * 0.01,
                channel0: BitConverter.ToSingle(buffer, 16),
                channel1: BitConverter.ToSingle(buffer, 20),
                channel2: BitConverter.ToSingle(buffer, 24),
                channel3: BitConverter.ToSingle(buffer, 28),
                accelerometerX: BitConverter.ToInt16(buffer, 32),
                accelerometerY: BitConverter.ToInt16(buffer, 34),
                accelerometerZ: BitConverter.ToInt16(buffer, 36),
                accelerometerMode: byteBuffer[38],
                light: BitConverter.ToSingle(buffer, 40),
                humidity: BitConverter.ToUInt16(buffer, 44) * 0.01,
                pressure: BitConverter.ToSingle(buffer, 48),
            };
        }
        /**
         * parse a serial number
         * @param buffer
         * @constructor
         */
        static Answer_proto_msgType_bootloader_get_FW_Cfg(buffer) {
            return BitConverter.ToUInt32(buffer, 4);
        }
    }

    var strings;
    (function (strings) {
        strings["copy"] = "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
        strings["open"] = "\u041E\u0442\u043A\u0440\u044B\u0442\u044C";
        strings["close"] = "\u0417\u0430\u043A\u0440\u044B\u0442\u044C";
        strings["link"] = "\u0421\u0441\u044B\u043B\u043A\u0430";
        strings["archiveSavedTitle"] = "\u0414\u0430\u043D\u043D\u044B\u0435 \u0431\u044B\u043B\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B.";
        strings["archiveSavedDescription"] = "\u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0438\u043B\u0438 \u043F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u0438\u043C\u0438. \u0421\u0441\u044B\u043B\u043A\u0430 \u0430\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0430 1 \u043C\u0435\u0441\u044F\u0446.";
        strings["readSettingsError"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u0447\u0438\u0442\u044B\u0432\u0430\u043D\u0438\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A";
        strings["graphicsTitle"] = "\u0413\u0440\u0430\u0444\u0438\u043A\u0438";
        strings["measuresTitle"] = "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F";
        strings["maxY"] = "M\u0430\u043A\u0441. Y";
        strings["maxX"] = "M\u0430\u043A\u0441. X";
        strings["apply"] = "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C";
        strings["fixed"] = "\u0424\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
        strings["noData"] = "\u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445";
        strings["time"] = "\u0412\u0435\u0440\u043C\u044F";
        strings["chartCrosshairValue"] = "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435: ";
        strings["chartCrosshairTime"] = "\u0412\u0440\u0435\u043C\u044F: ";
        strings["timeFormat"] = "\u043C\u043C:\u0441\u0441.\u043C\u0441";
        strings["serverNotResponding"] = "\u0421\u0435\u0440\u0432\u0435\u0440 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u043D\u0435 \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442";
        strings["fatalError"] = "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430";
        strings["workWithSavedData"] = "\u0420\u0430\u0431\u043E\u0442\u0430 \u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u043C\u0438 \u0434\u0430\u043D\u043D\u044B\u043C\u0438";
        strings["back"] = "\u041D\u0430\u0437\u0430\u0434";
        strings["chartCrosshairValues"] = "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u044F: ";
        strings["settings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438";
        strings["about"] = "\u041E \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0435";
        strings["sensors"] = "\u0414\u0430\u0442\u0447\u0438\u043A\u0438";
        strings["experimentSettings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430";
        strings["support"] = "\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430";
        strings["aboutContactCellphone"] = "\u0422\u0435\u043B\u0435\u0444\u043E\u043D: <a href=\"tel:+78007753797\">8 (800) 775 37-97</a>";
        strings["site"] = "\u0421\u0430\u0439\u0442";
        strings["aboutSiteUrl"] = "www.zarnitza.ru";
        strings["sensorSettings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u0430\u0442\u0447\u0438\u043A\u0430";
        strings["rangeAndUnit"] = "\u0414\u0438\u0430\u043F\u0430\u0437\u043E\u043D / \u0415\u0434. \u0438\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F";
        strings["chartLineColor"] = "\u0426\u0432\u0435\u0442 \u043B\u0438\u043D\u0438\u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
        strings["chartLineWidth"] = "\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u043B\u0438\u043D\u0438\u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
        strings["chartMarkerColor"] = "\u0426\u0432\u0435\u0442 \u0442\u043E\u0447\u0435\u043A \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
        strings["chartMarkerWidth"] = "\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u043E\u0447\u0435\u043A \u0433\u0440\u0430\u0444\u0438\u043A\u0430";
        strings["start"] = "\u041F\u0443\u0441\u043A";
        strings["experimentTimeLabel"] = "\u0412\u0440\u0435\u043C\u044F \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442\u0430";
        strings["timeFormatLabel"] = "\u0424\u043E\u0440\u043C\u0430\u0442 \u0432\u0440\u0435\u043C\u0435\u043D\u0438";
        strings["timeSecond"] = "\u0421\u0435\u043A\u0443\u043D\u0434";
        strings["timeMinute"] = "\u041C\u0438\u043D\u0443\u0442";
        strings["modeStopwatch"] = "\u0421\u0435\u043A\u043D\u0443\u0434\u043E\u043C\u0435\u0440";
        strings["modeMinutesAndSeconds"] = "\u041C\u0438\u043D\u0443\u0442\u044B \u0438 \u0441\u0435\u043A\u0443\u043D\u0434\u044B";
        strings["modeHoursAndMinutes"] = "\u0427\u0430\u0441\u044B \u0438 \u043C\u0438\u043D\u0443\u0442\u044B";
        strings["experimentIsDone"] = "\u042D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D";
        strings["exitFromDashboardText"] = "\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0437\u0430\u0432\u0435\u0440\u0438\u0448\u0442\u044C \u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442?<br><b>\u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435!</b> \u0412\u0441\u0435 \u043D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0431\u0443\u0434\u0443\u0442 \u043F\u043E\u0442\u0435\u0440\u044F\u043D\u044B";
        strings["yes"] = "\u0414\u0430";
        strings["no"] = "\u041D\u0435\u0442";
        strings["reject"] = "\u041E\u0442\u043C\u0435\u043D\u0430";
        strings["exitFromDashboardTitle"] = "<b>\u0412\u044B\u0445\u043E\u0434 \u0438\u0437 \u0440\u0435\u0436\u0438\u043C\u0430 \u0438\u0437\u043C\u0435\u0440\u0435\u043D\u0438\u044F</b>";
        strings["wifiSettings"] = "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0435\u0442\u0438";
        strings["loadFailed"] = "\u0412\u043E \u0432\u0440\u0435\u043C\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u0414\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0431\u044B\u043B\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B.";
    })(strings || (strings = {}));
    const links = {
        appOwnerSite: "www.zarnitza.ru"
    };
    var strings$1 = strings;

    class Event {
        constructor() {
            this._listeners = [];
        }
        addEventListener(listener) {
            this._listeners.push(listener);
        }
        emit(value) {
            for (const listener of this._listeners) {
                listener(value);
            }
        }
    }

    const apiBase = new URL('/api/lab', window.location.origin);
    // export const apiBase = new URL('http://62.113.104.145/api/lab')
    // export const apiBase = new URL('http://localhost:5044/api/lab')

    class WebSocketLabRepository {
        constructor(serialNumber) {
            this.serialNumber = serialNumber;
            this.socketIsActive = false;
            this.onError = new Event();
        }
        async start() {
            return new Promise((resolve, reject) => {
                if (this.socket)
                    return;
                const uri = new URL(apiBase);
                if (apiBase.protocol == 'https:')
                    uri.protocol = "wss:";
                else
                    uri.protocol = "ws:";
                uri.pathname += '/subscribe';
                if (this.serialNumber)
                    uri.pathname += '/' + this.serialNumber;
                console.debug('WS connecting with URI ', uri.toString());
                this.socket = new WebSocket(uri.toString());
                console.debug("socket created");
                this.socket.onopen = () => {
                    console.debug("socket connected");
                    this.socketIsActive = true;
                    resolve();
                };
                this.socket.onerror = () => reject(null);
                this.socket.onmessage = (ev) => this.onMessage(ev);
                this.socket.onclose = () => this.onSocketClose();
            });
        }
        async stop() {
            if (!this.socket)
                return;
            this.socket.close();
            console.debug('socket closed');
            this.socket.onmessage = null;
            this.socket = undefined;
            this.socketIsActive = false;
        }
        async getFactorySettings() {
            try {
                const response = await this.sendCommand(Commands.getFactorySettings());
                return ResponseParser.parseFactorySettings(response);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        async getLabType() {
            try {
                const response = await this.sendCommand(Commands.getInfo());
                return ResponseParser.parseLabType(response);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        getLastSensorsValues() {
            if (!this.socketIsActive)
                return {};
            return this.rawValues;
        }
        async getUserSettings(labType) {
            try {
                const response = await this.sendCommand(Commands.getUserSettings(0, 52));
                return ResponseParser.parseUserSettings(labType, response);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        async setSensorModes(accelerometerMode, conductometerMode) {
            try {
                const command = Commands.getSensorValues();
                await this.sendCommand(command);
                return true;
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        async sendCommand(request) {
            try {
                console.debug('send command request: ', request);
                let uri = apiBase + '/send-command';
                if (this.serialNumber)
                    uri += '/' + this.serialNumber;
                const response = await fetch(uri, {
                    body: request,
                    method: "POST",
                });
                console.debug('send command response: ', response);
                if (response.ok == false)
                    return Promise.reject(response.status);
                const result = await response.arrayBuffer();
                console.debug('send command response buffer: ', result);
                return result;
            }
            catch (e) {
                console.debug("result", e);
                return Promise.reject(e);
            }
        }
        async onMessage(event) {
            const data = event.data;
            const arrayBuffer = await data.arrayBuffer();
            // console.debug(arrayBuffer)
            this.rawValues = ResponseParser.ParseRawValues(arrayBuffer);
        }
        onSocketClose() {
            console.debug("socketClosed. socketIsActive: ", this.socketIsActive);
            this.socket = null;
            if (!this.socketIsActive)
                return;
            this.socketIsActive = false;
            this.start()
                .catch(() => {
                this.onError.emit(strings$1.serverNotResponding);
                console.debug("errorOccurred");
            });
        }
        async getSensorsValuesAsync() {
            const byteValues = await this.sendCommand(Commands.getSensorValues());
            if (!byteValues)
                return {};
            return ResponseParser.ParseRawValues(byteValues);
        }
        async getArchiveValues(id) {
            const response = await fetch(`${apiBase}/get-archive/${id}`);
            if (response.ok == false)
                return null;
            return await response.json();
        }
        async saveArchiveValues(archiveValues) {
            const response = await fetch(`${apiBase}/upload-archive`, {
                body: JSON.stringify(archiveValues),
                method: 'POST'
            });
            if (!response.ok)
                return null;
            return response.text();
        }
    }

    /* src\components\BackButton.svelte generated by Svelte v3.48.0 */
    const file$l = "src\\components\\BackButton.svelte";

    function create_fragment$o(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/img/arrow.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", strings$1.back);
    			attr_dev(img, "class", "svelte-8d0k23");
    			add_location(img, file$l, 5, 4, 111);
    			attr_dev(button, "class", "back-button svelte-8d0k23");
    			add_location(button, file$l, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BackButton', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BackButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({ strings: strings$1 });
    	return [click_handler];
    }

    class BackButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackButton",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    var DataDisplay;
    (function (DataDisplay) {
        DataDisplay[DataDisplay["Graphics"] = 0] = "Graphics";
        DataDisplay[DataDisplay["Measures"] = 1] = "Measures";
    })(DataDisplay || (DataDisplay = {}));

    var defaultBindingOptions = {
        allowDownsampling: true,
    };
    function bindToDevicePixelRatio(canvas, options) {
        if (options === void 0) { options = defaultBindingOptions; }
        return new DevicePixelRatioBinding(canvas, options);
    }
    var DevicePixelRatioBinding = /** @class */ (function () {
        function DevicePixelRatioBinding(canvas, options) {
            var _this = this;
            this._resolutionMediaQueryList = null;
            this._resolutionListener = function (ev) { return _this._onResolutionChanged(); };
            this._canvasConfiguredListeners = [];
            this.canvas = canvas;
            this._canvasSize = {
                width: this.canvas.clientWidth,
                height: this.canvas.clientHeight,
            };
            this._options = options;
            this._configureCanvas();
            this._installResolutionListener();
        }
        DevicePixelRatioBinding.prototype.destroy = function () {
            this._canvasConfiguredListeners.length = 0;
            this._uninstallResolutionListener();
            this.canvas = null;
        };
        Object.defineProperty(DevicePixelRatioBinding.prototype, "canvasSize", {
            get: function () {
                return {
                    width: this._canvasSize.width,
                    height: this._canvasSize.height,
                };
            },
            enumerable: true,
            configurable: true
        });
        DevicePixelRatioBinding.prototype.resizeCanvas = function (size) {
            this._canvasSize = {
                width: size.width,
                height: size.height,
            };
            this._configureCanvas();
        };
        Object.defineProperty(DevicePixelRatioBinding.prototype, "pixelRatio", {
            get: function () {
                // According to DOM Level 2 Core specification, ownerDocument should never be null for HTMLCanvasElement
                // see https://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#node-ownerDoc
                var win = this.canvas.ownerDocument.defaultView;
                if (win == null) {
                    throw new Error('No window is associated with the canvas');
                }
                return win.devicePixelRatio > 1 || this._options.allowDownsampling ? win.devicePixelRatio : 1;
            },
            enumerable: true,
            configurable: true
        });
        DevicePixelRatioBinding.prototype.subscribeCanvasConfigured = function (listener) {
            this._canvasConfiguredListeners.push(listener);
        };
        DevicePixelRatioBinding.prototype.unsubscribeCanvasConfigured = function (listener) {
            this._canvasConfiguredListeners = this._canvasConfiguredListeners.filter(function (l) { return l != listener; });
        };
        DevicePixelRatioBinding.prototype._configureCanvas = function () {
            var ratio = this.pixelRatio;
            this.canvas.style.width = this._canvasSize.width + "px";
            this.canvas.style.height = this._canvasSize.height + "px";
            this.canvas.width = this._canvasSize.width * ratio;
            this.canvas.height = this._canvasSize.height * ratio;
            this._emitCanvasConfigured();
        };
        DevicePixelRatioBinding.prototype._emitCanvasConfigured = function () {
            var _this = this;
            this._canvasConfiguredListeners.forEach(function (listener) { return listener.call(_this); });
        };
        DevicePixelRatioBinding.prototype._installResolutionListener = function () {
            if (this._resolutionMediaQueryList !== null) {
                throw new Error('Resolution listener is already installed');
            }
            // According to DOM Level 2 Core specification, ownerDocument should never be null for HTMLCanvasElement
            // see https://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#node-ownerDoc
            var win = this.canvas.ownerDocument.defaultView;
            if (win == null) {
                throw new Error('No window is associated with the canvas');
            }
            var dppx = win.devicePixelRatio;
            this._resolutionMediaQueryList = win.matchMedia("all and (resolution: " + dppx + "dppx)");
            // IE and some versions of Edge do not support addEventListener/removeEventListener, and we are going to use the deprecated addListener/removeListener
            this._resolutionMediaQueryList.addListener(this._resolutionListener);
        };
        DevicePixelRatioBinding.prototype._uninstallResolutionListener = function () {
            if (this._resolutionMediaQueryList !== null) {
                // IE and some versions of Edge do not support addEventListener/removeEventListener, and we are going to use the deprecated addListener/removeListener
                this._resolutionMediaQueryList.removeListener(this._resolutionListener);
                this._resolutionMediaQueryList = null;
            }
        };
        DevicePixelRatioBinding.prototype._reinstallResolutionListener = function () {
            this._uninstallResolutionListener();
            this._installResolutionListener();
        };
        DevicePixelRatioBinding.prototype._onResolutionChanged = function () {
            this._configureCanvas();
            this._reinstallResolutionListener();
        };
        return DevicePixelRatioBinding;
    }());

    /*!
     * @license
     * TradingView Lightweight Charts v3.8.0
     * Copyright (c) 2020 TradingView, Inc.
     * Licensed under Apache License 2.0 https://www.apache.org/licenses/LICENSE-2.0
     */
    var i,n;function s(t,i){var n,s=((n={})[0]=[],n[1]=[t.lineWidth,t.lineWidth],n[2]=[2*t.lineWidth,2*t.lineWidth],n[3]=[6*t.lineWidth,6*t.lineWidth],n[4]=[t.lineWidth,4*t.lineWidth],n)[i];t.setLineDash(s);}function h(t,i,n,s){t.beginPath();var h=t.lineWidth%2?.5:0;t.moveTo(n,i+h),t.lineTo(s,i+h),t.stroke();}function r(t,i){if(!t)throw new Error("Assertion failed"+(i?": "+i:""))}function e(t){if(void 0===t)throw new Error("Value is undefined");return t}function u(t){if(null===t)throw new Error("Value is null");return t}function a(t){return u(e(t))}!function(t){t[t.Simple=0]="Simple",t[t.WithSteps=1]="WithSteps";}(i||(i={})),function(t){t[t.Solid=0]="Solid",t[t.Dotted=1]="Dotted",t[t.Dashed=2]="Dashed",t[t.LargeDashed=3]="LargeDashed",t[t.SparseDotted=4]="SparseDotted";}(n||(n={}));var o={khaki:"#f0e68c",azure:"#f0ffff",aliceblue:"#f0f8ff",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gainsboro:"#dcdcdc",gray:"#808080",green:"#008000",honeydew:"#f0fff0",floralwhite:"#fffaf0",lightblue:"#add8e6",lightcoral:"#f08080",lemonchiffon:"#fffacd",hotpink:"#ff69b4",lightyellow:"#ffffe0",greenyellow:"#adff2f",lightgoldenrodyellow:"#fafad2",limegreen:"#32cd32",linen:"#faf0e6",lightcyan:"#e0ffff",magenta:"#f0f",maroon:"#800000",olive:"#808000",orange:"#ffa500",oldlace:"#fdf5e6",mediumblue:"#0000cd",transparent:"#0000",lime:"#0f0",lightpink:"#ffb6c1",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",midnightblue:"#191970",orchid:"#da70d6",mediumorchid:"#ba55d3",mediumturquoise:"#48d1cc",orangered:"#ff4500",royalblue:"#4169e1",powderblue:"#b0e0e6",red:"#f00",coral:"#ff7f50",turquoise:"#40e0d0",white:"#fff",whitesmoke:"#f5f5f5",wheat:"#f5deb3",teal:"#008080",steelblue:"#4682b4",bisque:"#ffe4c4",aquamarine:"#7fffd4",aqua:"#0ff",sienna:"#a0522d",silver:"#c0c0c0",springgreen:"#00ff7f",antiquewhite:"#faebd7",burlywood:"#deb887",brown:"#a52a2a",beige:"#f5f5dc",chocolate:"#d2691e",chartreuse:"#7fff00",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cadetblue:"#5f9ea0",tomato:"#ff6347",fuchsia:"#f0f",blue:"#00f",salmon:"#fa8072",blanchedalmond:"#ffebcd",slateblue:"#6a5acd",slategray:"#708090",thistle:"#d8bfd8",tan:"#d2b48c",cyan:"#0ff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",blueviolet:"#8a2be2",black:"#000",darkmagenta:"#8b008b",darkslateblue:"#483d8b",darkkhaki:"#bdb76b",darkorchid:"#9932cc",darkorange:"#ff8c00",darkgreen:"#006400",darkred:"#8b0000",dodgerblue:"#1e90ff",darkslategray:"#2f4f4f",dimgray:"#696969",deepskyblue:"#00bfff",firebrick:"#b22222",forestgreen:"#228b22",indigo:"#4b0082",ivory:"#fffff0",lavenderblush:"#fff0f5",feldspar:"#d19275",indianred:"#cd5c5c",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightskyblue:"#87cefa",lightslategray:"#789",lightslateblue:"#8470ff",snow:"#fffafa",lightseagreen:"#20b2aa",lightsalmon:"#ffa07a",darksalmon:"#e9967a",darkviolet:"#9400d3",mediumpurple:"#9370d8",mediumaquamarine:"#66cdaa",skyblue:"#87ceeb",lavender:"#e6e6fa",lightsteelblue:"#b0c4de",mediumvioletred:"#c71585",mintcream:"#f5fffa",navajowhite:"#ffdead",navy:"#000080",olivedrab:"#6b8e23",palevioletred:"#d87093",violetred:"#d02090",yellow:"#ff0",yellowgreen:"#9acd32",lawngreen:"#7cfc00",pink:"#ffc0cb",paleturquoise:"#afeeee",palegoldenrod:"#eee8aa",darkolivegreen:"#556b2f",darkseagreen:"#8fbc8f",darkturquoise:"#00ced1",peachpuff:"#ffdab9",deeppink:"#ff1493",violet:"#ee82ee",palegreen:"#98fb98",mediumseagreen:"#3cb371",peru:"#cd853f",saddlebrown:"#8b4513",sandybrown:"#f4a460",rosybrown:"#bc8f8f",purple:"#800080",seagreen:"#2e8b57",seashell:"#fff5ee",papayawhip:"#ffefd5",mediumslateblue:"#7b68ee",plum:"#dda0dd",mediumspringgreen:"#00fa9a"};function l(t){return t<0?0:t>255?255:Math.round(t)||0}function f(t){return t<=0||t>0?t<0?0:t>1?1:Math.round(1e4*t)/1e4:0}var c=/^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i,v=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i,_=/^rgb\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*\)$/,d=/^rgba\(\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?\d{1,10})\s*,\s*(-?[\d]{0,10}(?:\.\d+)?)\s*\)$/;function w(t){var i;if((t=t.toLowerCase())in o&&(t=o[t]),i=d.exec(t)||_.exec(t))return [l(parseInt(i[1],10)),l(parseInt(i[2],10)),l(parseInt(i[3],10)),f(i.length<5?1:parseFloat(i[4]))];if(i=v.exec(t))return [l(parseInt(i[1],16)),l(parseInt(i[2],16)),l(parseInt(i[3],16)),1];if(i=c.exec(t))return [l(17*parseInt(i[1],16)),l(17*parseInt(i[2],16)),l(17*parseInt(i[3],16)),1];throw new Error("Cannot parse color: ".concat(t))}function M(t){var i,n=w(t);return {t:"rgb(".concat(n[0],", ").concat(n[1],", ").concat(n[2],")"),i:(i=n,.199*i[0]+.687*i[1]+.114*i[2]>160?"black":"white")}}var b=function(t,i){return b=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i;}||function(t,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n]);},b(t,i)};function m(t,i){if("function"!=typeof i&&null!==i)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");function n(){this.constructor=t;}b(t,i),t.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n);}var p=function(){return p=Object.assign||function(t){for(var i,n=1,s=arguments.length;n<s;n++)for(var h in i=arguments[n])Object.prototype.hasOwnProperty.call(i,h)&&(t[h]=i[h]);return t},p.apply(this,arguments)};function g(t,i,n){if(n||2===arguments.length)for(var s,h=0,r=i.length;h<r;h++)!s&&h in i||(s||(s=Array.prototype.slice.call(i,0,h)),s[h]=i[h]);return t.concat(s||Array.prototype.slice.call(i))}var y=function(){function t(){this.h=[];}return t.prototype.u=function(t,i,n){var s={o:t,l:i,v:!0===n};this.h.push(s);},t.prototype._=function(t){var i=this.h.findIndex((function(i){return t===i.o}));i>-1&&this.h.splice(i,1);},t.prototype.M=function(t){this.h=this.h.filter((function(i){return i.l!==t}));},t.prototype.m=function(t,i){var n=g([],this.h,!0);this.h=this.h.filter((function(t){return !t.v})),n.forEach((function(n){return n.o(t,i)}));},t.prototype.p=function(){return this.h.length>0},t.prototype.g=function(){this.h=[];},t}();function k(t){for(var i=[],n=1;n<arguments.length;n++)i[n-1]=arguments[n];for(var s=0,h=i;s<h.length;s++){var r=h[s];for(var e in r)void 0!==r[e]&&("object"!=typeof r[e]||void 0===t[e]?t[e]=r[e]:k(t[e],r[e]));}return t}function N(t){return "number"==typeof t&&isFinite(t)}function x(t){return "number"==typeof t&&t%1==0}function C(t){return "string"==typeof t}function S(t){return "boolean"==typeof t}function T(t){var i,n,s,h=t;if(!h||"object"!=typeof h)return h;for(n in i=Array.isArray(h)?[]:{},h)h.hasOwnProperty(n)&&(s=h[n],i[n]=s&&"object"==typeof s?T(s):s);return i}function D(t){return null!==t}function A(t){return null===t?void 0:t}var B="'Trebuchet MS', Roboto, Ubuntu, sans-serif";function L(t,i,n){return n=void 0!==n?"".concat(n," "):"",void 0===i&&(i=B),"".concat(n).concat(t,"px ").concat(i)}var E=function(){function t(t){this.k={N:1,C:4,S:NaN,T:"",D:"",A:"",B:0,L:0,F:0,O:0,V:0},this.P=t;}return t.prototype.W=function(){var t=this.k,i=this.R(),n=this.I();return t.S===i&&t.D===n||(t.S=i,t.D=n,t.T=L(i,n),t.O=Math.floor(i/3.5),t.B=t.O,t.L=Math.max(Math.ceil(i/2-t.C/2),0),t.F=Math.ceil(i/2+t.C/2),t.V=Math.round(i/10)),t.A=this.j(),this.k},t.prototype.j=function(){return this.P.W().layout.textColor},t.prototype.R=function(){return this.P.W().layout.fontSize},t.prototype.I=function(){return this.P.W().layout.fontFamily},t}(),F=function(){function t(){this.q=[];}return t.prototype.U=function(t){this.q=t;},t.prototype.H=function(t,i,n,s){this.q.forEach((function(h){t.save(),h.H(t,i,n,s),t.restore();}));},t}(),O=function(){function t(){}return t.prototype.H=function(t,i,n,s){t.save(),t.scale(i,i),this.Y(t,n,s),t.restore();},t.prototype.$=function(t,i,n,s){t.save(),t.scale(i,i),this.K(t,n,s),t.restore();},t.prototype.K=function(t,i,n){},t}(),V=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.X=null,i}return m(i,t),i.prototype.Z=function(t){this.X=t;},i.prototype.Y=function(t){if(null!==this.X&&null!==this.X.J){var i=this.X.J,n=this.X,s=function(s){t.beginPath();for(var h=i.to-1;h>=i.from;--h){var r=n.G[h];t.moveTo(r.tt,r.it),t.arc(r.tt,r.it,s,0,2*Math.PI);}t.fill();};t.fillStyle=n.nt,s(n.st+2),t.fillStyle=n.ht,s(n.st);}},i}(O);function P(){return {G:[{tt:0,it:0,rt:0,et:0}],ht:"",nt:"",st:0,J:null}}var W={from:0,to:1},z=function(){function t(t,i){this.ut=new F,this.ot=[],this.lt=[],this.ft=!0,this.P=t,this.ct=i,this.ut.U(this.ot);}return t.prototype.vt=function(t){var i=this.P._t();i.length!==this.ot.length&&(this.lt=i.map(P),this.ot=this.lt.map((function(t){var i=new V;return i.Z(t),i})),this.ut.U(this.ot)),this.ft=!0;},t.prototype.dt=function(t,i,n){return this.ft&&(this.wt(t),this.ft=!1),this.ut},t.prototype.wt=function(t){var i=this,n=this.P._t(),s=this.ct.Mt(),h=this.P.bt();n.forEach((function(n,r){var e,a=i.lt[r],o=n.gt(s);if(null!==o&&n.yt()){var l=u(n.kt());a.ht=o.Nt,a.st=o.st,a.G[0].et=o.et,a.G[0].it=n.Ct().xt(o.et,l.St),a.nt=null!==(e=o.Tt)&&void 0!==e?e:i.P.Dt(a.G[0].it/t),a.G[0].rt=s,a.G[0].tt=h.At(s),a.J=W;}else a.J=null;}));},t}(),R=function(){function t(t){this.Bt=t;}return t.prototype.H=function(t,i,n,r){if(null!==this.Bt){var e=this.Bt.Lt.yt,u=this.Bt.Et.yt;if(e||u){t.save();var a=Math.round(this.Bt.tt*i),o=Math.round(this.Bt.it*i),l=Math.ceil(this.Bt.Ft*i),f=Math.ceil(this.Bt.Ot*i);t.lineCap="butt",e&&a>=0&&(t.lineWidth=Math.floor(this.Bt.Lt.Vt*i),t.strokeStyle=this.Bt.Lt.A,t.fillStyle=this.Bt.Lt.A,s(t,this.Bt.Lt.Pt),function(t,i,n,s){t.beginPath();var h=t.lineWidth%2?.5:0;t.moveTo(i+h,n),t.lineTo(i+h,s),t.stroke();}(t,a,0,f)),u&&o>=0&&(t.lineWidth=Math.floor(this.Bt.Et.Vt*i),t.strokeStyle=this.Bt.Et.A,t.fillStyle=this.Bt.Et.A,s(t,this.Bt.Et.Pt),h(t,o,0,l)),t.restore();}}},t}(),I=function(){function t(t){this.ft=!0,this.Wt={Lt:{Vt:1,Pt:0,A:"",yt:!1},Et:{Vt:1,Pt:0,A:"",yt:!1},Ft:0,Ot:0,tt:0,it:0},this.zt=new R(this.Wt),this.Rt=t;}return t.prototype.vt=function(){this.ft=!0;},t.prototype.dt=function(t,i){return this.ft&&(this.wt(),this.ft=!1),this.zt},t.prototype.wt=function(){var t=this.Rt.yt(),i=u(this.Rt.It()),n=i.jt().W().crosshair,s=this.Wt;s.Et.yt=t&&this.Rt.qt(i),s.Lt.yt=t&&this.Rt.Ut(),s.Et.Vt=n.horzLine.width,s.Et.Pt=n.horzLine.style,s.Et.A=n.horzLine.color,s.Lt.Vt=n.vertLine.width,s.Lt.Pt=n.vertLine.style,s.Lt.A=n.vertLine.color,s.Ft=i.Ht(),s.Ot=i.Yt(),s.tt=this.Rt.$t(),s.it=this.Rt.Kt();},t}();function j(t,i,n,s,h,r){t.fillRect(i+r,n,s-2*r,r),t.fillRect(i+r,n+h-r,s-2*r,r),t.fillRect(i,n,r,h),t.fillRect(i+s-r,n,r,h);}function q(t,i,n){t.save(),t.scale(i,i),n(),t.restore();}function U(t,i,n,s,h,r){t.save(),t.globalCompositeOperation="copy",t.fillStyle=r,t.fillRect(i,n,s,h),t.restore();}function H(t,i,n,s,h,r,e){t.save(),t.globalCompositeOperation="copy";var u=t.createLinearGradient(0,0,0,h);u.addColorStop(0,r),u.addColorStop(1,e),t.fillStyle=u,t.fillRect(i,n,s,h),t.restore();}var Y,$=function(){function t(t,i){this.Z(t,i);}return t.prototype.Z=function(t,i){this.Bt=t,this.Xt=i;},t.prototype.H=function(t,i,n,s,h,r){if(this.Bt.yt){t.font=i.T;var e=this.Bt.Zt||!this.Bt.Jt?i.C:0,u=i.N,a=i.O,o=i.B,l=i.L,f=i.F,c=this.Bt.Gt,v=Math.ceil(n.Qt(t,c)),_=i.V,d=i.S+a+o,w=Math.ceil(.5*d),M=u+v+l+f+e,b=this.Xt.ti;this.Xt.ii&&(b=this.Xt.ii);var m,p,g=(b=Math.round(b))-w,y=g+d,k="right"===h,N=k?s:0,x=Math.ceil(s*r),C=N;if(t.fillStyle=this.Xt.t,t.lineWidth=1,t.lineCap="butt",c){k?(m=N-e,p=(C=N-M)+f):(C=N+M,m=N+e,p=N+u+e+l);var S=Math.max(1,Math.floor(r)),T=Math.max(1,Math.floor(u*r)),D=k?x:0,A=Math.round(g*r),B=Math.round(C*r),L=Math.round(b*r)-Math.floor(.5*r),E=L+S+(L-A),F=Math.round(m*r);t.save(),t.beginPath(),t.moveTo(D,A),t.lineTo(B,A),t.lineTo(B,E),t.lineTo(D,E),t.fill(),t.fillStyle=this.Bt.Tt,t.fillRect(k?x-T:0,A,T,E-A),this.Bt.Zt&&(t.fillStyle=this.Xt.A,t.fillRect(D,L,F-D,S)),t.textAlign="left",t.fillStyle=this.Xt.A,q(t,r,(function(){t.fillText(c,p,y-o-_);})),t.restore();}}},t.prototype.Yt=function(t,i){return this.Bt.yt?t.S+t.O+t.B:0},t}(),K=function(){function t(t){this.ni={ti:0,A:"#FFF",t:"#000"},this.si={Gt:"",yt:!1,Zt:!0,Jt:!1,Tt:""},this.hi={Gt:"",yt:!1,Zt:!1,Jt:!0,Tt:""},this.ft=!0,this.ri=new(t||$)(this.si,this.ni),this.ei=new(t||$)(this.hi,this.ni);}return t.prototype.Gt=function(){return this.ui(),this.si.Gt},t.prototype.ti=function(){return this.ui(),this.ni.ti},t.prototype.vt=function(){this.ft=!0;},t.prototype.Yt=function(t,i){return void 0===i&&(i=!1),Math.max(this.ri.Yt(t,i),this.ei.Yt(t,i))},t.prototype.ai=function(){return this.ni.ii||0},t.prototype.oi=function(t){this.ni.ii=t;},t.prototype.li=function(){return this.ui(),this.si.yt||this.hi.yt},t.prototype.fi=function(){return this.ui(),this.si.yt},t.prototype.dt=function(t){return this.ui(),this.si.Zt=this.si.Zt&&t.W().drawTicks,this.hi.Zt=this.hi.Zt&&t.W().drawTicks,this.ri.Z(this.si,this.ni),this.ei.Z(this.hi,this.ni),this.ri},t.prototype.ci=function(){return this.ui(),this.ri.Z(this.si,this.ni),this.ei.Z(this.hi,this.ni),this.ei},t.prototype.ui=function(){this.ft&&(this.si.Zt=!0,this.hi.Zt=!1,this.vi(this.si,this.hi,this.ni));},t}(),X=function(t){function i(i,n,s){var h=t.call(this)||this;return h.Rt=i,h._i=n,h.di=s,h}return m(i,t),i.prototype.vi=function(t,i,n){t.yt=!1;var s=this.Rt.W().horzLine;if(s.labelVisible){var h=this._i.kt();if(this.Rt.yt()&&!this._i.wi()&&null!==h){var r=M(s.labelBackgroundColor);n.t=r.t,n.A=r.i;var e=this.di(this._i);n.ti=e.ti,t.Gt=this._i.Mi(e.et,h),t.yt=!0;}}},i}(K),Z=/[1-9]/g,J=function(){function t(){this.Bt=null;}return t.prototype.Z=function(t){this.Bt=t;},t.prototype.H=function(t,i,n){var s=this;if(null!==this.Bt&&!1!==this.Bt.yt&&0!==this.Bt.Gt.length){t.font=i.T;var h=Math.round(i.bi.Qt(t,this.Bt.Gt,Z));if(!(h<=0)){t.save();var r=i.mi,e=h+2*r,a=e/2,o=this.Bt.Ht,l=this.Bt.ti,f=Math.floor(l-a)+.5;f<0?(l+=Math.abs(0-f),f=Math.floor(l-a)+.5):f+e>o&&(l-=Math.abs(o-(f+e)),f=Math.floor(l-a)+.5);var c=f+e,v=0+i.N+i.O+i.S+i.B;t.fillStyle=this.Bt.t;var _=Math.round(f*n),d=Math.round(0*n),w=Math.round(c*n),M=Math.round(v*n);t.fillRect(_,d,w-_,M-d);var b=Math.round(this.Bt.ti*n),m=d,p=Math.round((m+i.N+i.C)*n);t.fillStyle=this.Bt.A;var g=Math.max(1,Math.floor(n)),y=Math.floor(.5*n);t.fillRect(b-y,m,g,p-m);var k=v-i.V-i.B;t.textAlign="left",t.fillStyle=this.Bt.A,q(t,n,(function(){t.fillText(u(s.Bt).Gt,f+r,k);})),t.restore();}}},t}(),G=function(){function t(t,i,n){this.ft=!0,this.zt=new J,this.Wt={yt:!1,t:"#4c525e",A:"white",Gt:"",Ht:0,ti:NaN},this.ct=t,this.pi=i,this.di=n;}return t.prototype.vt=function(){this.ft=!0;},t.prototype.dt=function(){return this.ft&&(this.wt(),this.ft=!1),this.zt.Z(this.Wt),this.zt},t.prototype.wt=function(){var t=this.Wt;t.yt=!1;var i=this.ct.W().vertLine;if(i.labelVisible){var n=this.pi.bt();if(!n.wi()){var s=n.gi(this.ct.Mt());t.Ht=n.Ht();var h=this.di();if(h.rt){t.ti=h.ti,t.Gt=n.yi(u(s)),t.yt=!0;var r=M(i.labelBackgroundColor);t.t=r.t,t.A=r.i;}}}},t}(),Q=function(){function t(){this.ki=null,this.Ni=0;}return t.prototype.xi=function(){return this.Ni},t.prototype.Ci=function(t){this.Ni=t;},t.prototype.Ct=function(){return this.ki},t.prototype.Si=function(t){this.ki=t;},t.prototype.Ti=function(){return []},t.prototype.yt=function(){return !0},t}();!function(t){t[t.Normal=0]="Normal",t[t.Magnet=1]="Magnet";}(Y||(Y={}));var tt=function(t){function i(i,n){var s=t.call(this)||this;s.Di=null,s.Ai=NaN,s.Bi=0,s.Li=!0,s.Ei=new Map,s.Fi=!1,s.Oi=NaN,s.Vi=NaN,s.Pi=NaN,s.Wi=NaN,s.pi=i,s.zi=n,s.Ri=new z(i,s);var h,r;s.Ii=(h=function(){return s.Ai},r=function(){return s.Vi},function(t){var i=r(),n=h();if(t===u(s.Di).ji())return {et:n,ti:i};var e=u(t.kt());return {et:t.qi(i,e),ti:i}});var e=function(t,i){return function(){return {rt:s.pi.bt().gi(t()),ti:i()}}}((function(){return s.Bi}),(function(){return s.$t()}));return s.Ui=new G(s,i,e),s.Hi=new I(s),s}return m(i,t),i.prototype.W=function(){return this.zi},i.prototype.Yi=function(t,i){this.Pi=t,this.Wi=i;},i.prototype.$i=function(){this.Pi=NaN,this.Wi=NaN;},i.prototype.Ki=function(){return this.Pi},i.prototype.Xi=function(){return this.Wi},i.prototype.Zi=function(t,i,n){this.Fi||(this.Fi=!0),this.Li=!0,this.Ji(t,i,n);},i.prototype.Mt=function(){return this.Bi},i.prototype.$t=function(){return this.Oi},i.prototype.Kt=function(){return this.Vi},i.prototype.yt=function(){return this.Li},i.prototype.Gi=function(){this.Li=!1,this.Qi(),this.Ai=NaN,this.Oi=NaN,this.Vi=NaN,this.Di=null,this.$i();},i.prototype.tn=function(t){return null!==this.Di?[this.Hi,this.Ri]:[]},i.prototype.qt=function(t){return t===this.Di&&this.zi.horzLine.visible},i.prototype.Ut=function(){return this.zi.vertLine.visible},i.prototype.nn=function(t,i){this.Li&&this.Di===t||this.Ei.clear();var n=[];return this.Di===t&&n.push(this.sn(this.Ei,i,this.Ii)),n},i.prototype.Ti=function(){return this.Li?[this.Ui]:[]},i.prototype.It=function(){return this.Di},i.prototype.hn=function(){this.Hi.vt(),this.Ei.forEach((function(t){return t.vt()})),this.Ui.vt(),this.Ri.vt();},i.prototype.rn=function(t){return t&&!t.ji().wi()?t.ji():null},i.prototype.Ji=function(t,i,n){this.en(t,i,n)&&this.hn();},i.prototype.en=function(t,i,n){var s=this.Oi,h=this.Vi,r=this.Ai,e=this.Bi,u=this.Di,a=this.rn(n);this.Bi=t,this.Oi=isNaN(t)?NaN:this.pi.bt().At(t),this.Di=n;var o=null!==a?a.kt():null;return null!==a&&null!==o?(this.Ai=i,this.Vi=a.xt(i,o)):(this.Ai=NaN,this.Vi=NaN),s!==this.Oi||h!==this.Vi||e!==this.Bi||r!==this.Ai||u!==this.Di},i.prototype.Qi=function(){var t=this.pi._t().map((function(t){return t.an().un()})).filter(D),i=0===t.length?null:Math.max.apply(Math,t);this.Bi=null!==i?i:NaN;},i.prototype.sn=function(t,i,n){var s=t.get(i);return void 0===s&&(s=new X(this,i,n),t.set(i,s)),s},i}(Q);function it(t){return "left"===t||"right"===t}var nt=function(){function t(t){this.on=new Map,this.ln=[],this.fn=t;}return t.prototype.cn=function(t,i){var n=function(t,i){return void 0===t?i:{vn:Math.max(t.vn,i.vn),_n:t._n||i._n}}(this.on.get(t),i);this.on.set(t,n);},t.prototype.dn=function(){return this.fn},t.prototype.wn=function(t){var i=this.on.get(t);return void 0===i?{vn:this.fn}:{vn:Math.max(this.fn,i.vn),_n:i._n}},t.prototype.Mn=function(){this.ln=[{bn:0}];},t.prototype.mn=function(t){this.ln=[{bn:1,St:t}];},t.prototype.pn=function(){this.ln=[{bn:4}];},t.prototype.gn=function(t){this.ln.push({bn:2,St:t});},t.prototype.yn=function(t){this.ln.push({bn:3,St:t});},t.prototype.kn=function(){return this.ln},t.prototype.Nn=function(t){for(var i=this,n=0,s=t.ln;n<s.length;n++){var h=s[n];this.xn(h);}this.fn=Math.max(this.fn,t.fn),t.on.forEach((function(t,n){i.cn(n,t);}));},t.prototype.xn=function(t){switch(t.bn){case 0:this.Mn();break;case 1:this.mn(t.St);break;case 2:this.gn(t.St);break;case 3:this.yn(t.St);break;case 4:this.pn();}},t}(),st=".";function ht(t,i){if(!N(t))return "n/a";if(!x(i))throw new TypeError("invalid length");if(i<0||i>16)throw new TypeError("invalid length");if(0===i)return t.toString();return ("0000000000000000"+t.toString()).slice(-i)}var rt=function(){function t(t,i){if(i||(i=1),N(t)&&x(t)||(t=100),t<0)throw new TypeError("invalid base");this._i=t,this.Cn=i,this.Sn();}return t.prototype.format=function(t){var i=t<0?"−":"";return t=Math.abs(t),i+this.Tn(t)},t.prototype.Sn=function(){if(this.Dn=0,this._i>0&&this.Cn>0)for(var t=this._i;t>1;)t/=10,this.Dn++;},t.prototype.Tn=function(t){var i=this._i/this.Cn,n=Math.floor(t),s="",h=void 0!==this.Dn?this.Dn:NaN;if(i>1){var r=+(Math.round(t*i)-n*i).toFixed(this.Dn);r>=i&&(r-=i,n+=1),s=st+ht(+r.toFixed(this.Dn)*this.Cn,h);}else n=Math.round(n*i)/i,h>0&&(s=st+ht(0,h));return n.toFixed(0)+s},t}(),et=function(t){function i(i){return void 0===i&&(i=100),t.call(this,i)||this}return m(i,t),i.prototype.format=function(i){return "".concat(t.prototype.format.call(this,i),"%")},i}(rt),ut=function(){function t(t){this.An=t;}return t.prototype.format=function(t){var i="";return t<0&&(i="-",t=-t),t<995?i+this.Bn(t):t<999995?i+this.Bn(t/1e3)+"K":t<999999995?(t=1e3*Math.round(t/1e3),i+this.Bn(t/1e6)+"M"):(t=1e6*Math.round(t/1e6),i+this.Bn(t/1e9)+"B")},t.prototype.Bn=function(t){var i=Math.pow(10,this.An);return ((t=Math.round(t*i)/i)>=1e-15&&t<1?t.toFixed(this.An).replace(/\.?0+$/,""):String(t)).replace(/(\.[1-9]*)0+$/,(function(t,i){return i}))},t}();function at(t,i,n,s){if(0!==i.length){var h=i[s.from].tt,r=i[s.from].it;t.moveTo(h,r);for(var e=s.from+1;e<s.to;++e){var u=i[e];if(1===n){var a=i[e-1].it,o=u.tt;t.lineTo(o,a);}t.lineTo(u.tt,u.it);}}}var ot=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.X=null,i}return m(i,t),i.prototype.Z=function(t){this.X=t;},i.prototype.Y=function(t){if(null!==this.X&&0!==this.X.G.length&&null!==this.X.J){if(t.lineCap="butt",t.lineJoin="round",t.lineWidth=this.X.Vt,s(t,this.X.Pt),t.lineWidth=1,t.beginPath(),1===this.X.G.length){var i=this.X.G[0],n=this.X.Ln/2;t.moveTo(i.tt-n,this.X.En),t.lineTo(i.tt-n,i.it),t.lineTo(i.tt+n,i.it),t.lineTo(i.tt+n,this.X.En);}else t.moveTo(this.X.G[this.X.J.from].tt,this.X.En),t.lineTo(this.X.G[this.X.J.from].tt,this.X.G[this.X.J.from].it),at(t,this.X.G,this.X.Fn,this.X.J),this.X.J.to>this.X.J.from&&(t.lineTo(this.X.G[this.X.J.to-1].tt,this.X.En),t.lineTo(this.X.G[this.X.J.from].tt,this.X.En));t.closePath(),t.fillStyle=this.On(t),t.fill();}},i}(O),lt=function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return m(i,t),i.prototype.On=function(t){var i=this.X,n=t.createLinearGradient(0,0,0,i.Vn);return n.addColorStop(0,i.Pn),n.addColorStop(1,i.Wn),n},i}(ot),ft=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.X=null,i}return m(i,t),i.prototype.Z=function(t){this.X=t;},i.prototype.Y=function(t){if(null!==this.X&&0!==this.X.G.length&&null!==this.X.J)if(t.lineCap="butt",t.lineWidth=this.X.Vt,s(t,this.X.Pt),t.strokeStyle=this.zn(t),t.lineJoin="round",1===this.X.G.length){t.beginPath();var i=this.X.G[0];t.moveTo(i.tt-this.X.Ln/2,i.it),t.lineTo(i.tt+this.X.Ln/2,i.it),void 0!==i.A&&(t.strokeStyle=i.A),t.stroke();}else this.Rn(t,this.X);},i.prototype.Rn=function(t,i){t.beginPath(),at(t,i.G,i.Fn,i.J),t.stroke();},i}(O),ct=function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return m(i,t),i.prototype.Rn=function(t,i){var n,s,h=i.G,r=i.J,e=i.Fn,u=i.ht;if(0!==h.length&&null!==r){t.beginPath();var a=h[r.from];t.moveTo(a.tt,a.it);var o=null!==(n=a.A)&&void 0!==n?n:u;t.strokeStyle=o;for(var l=function(i){t.stroke(),t.beginPath(),t.strokeStyle=i,o=i;},f=r.from+1;f<r.to;++f){var c=h[f],v=h[f-1],_=null!==(s=c.A)&&void 0!==s?s:u;1===e&&(t.lineTo(c.tt,v.it),_!==o&&(l(_),t.moveTo(c.tt,v.it))),t.lineTo(c.tt,c.it),1!==e&&_!==o&&(l(_),t.moveTo(c.tt,c.it));}t.stroke();}},i.prototype.zn=function(){return this.X.ht},i}(ft);function vt(t,i,n,s,h){void 0===s&&(s=0),void 0===h&&(h=t.length);for(var r=h-s;0<r;){var e=r>>1,u=s+e;n(t[u],i)?(s=u+1,r-=e+1):r=e;}return s}function _t(t,i,n,s,h){void 0===s&&(s=0),void 0===h&&(h=t.length);for(var r=h-s;0<r;){var e=r>>1,u=s+e;n(i,t[u])?r=e:(s=u+1,r-=e+1);}return s}function dt(t,i){return t.rt<i}function wt(t,i){return t<i.rt}function Mt(t,i,n){var s=i.In(),h=i.jn(),r=vt(t,s,dt),e=_t(t,h,wt);if(!n)return {from:r,to:e};var u=r,a=e;return r>0&&r<t.length&&t[r].rt>=s&&(u=r-1),e>0&&e<t.length&&t[e-1].rt<=h&&(a=e+1),{from:u,to:a}}var bt=function(){function t(t,i,n){this.qn=!0,this.Un=!0,this.Hn=!0,this.Yn=[],this.$n=null,this.Kn=t,this.Xn=i,this.Zn=n;}return t.prototype.vt=function(t){this.qn=!0,"data"===t&&(this.Un=!0),"options"===t&&(this.Hn=!0);},t.prototype.Jn=function(){this.Un&&(this.Gn(),this.Un=!1),this.qn&&(this.Qn(),this.qn=!1),this.Hn&&(this.ts(),this.Hn=!1);},t.prototype.ns=function(){this.$n=null;},t.prototype.Qn=function(){var t=this.Kn.Ct(),i=this.Xn.bt();if(this.ns(),!i.wi()&&!t.wi()){var n=i.ss();if(null!==n&&0!==this.Kn.an().hs()){var s=this.Kn.kt();null!==s&&(this.$n=Mt(this.Yn,n,this.Zn),this.rs(t,i,s.St));}}},t}(),mt=function(t){function i(i,n){return t.call(this,i,n,!0)||this}return m(i,t),i.prototype.rs=function(t,i,n){i.es(this.Yn,A(this.$n)),t.us(this.Yn,n,A(this.$n));},i.prototype.os=function(t,i){return {rt:t,et:i,tt:NaN,it:NaN}},i.prototype.ts=function(){},i.prototype.Gn=function(){var t=this,i=this.Kn.ls();this.Yn=this.Kn.an().fs().map((function(n){var s=n.St[3];return t.cs(n.vs,s,i)}));},i}(bt),pt=function(t){function i(i,n){var s=t.call(this,i,n)||this;return s.zt=new F,s._s=new lt,s.ds=new ct,s.zt.U([s._s,s.ds]),s}return m(i,t),i.prototype.dt=function(t,i){if(!this.Kn.yt())return null;var n=this.Kn.W();return this.Jn(),this._s.Z({Fn:n.lineType,G:this.Yn,Pt:n.lineStyle,Vt:n.lineWidth,Pn:n.topColor,Wn:n.bottomColor,En:t,Vn:t,J:this.$n,Ln:this.Xn.bt().ws()}),this.ds.Z({Fn:n.lineType,G:this.Yn,ht:n.lineColor,Pt:n.lineStyle,Vt:n.lineWidth,J:this.$n,Ln:this.Xn.bt().ws()}),this.zt},i.prototype.cs=function(t,i){return this.os(t,i)},i}(mt);var gt=function(){function t(){this.Bt=null,this.Ms=0,this.bs=0;}return t.prototype.Z=function(t){this.Bt=t;},t.prototype.H=function(t,i,n,s){if(null!==this.Bt&&0!==this.Bt.an.length&&null!==this.Bt.J){if(this.Ms=this.ps(i),this.Ms>=2)Math.max(1,Math.floor(i))%2!=this.Ms%2&&this.Ms--;this.bs=this.Bt.gs?Math.min(this.Ms,Math.floor(i)):this.Ms;for(var h=null,r=this.bs<=this.Ms&&this.Bt.ws>=Math.floor(1.5*i),e=this.Bt.J.from;e<this.Bt.J.to;++e){var u=this.Bt.an[e];h!==u.A&&(t.fillStyle=u.A,h=u.A);var a=Math.floor(.5*this.bs),o=Math.round(u.tt*i),l=o-a,f=this.bs,c=l+f-1,v=Math.min(u.ys,u.ks),_=Math.max(u.ys,u.ks),d=Math.round(v*i)-a,w=Math.round(_*i)+a,M=Math.max(w-d,this.bs);t.fillRect(l,d,f,M);var b=Math.ceil(1.5*this.Ms);if(r){if(this.Bt.Ns){var m=o-b,p=Math.max(d,Math.round(u.xs*i)-a),g=p+f-1;g>d+M-1&&(p=(g=d+M-1)-f+1),t.fillRect(m,p,l-m,g-p+1);}var y=o+b,k=Math.max(d,Math.round(u.Cs*i)-a),N=k+f-1;N>d+M-1&&(k=(N=d+M-1)-f+1),t.fillRect(c+1,k,y-c,N-k+1);}}}},t.prototype.ps=function(t){var i=Math.floor(t);return Math.max(i,Math.floor(function(t,i){return Math.floor(.3*t*i)}(u(this.Bt).ws,t)))},t}(),yt=function(t){function i(i,n){return t.call(this,i,n,!1)||this}return m(i,t),i.prototype.rs=function(t,i,n){i.es(this.Yn,A(this.$n)),t.Ss(this.Yn,n,A(this.$n));},i.prototype.Ts=function(t,i,n){return {rt:t,open:i.St[0],high:i.St[1],low:i.St[2],close:i.St[3],tt:NaN,xs:NaN,ys:NaN,ks:NaN,Cs:NaN}},i.prototype.Gn=function(){var t=this,i=this.Kn.ls();this.Yn=this.Kn.an().fs().map((function(n){return t.cs(n.vs,n,i)}));},i}(bt),kt=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.zt=new gt,i}return m(i,t),i.prototype.dt=function(t,i){if(!this.Kn.yt())return null;var n=this.Kn.W();this.Jn();var s={an:this.Yn,ws:this.Xn.bt().ws(),Ns:n.openVisible,gs:n.thinBars,J:this.$n};return this.zt.Z(s),this.zt},i.prototype.ts=function(){var t=this;this.Yn.forEach((function(i){i.A=t.Kn.ls().As(i.rt).Ds;}));},i.prototype.cs=function(t,i,n){return p(p({},this.Ts(t,i,n)),{A:n.As(t).Ds})},i}(yt);function Nt(t,i,n){return Math.min(Math.max(t,i),n)}function xt(t,i,n){return i-t<=n}function Ct(t){return t<=0?NaN:Math.log(t)/Math.log(10)}function St(t){var i=Math.ceil(t);return i%2!=0?i-1:i}function Tt(t){var i=Math.ceil(t);return i%2==0?i-1:i}var Dt=function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return m(i,t),i.prototype.On=function(t){var i=this.X,n=t.createLinearGradient(0,0,0,i.Vn),s=Nt(i.En/i.Vn,0,1);return n.addColorStop(0,i.Bs),n.addColorStop(s,i.Ls),n.addColorStop(s,i.Es),n.addColorStop(1,i.Fs),n},i}(ot),At=function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return m(i,t),i.prototype.zn=function(t){var i=this.X,n=t.createLinearGradient(0,0,0,i.Vn),s=Nt(i.En/i.Vn,0,1);return n.addColorStop(0,i.Pn),n.addColorStop(s,i.Pn),n.addColorStop(s,i.Wn),n.addColorStop(1,i.Wn),n},i}(ft),Bt=function(t){function i(i,n){var s=t.call(this,i,n)||this;return s.Os=new Dt,s.Vs=new At,s.ut=new F,s.ut.U([s.Os,s.Vs]),s}return m(i,t),i.prototype.dt=function(t,i){if(!this.Kn.yt())return null;var n=this.Kn.kt();if(null===n)return null;var s=this.Kn.W();this.Jn();var h=this.Kn.Ct().xt(s.baseValue.price,n.St),r=this.Xn.bt().ws();return this.Os.Z({G:this.Yn,Bs:s.topFillColor1,Ls:s.topFillColor2,Es:s.bottomFillColor1,Fs:s.bottomFillColor2,Vt:s.lineWidth,Pt:s.lineStyle,Fn:0,En:h,Vn:t,J:this.$n,Ln:r}),this.Vs.Z({G:this.Yn,Pn:s.topLineColor,Wn:s.bottomLineColor,Vt:s.lineWidth,Pt:s.lineStyle,Fn:0,En:h,Vn:t,J:this.$n,Ln:r}),this.ut},i.prototype.cs=function(t,i){return this.os(t,i)},i}(mt),Lt=function(){function t(){this.Bt=null,this.Ms=0;}return t.prototype.Z=function(t){this.Bt=t;},t.prototype.H=function(t,i,n,s){if(null!==this.Bt&&0!==this.Bt.an.length&&null!==this.Bt.J){if(this.Ms=function(t,i){if(t>=2.5&&t<=4)return Math.floor(3*i);var n=1-.2*Math.atan(Math.max(4,t)-4)/(.5*Math.PI),s=Math.floor(t*n*i),h=Math.floor(t*i),r=Math.min(s,h);return Math.max(Math.floor(i),r)}(this.Bt.ws,i),this.Ms>=2)Math.floor(i)%2!=this.Ms%2&&this.Ms--;var h=this.Bt.an;this.Bt.Ps&&this.Ws(t,h,this.Bt.J,i),this.Bt.zs&&this.Rs(t,h,this.Bt.J,this.Bt.ws,i);var r=this.Is(i);(!this.Bt.zs||this.Ms>2*r)&&this.js(t,h,this.Bt.J,i);}},t.prototype.Ws=function(t,i,n,s){if(null!==this.Bt){var h="",r=Math.min(Math.floor(s),Math.floor(this.Bt.ws*s));r=Math.max(Math.floor(s),Math.min(r,this.Ms));for(var e=Math.floor(.5*r),u=null,a=n.from;a<n.to;a++){var o=i[a];o.qs!==h&&(t.fillStyle=o.qs,h=o.qs);var l=Math.round(Math.min(o.xs,o.Cs)*s),f=Math.round(Math.max(o.xs,o.Cs)*s),c=Math.round(o.ys*s),v=Math.round(o.ks*s),_=Math.round(s*o.tt)-e,d=_+r-1;null!==u&&(_=Math.max(u+1,_),_=Math.min(_,d));var w=d-_+1;t.fillRect(_,c,w,l-c),t.fillRect(_,f+1,w,v-f),u=d;}}},t.prototype.Is=function(t){var i=Math.floor(1*t);this.Ms<=2*i&&(i=Math.floor(.5*(this.Ms-1)));var n=Math.max(Math.floor(t),i);return this.Ms<=2*n?Math.max(Math.floor(t),Math.floor(1*t)):n},t.prototype.Rs=function(t,i,n,s,h){if(null!==this.Bt)for(var r="",e=this.Is(h),u=null,a=n.from;a<n.to;a++){var o=i[a];o.Tt!==r&&(t.fillStyle=o.Tt,r=o.Tt);var l=Math.round(o.tt*h)-Math.floor(.5*this.Ms),f=l+this.Ms-1,c=Math.round(Math.min(o.xs,o.Cs)*h),v=Math.round(Math.max(o.xs,o.Cs)*h);if(null!==u&&(l=Math.max(u+1,l),l=Math.min(l,f)),this.Bt.ws*h>2*e)j(t,l,c,f-l+1,v-c+1,e);else {var _=f-l+1;t.fillRect(l,c,_,v-c+1);}u=f;}},t.prototype.js=function(t,i,n,s){if(null!==this.Bt)for(var h="",r=this.Is(s),e=n.from;e<n.to;e++){var u=i[e],a=Math.round(Math.min(u.xs,u.Cs)*s),o=Math.round(Math.max(u.xs,u.Cs)*s),l=Math.round(u.tt*s)-Math.floor(.5*this.Ms),f=l+this.Ms-1;if(u.A!==h){var c=u.A;t.fillStyle=c,h=c;}this.Bt.zs&&(l+=r,a+=r,f-=r,o-=r),a>o||t.fillRect(l,a,f-l+1,o-a+1);}},t}(),Et=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.zt=new Lt,i}return m(i,t),i.prototype.dt=function(t,i){if(!this.Kn.yt())return null;var n=this.Kn.W();this.Jn();var s={an:this.Yn,ws:this.Xn.bt().ws(),Ps:n.wickVisible,zs:n.borderVisible,J:this.$n};return this.zt.Z(s),this.zt},i.prototype.ts=function(){var t=this;this.Yn.forEach((function(i){var n=t.Kn.ls().As(i.rt);i.A=n.Ds,i.qs=n.Us,i.Tt=n.Hs;}));},i.prototype.cs=function(t,i,n){var s=n.As(t);return p(p({},this.Ts(t,i,n)),{A:s.Ds,qs:s.Us,Tt:s.Hs})},i}(yt),Ft=function(){function t(){this.Bt=null,this.Ys=[];}return t.prototype.Z=function(t){this.Bt=t,this.Ys=[];},t.prototype.H=function(t,i,n,s){if(null!==this.Bt&&0!==this.Bt.G.length&&null!==this.Bt.J){this.Ys.length||this.$s(i);for(var h=Math.max(1,Math.floor(i)),r=Math.round(this.Bt.Ks*i)-Math.floor(h/2),e=r+h,u=this.Bt.J.from;u<this.Bt.J.to;u++){var a=this.Bt.G[u],o=this.Ys[u-this.Bt.J.from],l=Math.round(a.it*i);t.fillStyle=a.A;var f=void 0,c=void 0;l<=r?(f=l,c=e):(f=r,c=l-Math.floor(h/2)+h),t.fillRect(o.In,f,o.jn-o.In+1,c-f);}}},t.prototype.$s=function(t){if(null!==this.Bt&&0!==this.Bt.G.length&&null!==this.Bt.J){var i=Math.ceil(this.Bt.ws*t)<=1?0:Math.max(1,Math.floor(t)),n=Math.round(this.Bt.ws*t)-i;this.Ys=new Array(this.Bt.J.to-this.Bt.J.from);for(var s=this.Bt.J.from;s<this.Bt.J.to;s++){var h,r=this.Bt.G[s],e=Math.round(r.tt*t),u=void 0,a=void 0;if(n%2)u=e-(h=(n-1)/2),a=e+h;else u=e-(h=n/2),a=e+h-1;this.Ys[s-this.Bt.J.from]={In:u,jn:a,Xs:e,Zs:r.tt*t,rt:r.rt};}for(s=this.Bt.J.from+1;s<this.Bt.J.to;s++){var o=this.Ys[s-this.Bt.J.from],l=this.Ys[s-this.Bt.J.from-1];o.rt===l.rt+1&&(o.In-l.jn!==i+1&&(l.Xs>l.Zs?l.jn=o.In-i-1:o.In=l.jn+i+1));}var f=Math.ceil(this.Bt.ws*t);for(s=this.Bt.J.from;s<this.Bt.J.to;s++){(o=this.Ys[s-this.Bt.J.from]).jn<o.In&&(o.jn=o.In);var c=o.jn-o.In+1;f=Math.min(c,f);}if(i>0&&f<4)for(s=this.Bt.J.from;s<this.Bt.J.to;s++){(c=(o=this.Ys[s-this.Bt.J.from]).jn-o.In+1)>f&&(o.Xs>o.Zs?o.jn-=1:o.In+=1);}}else this.Ys=[];},t}();function Ot(t){return {G:[],ws:t,Ks:NaN,J:null}}function Vt(t,i,n){return {rt:t,et:i,tt:NaN,it:NaN,A:n}}var Pt=function(t){function i(i,n){var s=t.call(this,i,n,!1)||this;return s.ut=new F,s.Js=Ot(0),s.zt=new Ft,s}return m(i,t),i.prototype.dt=function(t,i){return this.Kn.yt()?(this.Jn(),this.ut):null},i.prototype.Gn=function(){var t=this.Xn.bt().ws();this.Js=Ot(t);for(var i=0,n=0,s=this.Kn.W().color,h=0,r=this.Kn.an().fs();h<r.length;h++){var e=r[h],u=e.St[3],a=void 0!==e.A?e.A:s,o=Vt(e.vs,u,a);++i<this.Js.G.length?this.Js.G[i]=o:this.Js.G.push(o),this.Yn[n++]={rt:e.vs,tt:0};}this.zt.Z(this.Js),this.ut.U([this.zt]);},i.prototype.ts=function(){},i.prototype.ns=function(){t.prototype.ns.call(this),this.Js.J=null;},i.prototype.rs=function(t,i,n){if(null!==this.$n){var s=i.ws(),h=u(i.ss()),r=t.xt(this.Kn.W().base,n);i.es(this.Js.G),t.us(this.Js.G,n),this.Js.Ks=r,this.Js.J=Mt(this.Js.G,h,!1),this.Js.ws=s,this.zt.Z(this.Js);}},i}(bt),Wt=function(t){function i(i,n){var s=t.call(this,i,n)||this;return s.ds=new ct,s}return m(i,t),i.prototype.dt=function(t,i){if(!this.Kn.yt())return null;var n=this.Kn.W();this.Jn();var s={G:this.Yn,ht:n.color,Pt:n.lineStyle,Fn:n.lineType,Vt:n.lineWidth,J:this.$n,Ln:this.Xn.bt().ws()};return this.ds.Z(s),this.ds},i.prototype.ts=function(){var t=this;this.Yn.forEach((function(i){i.A=t.Kn.ls().As(i.rt).Ds;}));},i.prototype.cs=function(t,i,n){var s=this.os(t,i);return s.A=n.As(t).Ds,s},i}(mt),zt=/[2-9]/g,Rt=function(){function t(t){void 0===t&&(t=50),this.Gs=new Map,this.Qs=0,this.th=Array.from(new Array(t));}return t.prototype.ih=function(){this.Gs.clear(),this.th.fill(void 0);},t.prototype.Qt=function(t,i,n){var s=n||zt,h=String(i).replace(s,"0"),r=this.Gs.get(h);if(void 0===r){if(0===(r=t.measureText(h).width)&&0!==i.length)return 0;var e=this.th[this.Qs];void 0!==e&&this.Gs.delete(e),this.th[this.Qs]=h,this.Qs=(this.Qs+1)%this.th.length,this.Gs.set(h,r);}return r},t}(),It=function(){function t(t){this.nh=null,this.k=null,this.sh="right",this.hh=0,this.rh=t;}return t.prototype.eh=function(t,i,n,s){this.nh=t,this.k=i,this.hh=n,this.sh=s;},t.prototype.H=function(t,i){null!==this.k&&null!==this.nh&&this.nh.H(t,this.k,this.rh,this.hh,this.sh,i);},t}(),jt=function(){function t(t,i,n){this.uh=t,this.rh=new Rt(50),this.ah=i,this.P=n,this.R=-1,this.zt=new It(this.rh);}return t.prototype.dt=function(t,i){var n=this.P.oh(this.ah);if(null===n)return null;var s=n.lh(this.ah)?n.fh():this.ah.Ct();if(null===s)return null;var h=n._h(s);if("overlay"===h)return null;var r=this.P.dh();return r.S!==this.R&&(this.R=r.S,this.rh.ih()),this.zt.eh(this.uh.ci(),r,i,h),this.zt},t}(),qt=function(){function t(){this.Bt=null;}return t.prototype.Z=function(t){this.Bt=t;},t.prototype.H=function(t,i,n,r){if(null!==this.Bt&&!1!==this.Bt.yt){var e=Math.round(this.Bt.it*i);if(!(e<0||e>Math.ceil(this.Bt.Yt*i))){var u=Math.ceil(this.Bt.Ht*i);t.lineCap="butt",t.strokeStyle=this.Bt.A,t.lineWidth=Math.floor(this.Bt.Vt*i),s(t,this.Bt.Pt),h(t,e,0,u);}}},t}(),Ut=function(){function t(t){this.wh={Ht:0,Yt:0,it:0,A:"rgba(0, 0, 0, 0)",Vt:1,Pt:0,yt:!1},this.Mh=new qt,this.ft=!0,this.Kn=t,this.Xn=t.jt(),this.Mh.Z(this.wh);}return t.prototype.vt=function(){this.ft=!0;},t.prototype.dt=function(t,i){return this.Kn.yt()?(this.ft&&(this.bh(t,i),this.ft=!1),this.Mh):null},t}(),Ht=function(t){function i(i){return t.call(this,i)||this}return m(i,t),i.prototype.bh=function(t,i){this.wh.yt=!1;var n=this.Kn.Ct(),s=n.mh().mh;if(2===s||3===s){var h=this.Kn.W();if(h.baseLineVisible&&this.Kn.yt()){var r=this.Kn.kt();null!==r&&(this.wh.yt=!0,this.wh.it=n.xt(r.St,r.St),this.wh.Ht=i,this.wh.Yt=t,this.wh.A=h.baseLineColor,this.wh.Vt=h.baseLineWidth,this.wh.Pt=h.baseLineStyle);}}},i}(Ut),Yt=function(){function t(){this.Bt=null;}return t.prototype.Z=function(t){this.Bt=t;},t.prototype.ph=function(){return this.Bt},t.prototype.H=function(t,i,n,s){var h=this.Bt;if(null!==h){t.save();var r=Math.max(1,Math.floor(i)),e=r%2/2,u=Math.round(h.Zs.x*i)+e,a=h.Zs.y*i;t.fillStyle=h.gh,t.beginPath();var o=Math.max(2,1.5*h.yh)*i;t.arc(u,a,o,0,2*Math.PI,!1),t.fill(),t.fillStyle=h.kh,t.beginPath(),t.arc(u,a,h.st*i,0,2*Math.PI,!1),t.fill(),t.lineWidth=r,t.strokeStyle=h.Nh,t.beginPath(),t.arc(u,a,h.st*i+r/2,0,2*Math.PI,!1),t.stroke(),t.restore();}},t}(),$t=[{xh:0,Ch:.25,Sh:4,Th:10,Dh:.25,Ah:0,Bh:.4,Lh:.8},{xh:.25,Ch:.525,Sh:10,Th:14,Dh:0,Ah:0,Bh:.8,Lh:0},{xh:.525,Ch:1,Sh:14,Th:14,Dh:0,Ah:0,Bh:0,Lh:0}];function Kt(t,i,n,s){return function(t,i){if("transparent"===t)return t;var n=w(t),s=n[3];return "rgba(".concat(n[0],", ").concat(n[1],", ").concat(n[2],", ").concat(i*s,")")}(t,n+(s-n)*i)}function Xt(t,i){for(var n,s=t%2600/2600,h=0,e=$t;h<e.length;h++){var u=e[h];if(s>=u.xh&&s<=u.Ch){n=u;break}}r(void 0!==n,"Last price animation internal logic error");var a,o,l,f=(s-n.xh)/(n.Ch-n.xh);return {kh:Kt(i,f,n.Dh,n.Ah),Nh:Kt(i,f,n.Bh,n.Lh),st:(a=f,o=n.Sh,l=n.Th,o+(l-o)*a)}}var Zt=function(){function t(t){this.zt=new Yt,this.ft=!0,this.Eh=!0,this.Fh=performance.now(),this.Oh=this.Fh-1,this.Vh=t;}return t.prototype.Ph=function(){this.Oh=this.Fh-1,this.vt();},t.prototype.Wh=function(){if(this.vt(),2===this.Vh.W().lastPriceAnimation){var t=performance.now(),i=this.Oh-t;if(i>0)return void(i<650&&(this.Oh+=2600));this.Fh=t,this.Oh=t+2600;}},t.prototype.vt=function(){this.ft=!0;},t.prototype.zh=function(){this.Eh=!0;},t.prototype.yt=function(){return 0!==this.Vh.W().lastPriceAnimation},t.prototype.Rh=function(){switch(this.Vh.W().lastPriceAnimation){case 0:return !1;case 1:return !0;case 2:return performance.now()<=this.Oh}},t.prototype.dt=function(t,i){return this.ft?(this.wt(t,i),this.ft=!1,this.Eh=!1):this.Eh&&(this.Ih(),this.Eh=!1),this.zt},t.prototype.wt=function(t,i){this.zt.Z(null);var n=this.Vh.jt().bt(),s=n.ss(),h=this.Vh.kt();if(null!==s&&null!==h){var r=this.Vh.jh(!0);if(!r.qh&&s.Uh(r.vs)){var e={x:n.At(r.vs),y:this.Vh.Ct().xt(r.et,h.St)},u=r.A,a=this.Vh.W().lineWidth,o=Xt(this.Hh(),u);this.zt.Z({gh:u,yh:a,kh:o.kh,Nh:o.Nh,st:o.st,Zs:e});}}},t.prototype.Ih=function(){var t=this.zt.ph();if(null!==t){var i=Xt(this.Hh(),t.gh);t.kh=i.kh,t.Nh=i.Nh,t.st=i.st;}},t.prototype.Hh=function(){return this.Rh()?performance.now()-this.Fh:2599},t}();function Jt(t,i){return Tt(Math.min(Math.max(t,12),30)*i)}function Gt(t,i){switch(t){case"arrowDown":case"arrowUp":return Jt(i,1);case"circle":return Jt(i,.8);case"square":return Jt(i,.7)}}function Qt(t){return St(Jt(t,1))}function ti(t){return Math.max(Jt(t,.1),3)}function ii(t,i,n,s,h){var r=Gt("square",n),e=(r-1)/2,u=t-e,a=i-e;return s>=u&&s<=u+r&&h>=a&&h<=a+r}function ni(t,i,n,s,h){var r=(Gt("arrowUp",h)-1)/2,e=(Tt(h/2)-1)/2;i.beginPath(),t?(i.moveTo(n-r,s),i.lineTo(n,s-r),i.lineTo(n+r,s),i.lineTo(n+e,s),i.lineTo(n+e,s+r),i.lineTo(n-e,s+r),i.lineTo(n-e,s)):(i.moveTo(n-r,s),i.lineTo(n,s+r),i.lineTo(n+r,s),i.lineTo(n+e,s),i.lineTo(n+e,s-r),i.lineTo(n-e,s-r),i.lineTo(n-e,s)),i.fill();}function si(t,i,n,s,h,r){return ii(i,n,s,h,r)}var hi=function(t){function i(){var i=null!==t&&t.apply(this,arguments)||this;return i.Bt=null,i.rh=new Rt,i.R=-1,i.I="",i.Yh="",i}return m(i,t),i.prototype.Z=function(t){this.Bt=t;},i.prototype.eh=function(t,i){this.R===t&&this.I===i||(this.R=t,this.I=i,this.Yh=L(t,i),this.rh.ih());},i.prototype.$h=function(t,i){if(null===this.Bt||null===this.Bt.J)return null;for(var n=this.Bt.J.from;n<this.Bt.J.to;n++){var s=this.Bt.G[n];if(ei(s,t,i))return {Kh:s.Xh,Zh:s.Zh}}return null},i.prototype.Y=function(t,i,n){if(null!==this.Bt&&null!==this.Bt.J){t.textBaseline="middle",t.font=this.Yh;for(var s=this.Bt.J.from;s<this.Bt.J.to;s++){var h=this.Bt.G[s];void 0!==h.Gt&&(h.Gt.Ht=this.rh.Qt(t,h.Gt.Jh),h.Gt.Yt=this.R),ri(h,t);}}},i}(O);function ri(t,i){i.fillStyle=t.A,void 0!==t.Gt&&function(t,i,n,s){t.fillText(i,n,s);}(i,t.Gt.Jh,t.tt-t.Gt.Ht/2,t.Gt.it),function(t,i){if(0===t.hs)return;switch(t.Gh){case"arrowDown":return void ni(!1,i,t.tt,t.it,t.hs);case"arrowUp":return void ni(!0,i,t.tt,t.it,t.hs);case"circle":return void function(t,i,n,s){var h=(Gt("circle",s)-1)/2;t.beginPath(),t.arc(i,n,h,0,2*Math.PI,!1),t.fill();}(i,t.tt,t.it,t.hs);case"square":return void function(t,i,n,s){var h=Gt("square",s),r=(h-1)/2,e=i-r,u=n-r;t.fillRect(e,u,h,h);}(i,t.tt,t.it,t.hs)}t.Gh;}(t,i);}function ei(t,i,n){return !(void 0===t.Gt||!function(t,i,n,s,h,r){var e=s/2;return h>=t&&h<=t+n&&r>=i-e&&r<=i+e}(t.tt,t.Gt.it,t.Gt.Ht,t.Gt.Yt,i,n))||function(t,i,n){if(0===t.hs)return !1;switch(t.Gh){case"arrowDown":case"arrowUp":return si(0,t.tt,t.it,t.hs,i,n);case"circle":return function(t,i,n,s,h){var r=2+Gt("circle",n)/2,e=t-s,u=i-h;return Math.sqrt(e*e+u*u)<=r}(t.tt,t.it,t.hs,i,n);case"square":return ii(t.tt,t.it,t.hs,i,n)}}(t,i,n)}function ui(t,i,n,s,h,r,e,u,a){var o=N(n)?n:n.close,l=N(n)?n:n.high,f=N(n)?n:n.low,c=N(i.size)?Math.max(i.size,0):1,v=Qt(u.ws())*c,_=v/2;switch(t.hs=v,i.position){case"inBar":return t.it=e.xt(o,a),void(void 0!==t.Gt&&(t.Gt.it=t.it+_+r+.6*h));case"aboveBar":return t.it=e.xt(l,a)-_-s.Qh,void 0!==t.Gt&&(t.Gt.it=t.it-_-.6*h,s.Qh+=1.2*h),void(s.Qh+=v+r);case"belowBar":return t.it=e.xt(f,a)+_+s.tr,void 0!==t.Gt&&(t.Gt.it=t.it+_+r+.6*h,s.tr+=1.2*h),void(s.tr+=v+r)}i.position;}var ai=function(){function t(t,i){this.ft=!0,this.ir=!0,this.nr=!0,this.sr=null,this.zt=new hi,this.Vh=t,this.pi=i,this.Bt={G:[],J:null};}return t.prototype.vt=function(t){this.ft=!0,this.nr=!0,"data"===t&&(this.ir=!0);},t.prototype.dt=function(t,i,n){if(!this.Vh.yt())return null;this.ft&&this.Jn();var s=this.pi.W().layout;return this.zt.eh(s.fontSize,s.fontFamily),this.zt.Z(this.Bt),this.zt},t.prototype.hr=function(){if(this.nr){if(this.Vh.rr().length>0){var t=this.pi.bt().ws(),i=ti(t),n=1.5*Qt(t)+2*i;this.sr={above:n,below:n};}else this.sr=null;this.nr=!1;}return this.sr},t.prototype.Jn=function(){var t=this.Vh.Ct(),i=this.pi.bt(),n=this.Vh.rr();this.ir&&(this.Bt.G=n.map((function(t){return {rt:t.time,tt:0,it:0,hs:0,Gh:t.shape,A:t.color,Xh:t.Xh,Zh:t.id,Gt:void 0}})),this.ir=!1);var s=this.pi.W().layout;this.Bt.J=null;var h=i.ss();if(null!==h){var r=this.Vh.kt();if(null!==r&&0!==this.Bt.G.length){var e=NaN,u=ti(i.ws()),a={Qh:u,tr:u};this.Bt.J=Mt(this.Bt.G,h,!0);for(var o=this.Bt.J.from;o<this.Bt.J.to;o++){var l=n[o];l.time!==e&&(a.Qh=u,a.tr=u,e=l.time);var f=this.Bt.G[o];f.tt=i.At(l.time),void 0!==l.text&&l.text.length>0&&(f.Gt={Jh:l.text,it:0,Ht:0,Yt:0});var c=this.Vh.er(l.time);null!==c&&ui(f,l,c,a,s.fontSize,u,t,i,r.St);}this.ft=!1;}}},t}(),oi=function(t){function i(i){return t.call(this,i)||this}return m(i,t),i.prototype.bh=function(t,i){var n=this.wh;n.yt=!1;var s=this.Kn.W();if(s.priceLineVisible&&this.Kn.yt()){var h=this.Kn.jh(0===s.priceLineSource);h.qh||(n.yt=!0,n.it=h.ti,n.A=this.Kn.ur(h.A),n.Ht=i,n.Yt=t,n.Vt=s.priceLineWidth,n.Pt=s.priceLineStyle);}},i}(Ut),li=function(t){function i(i){var n=t.call(this)||this;return n.Rt=i,n}return m(i,t),i.prototype.vi=function(t,i,n){t.yt=!1,i.yt=!1;var s=this.Rt;if(s.yt()){var h=s.W(),r=h.lastValueVisible,e=""!==s.ar(),u=0===h.seriesLastValueMode,a=s.jh(!1);if(!a.qh){r&&(t.Gt=this.lr(a,r,u),t.yt=0!==t.Gt.length),(e||u)&&(i.Gt=this.cr(a,r,e,u),i.yt=i.Gt.length>0);var o=s.ur(a.A),l=M(o);n.t=l.t,n.A=l.i,n.ti=a.ti,i.Tt=s.jt().Dt(a.ti/s.Ct().Yt()),t.Tt=o;}}},i.prototype.cr=function(t,i,n,s){var h="",r=this.Rt.ar();return n&&0!==r.length&&(h+="".concat(r," ")),i&&s&&(h+=this.Rt.Ct().vr()?t._r:t.dr),h.trim()},i.prototype.lr=function(t,i,n){return i?n?this.Rt.Ct().vr()?t.dr:t._r:t.Gt:""},i}(K),fi=function(){function t(t,i){this.wr=t,this.Mr=i;}return t.prototype.br=function(t){return null!==t&&(this.wr===t.wr&&this.Mr===t.Mr)},t.prototype.mr=function(){return new t(this.wr,this.Mr)},t.prototype.pr=function(){return this.wr},t.prototype.gr=function(){return this.Mr},t.prototype.yr=function(){return this.Mr-this.wr},t.prototype.wi=function(){return this.Mr===this.wr||Number.isNaN(this.Mr)||Number.isNaN(this.wr)},t.prototype.Nn=function(i){return null===i?this:new t(Math.min(this.pr(),i.pr()),Math.max(this.gr(),i.gr()))},t.prototype.kr=function(t){if(N(t)&&0!==this.Mr-this.wr){var i=.5*(this.Mr+this.wr),n=this.Mr-i,s=this.wr-i;n*=t,s*=t,this.Mr=i+n,this.wr=i+s;}},t.prototype.Nr=function(t){N(t)&&(this.Mr+=t,this.wr+=t);},t.prototype.Cr=function(){return {minValue:this.wr,maxValue:this.Mr}},t.Sr=function(i){return null===i?null:new t(i.minValue,i.maxValue)},t}(),ci=function(){function t(t,i){this.Tr=t,this.Dr=i||null;}return t.prototype.Ar=function(){return this.Tr},t.prototype.Br=function(){return this.Dr},t.prototype.Cr=function(){return null===this.Tr?null:{priceRange:this.Tr.Cr(),margins:this.Dr||void 0}},t.Sr=function(i){return null===i?null:new t(fi.Sr(i.priceRange),i.margins)},t}(),vi=function(t){function i(i,n){var s=t.call(this,i)||this;return s.Lr=n,s}return m(i,t),i.prototype.bh=function(t,i){var n=this.wh;n.yt=!1;var s=this.Lr.W();if(this.Kn.yt()&&s.lineVisible){var h=this.Lr.Er();null!==h&&(n.yt=!0,n.it=h,n.A=s.color,n.Ht=i,n.Yt=t,n.Vt=s.lineWidth,n.Pt=s.lineStyle);}},i}(Ut),_i=function(t){function i(i,n){var s=t.call(this)||this;return s.Vh=i,s.Lr=n,s}return m(i,t),i.prototype.vi=function(t,i,n){t.yt=!1,i.yt=!1;var s=this.Lr.W(),h=s.axisLabelVisible,r=""!==s.title,e=this.Vh;if(h&&e.yt()){var u=this.Lr.Er();if(null!==u){r&&(i.Gt=s.title,i.yt=!0),i.Tt=e.jt().Dt(u/e.Ct().Yt()),t.Gt=e.Ct().Fr(s.price),t.yt=!0;var a=M(s.color);n.t=a.t,n.A=a.i,n.ti=u;}}},i}(K),di=function(){function t(t,i){this.Vh=t,this.zi=i,this.Or=new vi(t,this),this.uh=new _i(t,this),this.Vr=new jt(this.uh,t,t.jt());}return t.prototype.Pr=function(t){k(this.zi,t),this.vt(),this.Vh.jt().Wr();},t.prototype.W=function(){return this.zi},t.prototype.tn=function(){return [this.Or,this.Vr]},t.prototype.zr=function(){return this.uh},t.prototype.vt=function(){this.Or.vt(),this.uh.vt();},t.prototype.Er=function(){var t=this.Vh,i=t.Ct();if(t.jt().bt().wi()||i.wi())return null;var n=t.kt();return null===n?null:i.xt(this.zi.price,n.St)},t}(),wi=function(t){function i(i){var n=t.call(this)||this;return n.pi=i,n}return m(i,t),i.prototype.jt=function(){return this.pi},i}(Q),Mi={Ds:"",Hs:"",Us:""},bi=function(){function t(t){this.Vh=t;}return t.prototype.As=function(t,i){var n=this.Vh.Rr(),s=this.Vh.W();switch(n){case"Line":return this.Ir(s,t,i);case"Area":return this.jr(s);case"Baseline":return this.qr(s,t,i);case"Bar":return this.Ur(s,t,i);case"Candlestick":return this.Hr(s,t,i);case"Histogram":return this.Yr(s,t,i)}throw new Error("Unknown chart style")},t.prototype.Ur=function(t,i,n){var s=p({},Mi),h=t.upColor,r=t.downColor,e=h,o=r,l=u(this.$r(i,n)),f=a(l.St[0])<=a(l.St[3]);return void 0!==l.A?(s.Ds=l.A,s.Hs=l.A):(s.Ds=f?h:r,s.Hs=f?e:o),s},t.prototype.Hr=function(t,i,n){var s,h,r,e=p({},Mi),o=t.upColor,l=t.downColor,f=t.borderUpColor,c=t.borderDownColor,v=t.wickUpColor,_=t.wickDownColor,d=u(this.$r(i,n)),w=a(d.St[0])<=a(d.St[3]);return e.Ds=null!==(s=d.A)&&void 0!==s?s:w?o:l,e.Hs=null!==(h=d.Tt)&&void 0!==h?h:w?f:c,e.Us=null!==(r=d.qs)&&void 0!==r?r:w?v:_,e},t.prototype.jr=function(t){return p(p({},Mi),{Ds:t.lineColor})},t.prototype.qr=function(t,i,n){var s=u(this.$r(i,n)).St[3]>=t.baseValue.price;return p(p({},Mi),{Ds:s?t.topLineColor:t.bottomLineColor})},t.prototype.Ir=function(t,i,n){var s,h=u(this.$r(i,n));return p(p({},Mi),{Ds:null!==(s=h.A)&&void 0!==s?s:t.color})},t.prototype.Yr=function(t,i,n){var s=p({},Mi),h=u(this.$r(i,n));return s.Ds=void 0!==h.A?h.A:t.color,s},t.prototype.$r=function(t,i){return void 0!==i?i.St:this.Vh.an().Kr(t)},t}(),mi=function(){function t(){this.Xr=[],this.Zr=new Map,this.Jr=new Map;}return t.prototype.Gr=function(){return this.hs()>0?this.Xr[this.Xr.length-1]:null},t.prototype.Qr=function(){return this.hs()>0?this.te(0):null},t.prototype.un=function(){return this.hs()>0?this.te(this.Xr.length-1):null},t.prototype.hs=function(){return this.Xr.length},t.prototype.wi=function(){return 0===this.hs()},t.prototype.Uh=function(t){return null!==this.ie(t,0)},t.prototype.Kr=function(t){return this.ne(t)},t.prototype.ne=function(t,i){void 0===i&&(i=0);var n=this.ie(t,i);return null===n?null:p(p({},this.se(n)),{vs:this.te(n)})},t.prototype.fs=function(){return this.Xr},t.prototype.he=function(t,i,n){if(this.wi())return null;for(var s=null,h=0,r=n;h<r.length;h++){var e=r[h];s=pi(s,this.re(t,i,e));}return s},t.prototype.Z=function(t){this.Jr.clear(),this.Zr.clear(),this.Xr=t;},t.prototype.te=function(t){return this.Xr[t].vs},t.prototype.se=function(t){return this.Xr[t]},t.prototype.ie=function(t,i){var n=this.ee(t);if(null===n&&0!==i)switch(i){case-1:return this.ue(t);case 1:return this.ae(t);default:throw new TypeError("Unknown search mode")}return n},t.prototype.ue=function(t){var i=this.oe(t);return i>0&&(i-=1),i!==this.Xr.length&&this.te(i)<t?i:null},t.prototype.ae=function(t){var i=this.le(t);return i!==this.Xr.length&&t<this.te(i)?i:null},t.prototype.ee=function(t){var i=this.oe(t);return i===this.Xr.length||t<this.Xr[i].vs?null:i},t.prototype.oe=function(t){return vt(this.Xr,t,(function(t,i){return t.vs<i}))},t.prototype.le=function(t){return _t(this.Xr,t,(function(t,i){return i.vs>t}))},t.prototype.fe=function(t,i,n){for(var s=null,h=t;h<i;h++){var r=this.Xr[h].St[n];Number.isNaN(r)||(null===s?s={ce:r,ve:r}:(r<s.ce&&(s.ce=r),r>s.ve&&(s.ve=r)));}return s},t.prototype.re=function(t,i,n){if(this.wi())return null;var s=null,h=u(this.Qr()),r=u(this.un()),e=Math.max(t,h),a=Math.min(i,r),o=30*Math.ceil(e/30),l=Math.max(o,30*Math.floor(a/30)),f=this.oe(e),c=this.le(Math.min(a,o,i));s=pi(s,this.fe(f,c,n));var v=this.Zr.get(n);void 0===v&&(v=new Map,this.Zr.set(n,v));for(var _=Math.max(o+1,e);_<l;_+=30){var d=Math.floor(_/30),w=v.get(d);if(void 0===w){var M=this.oe(30*d),b=this.le(30*(d+1)-1);w=this.fe(M,b,n),v.set(d,w);}s=pi(s,w);}f=this.oe(l),c=this.le(a);return s=pi(s,this.fe(f,c,n))},t}();function pi(t,i){return null===t?i:null===i?t:{ce:Math.min(t.ce,i.ce),ve:Math.max(t.ve,i.ve)}}var gi=function(t){function i(i,n,s){var h=t.call(this,i)||this;h.Bt=new mi,h.Or=new oi(h),h._e=[],h.de=new Ht(h),h.we=null,h.Me=null,h.be=[],h.me=[],h.pe=null,h.zi=n,h.ge=s;var r=new li(h);return h.Ei=[r],h.Vr=new jt(r,h,i),"Area"!==s&&"Line"!==s&&"Baseline"!==s||(h.we=new Zt(h)),h.ye(),h.ke(),h}return m(i,t),i.prototype.g=function(){null!==this.pe&&clearTimeout(this.pe);},i.prototype.ur=function(t){return this.zi.priceLineColor||t},i.prototype.jh=function(t){var i={qh:!0},n=this.Ct();if(this.jt().bt().wi()||n.wi()||this.Bt.wi())return i;var s,h,r=this.jt().bt().ss(),e=this.kt();if(null===r||null===e)return i;if(t){var u=this.Bt.Gr();if(null===u)return i;s=u,h=u.vs;}else {var a=this.Bt.ne(r.jn(),-1);if(null===a)return i;if(null===(s=this.Bt.Kr(a.vs)))return i;h=a.vs;}var o=s.St[3],l=this.ls().As(h,{St:s}),f=n.xt(o,e.St);return {qh:!1,et:o,Gt:n.Mi(o,e.St),_r:n.Fr(o),dr:n.Ne(o,e.St),A:l.Ds,ti:f,vs:h}},i.prototype.ls=function(){return null!==this.Me||(this.Me=new bi(this)),this.Me},i.prototype.W=function(){return this.zi},i.prototype.Pr=function(t){var i=t.priceScaleId;void 0!==i&&i!==this.zi.priceScaleId&&this.jt().xe(this,i),k(this.zi,t),null!==this.ki&&void 0!==t.scaleMargins&&this.ki.Pr({scaleMargins:t.scaleMargins}),void 0!==t.priceFormat&&(this.ye(),this.jt().Ce()),this.jt().Se(this),this.jt().Te(),this.Hi.vt("options");},i.prototype.Z=function(t,i){this.Bt.Z(t),this.De(),this.Hi.vt("data"),this.Ri.vt("data"),null!==this.we&&(i&&i.Ae?this.we.Wh():0===t.length&&this.we.Ph());var n=this.jt().oh(this);this.jt().Be(n),this.jt().Se(this),this.jt().Te(),this.jt().Wr();},i.prototype.Le=function(t){this.be=t.map((function(t){return p({},t)})),this.De();var i=this.jt().oh(this);this.Ri.vt("data"),this.jt().Be(i),this.jt().Se(this),this.jt().Te(),this.jt().Wr();},i.prototype.rr=function(){return this.me},i.prototype.Ee=function(t){var i=new di(this,t);return this._e.push(i),this.jt().Se(this),i},i.prototype.Fe=function(t){var i=this._e.indexOf(t);-1!==i&&this._e.splice(i,1),this.jt().Se(this);},i.prototype.Rr=function(){return this.ge},i.prototype.kt=function(){var t=this.Oe();return null===t?null:{St:t.St[3],Ve:t.rt}},i.prototype.Oe=function(){var t=this.jt().bt().ss();if(null===t)return null;var i=t.In();return this.Bt.ne(i,1)},i.prototype.an=function(){return this.Bt},i.prototype.er=function(t){var i=this.Bt.Kr(t);return null===i?null:"Bar"===this.ge||"Candlestick"===this.ge?{open:i.St[0],high:i.St[1],low:i.St[2],close:i.St[3]}:i.St[3]},i.prototype.Pe=function(t){var i=this,n=this.we;return null!==n&&n.yt()?(null===this.pe&&n.Rh()&&(this.pe=setTimeout((function(){i.pe=null,i.jt().We();}),0)),n.zh(),[n]):[]},i.prototype.tn=function(){var t=[];this.ze()||t.push(this.de);for(var i=0,n=this._e;i<n.length;i++){var s=n[i];t.push.apply(t,s.tn());}return t.push(this.Hi,this.Or,this.Vr,this.Ri),t},i.prototype.nn=function(t,i){if(i!==this.ki&&!this.ze())return [];for(var n=g([],this.Ei,!0),s=0,h=this._e;s<h.length;s++){var r=h[s];n.push(r.zr());}return n},i.prototype.Re=function(t,i){var n=this;if(void 0!==this.zi.autoscaleInfoProvider){var s=this.zi.autoscaleInfoProvider((function(){var s=n.Ie(t,i);return null===s?null:s.Cr()}));return ci.Sr(s)}return this.Ie(t,i)},i.prototype.je=function(){return this.zi.priceFormat.minMove},i.prototype.qe=function(){return this.Ue},i.prototype.hn=function(){var t;this.Hi.vt(),this.Ri.vt();for(var i=0,n=this.Ei;i<n.length;i++){n[i].vt();}for(var s=0,h=this._e;s<h.length;s++){h[s].vt();}this.Or.vt(),this.de.vt(),null===(t=this.we)||void 0===t||t.vt();},i.prototype.Ct=function(){return u(t.prototype.Ct.call(this))},i.prototype.gt=function(t){if(!(("Line"===this.ge||"Area"===this.ge||"Baseline"===this.ge)&&this.zi.crosshairMarkerVisible))return null;var i=this.Bt.Kr(t);return null===i?null:{et:i.St[3],st:this.He(),Tt:this.Ye(),Nt:this.$e(t)}},i.prototype.ar=function(){return this.zi.title},i.prototype.yt=function(){return this.zi.visible},i.prototype.ze=function(){return !it(this.Ct().Ke())},i.prototype.Ie=function(t,i){if(!x(t)||!x(i)||this.Bt.wi())return null;var n="Line"===this.ge||"Area"===this.ge||"Baseline"===this.ge||"Histogram"===this.ge?[3]:[2,1],s=this.Bt.he(t,i,n),h=null!==s?new fi(s.ce,s.ve):null;if("Histogram"===this.Rr()){var r=this.zi.base,e=new fi(r,r);h=null!==h?h.Nn(e):e;}return new ci(h,this.Ri.hr())},i.prototype.He=function(){switch(this.ge){case"Line":case"Area":case"Baseline":return this.zi.crosshairMarkerRadius}return 0},i.prototype.Ye=function(){switch(this.ge){case"Line":case"Area":case"Baseline":var t=this.zi.crosshairMarkerBorderColor;if(0!==t.length)return t}return null},i.prototype.$e=function(t){switch(this.ge){case"Line":case"Area":case"Baseline":var i=this.zi.crosshairMarkerBackgroundColor;if(0!==i.length)return i}return this.ls().As(t).Ds},i.prototype.ye=function(){switch(this.zi.priceFormat.type){case"custom":this.Ue={format:this.zi.priceFormat.formatter};break;case"volume":this.Ue=new ut(this.zi.priceFormat.precision);break;case"percent":this.Ue=new et(this.zi.priceFormat.precision);break;default:var t=Math.pow(10,this.zi.priceFormat.precision);this.Ue=new rt(t,this.zi.priceFormat.minMove*t);}null!==this.ki&&this.ki.Xe();},i.prototype.De=function(){var t=this,i=this.jt().bt();if(i.wi()||0===this.Bt.hs())this.me=[];else {var n=u(this.Bt.Qr());this.me=this.be.map((function(s,h){var r=u(i.Ze(s.time,!0)),e=r<n?1:-1;return {time:u(t.Bt.ne(r,e)).vs,position:s.position,shape:s.shape,color:s.color,id:s.id,Xh:h,text:s.text,size:s.size}}));}},i.prototype.ke=function(){switch(this.Ri=new ai(this,this.jt()),this.ge){case"Bar":this.Hi=new kt(this,this.jt());break;case"Candlestick":this.Hi=new Et(this,this.jt());break;case"Line":this.Hi=new Wt(this,this.jt());break;case"Area":this.Hi=new pt(this,this.jt());break;case"Baseline":this.Hi=new Bt(this,this.jt());break;case"Histogram":this.Hi=new Pt(this,this.jt());break;default:throw Error("Unknown chart style assigned: "+this.ge)}},i}(wi),yi=function(){function t(t){this.zi=t;}return t.prototype.Je=function(t,i,n){var s=t;if(0===this.zi.mode)return s;var h=n.ji(),r=h.kt();if(null===r)return s;var e=h.xt(t,r),u=n.Ge().filter((function(t){return t instanceof gi})).reduce((function(t,s){if(n.lh(s)||!s.yt())return t;var h=s.Ct(),r=s.an();if(h.wi()||!r.Uh(i))return t;var e=r.Kr(i);if(null===e)return t;var u=a(s.kt());return t.concat([h.xt(e.St[3],u.St)])}),[]);if(0===u.length)return s;u.sort((function(t,i){return Math.abs(t-e)-Math.abs(i-e)}));var o=u[0];return s=h.qi(o,r)},t}(),ki=function(){function t(){this.Bt=null;}return t.prototype.Z=function(t){this.Bt=t;},t.prototype.H=function(t,i,n,h){var r=this;if(null!==this.Bt){var e=Math.max(1,Math.floor(i));t.lineWidth=e;var a=Math.ceil(this.Bt.Ot*i),o=Math.ceil(this.Bt.Ft*i);!function(t,i){t.save(),t.lineWidth%2&&t.translate(.5,.5),i(),t.restore();}(t,(function(){var n=u(r.Bt);if(n.Qe){t.strokeStyle=n.tu,s(t,n.iu),t.beginPath();for(var h=0,l=n.nu;h<l.length;h++){var f=l[h],c=Math.round(f.su*i);t.moveTo(c,-e),t.lineTo(c,a+e);}t.stroke();}if(n.hu){t.strokeStyle=n.ru,s(t,n.eu),t.beginPath();for(var v=0,_=n.uu;v<_.length;v++){var d=_[v],w=Math.round(d.su*i);t.moveTo(-e,w),t.lineTo(o+e,w);}t.stroke();}}));}},t}(),Ni=function(){function t(t){this.zt=new ki,this.ft=!0,this.Di=t;}return t.prototype.vt=function(){this.ft=!0;},t.prototype.dt=function(t,i){if(this.ft){var n=this.Di.jt().W().grid,s={Ot:t,Ft:i,hu:n.horzLines.visible,Qe:n.vertLines.visible,ru:n.horzLines.color,tu:n.vertLines.color,eu:n.horzLines.style,iu:n.vertLines.style,uu:this.Di.ji().au(),nu:this.Di.jt().bt().au()||[]};this.zt.Z(s),this.ft=!1;}return this.zt},t}(),xi=function(){function t(t){this.Hi=new Ni(t);}return t.prototype.ou=function(){return this.Hi},t}(),Ci={lu:4,fu:1e-4};function Si(t,i){var n=100*(t-i)/i;return i<0?-n:n}function Ti(t,i){var n=Si(t.pr(),i),s=Si(t.gr(),i);return new fi(n,s)}function Di(t,i){var n=100*(t-i)/i+100;return i<0?-n:n}function Ai(t,i){var n=Di(t.pr(),i),s=Di(t.gr(),i);return new fi(n,s)}function Bi(t,i){var n=Math.abs(t);if(n<1e-15)return 0;var s=Ct(n+i.fu)+i.lu;return t<0?-s:s}function Li(t,i){var n=Math.abs(t);if(n<1e-15)return 0;var s=Math.pow(10,n-i.lu)-i.fu;return t<0?-s:s}function Ei(t,i){if(null===t)return null;var n=Bi(t.pr(),i),s=Bi(t.gr(),i);return new fi(n,s)}function Fi(t,i){if(null===t)return null;var n=Li(t.pr(),i),s=Li(t.gr(),i);return new fi(n,s)}function Oi(t){if(null===t)return Ci;var i=Math.abs(t.gr()-t.pr());if(i>=1||i<1e-15)return Ci;var n=Math.ceil(Math.abs(Math.log10(i))),s=Ci.lu+n;return {lu:s,fu:1/Math.pow(10,s)}}var Vi,Pi=function(){function t(t,i){if(this.cu=t,this.vu=i,function(t){if(t<0)return !1;for(var i=t;i>1;i/=10)if(i%10!=0)return !1;return !0}(this.cu))this._u=[2,2.5,2];else {this._u=[];for(var n=this.cu;1!==n;){if(n%2==0)this._u.push(2),n/=2;else {if(n%5!=0)throw new Error("unexpected base");this._u.push(2,2.5),n/=5;}if(this._u.length>100)throw new Error("something wrong with base")}}}return t.prototype.du=function(t,i,n){for(var s,h,r,e=0===this.cu?0:1/this.cu,u=Math.pow(10,Math.max(0,Math.ceil(Ct(t-i)))),a=0,o=this.vu[0];;){var l=xt(u,e,1e-14)&&u>e+1e-14,f=xt(u,n*o,1e-14),c=xt(u,1,1e-14);if(!(l&&f&&c))break;u/=o,o=this.vu[++a%this.vu.length];}if(u<=e+1e-14&&(u=e),u=Math.max(1,u),this._u.length>0&&(s=u,h=1,r=1e-14,Math.abs(s-h)<r))for(a=0,o=this._u[0];xt(u,n*o,1e-14)&&u>e+1e-14;)u/=o,o=this._u[++a%this._u.length];return u},t}(),Wi=function(){function t(t,i,n,s){this.wu=[],this._i=t,this.cu=i,this.Mu=n,this.bu=s;}return t.prototype.du=function(t,i){if(t<i)throw new Error("high < low");var n=this._i.Yt(),s=(t-i)*this.mu()/n,h=new Pi(this.cu,[2,2.5,2]),r=new Pi(this.cu,[2,2,2.5]),e=new Pi(this.cu,[2.5,2,2]),u=[];return u.push(h.du(t,i,s),r.du(t,i,s),e.du(t,i,s)),function(t){if(t.length<1)throw Error("array is empty");for(var i=t[0],n=1;n<t.length;++n)t[n]<i&&(i=t[n]);return i}(u)},t.prototype.pu=function(){var t=this._i,i=t.kt();if(null!==i){var n=t.Yt(),s=this.Mu(n-1,i),h=this.Mu(0,i),r=this._i.W().entireTextOnly?this.gu()/2:0,e=r,u=n-1-r,a=Math.max(s,h),o=Math.min(s,h);if(a!==o){for(var l=this.du(a,o),f=a%l,c=a>=o?1:-1,v=null,_=0,d=a-(f+=f<0?l:0);d>o;d-=l){var w=this.bu(d,i,!0);null!==v&&Math.abs(w-v)<this.mu()||(w<e||w>u||(_<this.wu.length?(this.wu[_].su=w,this.wu[_].yu=t.ku(d)):this.wu.push({su:w,yu:t.ku(d)}),_++,v=w,t.Nu()&&(l=this.du(d*c,o))));}this.wu.length=_;}else this.wu=[];}else this.wu=[];},t.prototype.au=function(){return this.wu},t.prototype.gu=function(){return this._i.S()},t.prototype.mu=function(){return Math.ceil(2.5*this.gu())},t}();function zi(t){return t.slice().sort((function(t,i){return u(t.xi())-u(i.xi())}))}!function(t){t[t.Normal=0]="Normal",t[t.Logarithmic=1]="Logarithmic",t[t.Percentage=2]="Percentage",t[t.IndexedTo100=3]="IndexedTo100";}(Vi||(Vi={}));var Ri=new et,Ii=new rt(100,1),ji=function(){function t(t,i,n,s){this.xu=0,this.Cu=null,this.Tr=null,this.Su=null,this.Tu={Du:!1,Au:null},this.Bu=0,this.Lu=0,this.Eu=new y,this.Fu=new y,this.Ou=[],this.Vu=null,this.Pu=null,this.Wu=null,this.zu=null,this.Ue=Ii,this.Ru=Oi(null),this.Iu=t,this.zi=i,this.ju=n,this.qu=s,this.Uu=new Wi(this,100,this.Hu.bind(this),this.Yu.bind(this));}return t.prototype.Ke=function(){return this.Iu},t.prototype.W=function(){return this.zi},t.prototype.Pr=function(t){if(k(this.zi,t),this.Xe(),void 0!==t.mode&&this.$u({mh:t.mode}),void 0!==t.scaleMargins){var i=e(t.scaleMargins.top),n=e(t.scaleMargins.bottom);if(i<0||i>1)throw new Error("Invalid top margin - expect value between 0 and 1, given=".concat(i));if(n<0||n>1||i+n>1)throw new Error("Invalid bottom margin - expect value between 0 and 1, given=".concat(n));if(i+n>1)throw new Error("Invalid margins - sum of margins must be less than 1, given=".concat(i+n));this.Ku(),this.Pu=null;}},t.prototype.Xu=function(){return this.zi.autoScale},t.prototype.Nu=function(){return 1===this.zi.mode},t.prototype.vr=function(){return 2===this.zi.mode},t.prototype.Zu=function(){return 3===this.zi.mode},t.prototype.mh=function(){return {_n:this.zi.autoScale,Ju:this.zi.invertScale,mh:this.zi.mode}},t.prototype.$u=function(t){var i=this.mh(),n=null;void 0!==t._n&&(this.zi.autoScale=t._n),void 0!==t.mh&&(this.zi.mode=t.mh,2!==t.mh&&3!==t.mh||(this.zi.autoScale=!0),this.Tu.Du=!1),1===i.mh&&t.mh!==i.mh&&(!function(t,i){if(null===t)return !1;var n=Li(t.pr(),i),s=Li(t.gr(),i);return isFinite(n)&&isFinite(s)}(this.Tr,this.Ru)?this.zi.autoScale=!0:null!==(n=Fi(this.Tr,this.Ru))&&this.Gu(n)),1===t.mh&&t.mh!==i.mh&&null!==(n=Ei(this.Tr,this.Ru))&&this.Gu(n);var s=i.mh!==this.zi.mode;s&&(2===i.mh||this.vr())&&this.Xe(),s&&(3===i.mh||this.Zu())&&this.Xe(),void 0!==t.Ju&&i.Ju!==t.Ju&&(this.zi.invertScale=t.Ju,this.Qu()),this.Fu.m(i,this.mh());},t.prototype.ta=function(){return this.Fu},t.prototype.S=function(){return this.ju.fontSize},t.prototype.Yt=function(){return this.xu},t.prototype.ia=function(t){this.xu!==t&&(this.xu=t,this.Ku(),this.Pu=null);},t.prototype.na=function(){if(this.Cu)return this.Cu;var t=this.Yt()-this.sa()-this.ha();return this.Cu=t,t},t.prototype.Ar=function(){return this.ra(),this.Tr},t.prototype.Gu=function(t,i){var n=this.Tr;(i||null===n&&null!==t||null!==n&&!n.br(t))&&(this.Pu=null,this.Tr=t);},t.prototype.wi=function(){return this.ra(),0===this.xu||!this.Tr||this.Tr.wi()},t.prototype.ea=function(t){return this.Ju()?t:this.Yt()-1-t},t.prototype.xt=function(t,i){return this.vr()?t=Si(t,i):this.Zu()&&(t=Di(t,i)),this.Yu(t,i)},t.prototype.us=function(t,i,n){this.ra();for(var s=this.ha(),h=u(this.Ar()),r=h.pr(),e=h.gr(),a=this.na()-1,o=this.Ju(),l=a/(e-r),f=void 0===n?0:n.from,c=void 0===n?t.length:n.to,v=this.ua(),_=f;_<c;_++){var d=t[_],w=d.et;if(!isNaN(w)){var M=w;null!==v&&(M=v(d.et,i));var b=s+l*(M-r),m=o?b:this.xu-1-b;d.it=m;}}},t.prototype.Ss=function(t,i,n){this.ra();for(var s=this.ha(),h=u(this.Ar()),r=h.pr(),e=h.gr(),a=this.na()-1,o=this.Ju(),l=a/(e-r),f=void 0===n?0:n.from,c=void 0===n?t.length:n.to,v=this.ua(),_=f;_<c;_++){var d=t[_],w=d.open,M=d.high,b=d.low,m=d.close;null!==v&&(w=v(d.open,i),M=v(d.high,i),b=v(d.low,i),m=v(d.close,i));var p=s+l*(w-r),g=o?p:this.xu-1-p;d.xs=g,p=s+l*(M-r),g=o?p:this.xu-1-p,d.ys=g,p=s+l*(b-r),g=o?p:this.xu-1-p,d.ks=g,p=s+l*(m-r),g=o?p:this.xu-1-p,d.Cs=g;}},t.prototype.qi=function(t,i){var n=this.Hu(t,i);return this.aa(n,i)},t.prototype.aa=function(t,i){var n=t;return this.vr()?n=function(t,i){return i<0&&(t=-t),t/100*i+i}(n,i):this.Zu()&&(n=function(t,i){return t-=100,i<0&&(t=-t),t/100*i+i}(n,i)),n},t.prototype.Ge=function(){return this.Ou},t.prototype.oa=function(){if(this.Vu)return this.Vu;for(var t=[],i=0;i<this.Ou.length;i++){var n=this.Ou[i];null===n.xi()&&n.Ci(i+1),t.push(n);}return t=zi(t),this.Vu=t,this.Vu},t.prototype.la=function(t){-1===this.Ou.indexOf(t)&&(this.Ou.push(t),this.Xe(),this.fa());},t.prototype.ca=function(t){var i=this.Ou.indexOf(t);if(-1===i)throw new Error("source is not attached to scale");this.Ou.splice(i,1),0===this.Ou.length&&(this.$u({_n:!0}),this.Gu(null)),this.Xe(),this.fa();},t.prototype.kt=function(){for(var t=null,i=0,n=this.Ou;i<n.length;i++){var s=n[i].kt();null!==s&&((null===t||s.Ve<t.Ve)&&(t=s));}return null===t?null:t.St},t.prototype.Ju=function(){return this.zi.invertScale},t.prototype.au=function(){var t=null===this.kt();if(null!==this.Pu&&(t||this.Pu.va===t))return this.Pu.au;this.Uu.pu();var i=this.Uu.au();return this.Pu={au:i,va:t},this.Eu.m(),i},t.prototype._a=function(){return this.Eu},t.prototype.da=function(t){this.vr()||this.Zu()||null===this.Wu&&null===this.Su&&(this.wi()||(this.Wu=this.xu-t,this.Su=u(this.Ar()).mr()));},t.prototype.wa=function(t){if(!this.vr()&&!this.Zu()&&null!==this.Wu){this.$u({_n:!1}),(t=this.xu-t)<0&&(t=0);var i=(this.Wu+.2*(this.xu-1))/(t+.2*(this.xu-1)),n=u(this.Su).mr();i=Math.max(i,.1),n.kr(i),this.Gu(n);}},t.prototype.Ma=function(){this.vr()||this.Zu()||(this.Wu=null,this.Su=null);},t.prototype.ba=function(t){this.Xu()||null===this.zu&&null===this.Su&&(this.wi()||(this.zu=t,this.Su=u(this.Ar()).mr()));},t.prototype.ma=function(t){if(!this.Xu()&&null!==this.zu){var i=u(this.Ar()).yr()/(this.na()-1),n=t-this.zu;this.Ju()&&(n*=-1);var s=n*i,h=u(this.Su).mr();h.Nr(s),this.Gu(h,!0),this.Pu=null;}},t.prototype.pa=function(){this.Xu()||null!==this.zu&&(this.zu=null,this.Su=null);},t.prototype.qe=function(){return this.Ue||this.Xe(),this.Ue},t.prototype.Mi=function(t,i){switch(this.zi.mode){case 2:return this.qe().format(Si(t,i));case 3:return this.qe().format(Di(t,i));default:return this.ga(t)}},t.prototype.ku=function(t){switch(this.zi.mode){case 2:case 3:return this.qe().format(t);default:return this.ga(t)}},t.prototype.Fr=function(t){return this.ga(t,u(this.ya()).qe())},t.prototype.Ne=function(t,i){return t=Si(t,i),Ri.format(t)},t.prototype.ka=function(){return this.Ou},t.prototype.Na=function(t){this.Tu={Au:t,Du:!1};},t.prototype.hn=function(){this.Ou.forEach((function(t){return t.hn()}));},t.prototype.Xe=function(){this.Pu=null;var t=this.ya(),i=100;null!==t&&(i=Math.round(1/t.je())),this.Ue=Ii,this.vr()?(this.Ue=Ri,i=100):this.Zu()?(this.Ue=new rt(100,1),i=100):null!==t&&(this.Ue=t.qe()),this.Uu=new Wi(this,i,this.Hu.bind(this),this.Yu.bind(this)),this.Uu.pu();},t.prototype.fa=function(){this.Vu=null;},t.prototype.ya=function(){return this.Ou[0]||null},t.prototype.sa=function(){return this.Ju()?this.zi.scaleMargins.bottom*this.Yt()+this.Lu:this.zi.scaleMargins.top*this.Yt()+this.Bu},t.prototype.ha=function(){return this.Ju()?this.zi.scaleMargins.top*this.Yt()+this.Bu:this.zi.scaleMargins.bottom*this.Yt()+this.Lu},t.prototype.ra=function(){this.Tu.Du||(this.Tu.Du=!0,this.xa());},t.prototype.Ku=function(){this.Cu=null;},t.prototype.Yu=function(t,i){if(this.ra(),this.wi())return 0;t=this.Nu()&&t?Bi(t,this.Ru):t;var n=u(this.Ar()),s=this.ha()+(this.na()-1)*(t-n.pr())/n.yr();return this.ea(s)},t.prototype.Hu=function(t,i){if(this.ra(),this.wi())return 0;var n=this.ea(t),s=u(this.Ar()),h=s.pr()+s.yr()*((n-this.ha())/(this.na()-1));return this.Nu()?Li(h,this.Ru):h},t.prototype.Qu=function(){this.Pu=null,this.Uu.pu();},t.prototype.xa=function(){var t=this.Tu.Au;if(null!==t){for(var i,n,s=null,h=0,r=0,e=0,a=this.ka();e<a.length;e++){var o=a[e];if(o.yt()){var l=o.kt();if(null!==l){var f=o.Re(t.In(),t.jn()),c=f&&f.Ar();if(null!==c){switch(this.zi.mode){case 1:c=Ei(c,this.Ru);break;case 2:c=Ti(c,l.St);break;case 3:c=Ai(c,l.St);}if(s=null===s?c:s.Nn(u(c)),null!==f){var v=f.Br();null!==v&&(h=Math.max(h,v.above),r=Math.max(h,v.below));}}}}}if(h===this.Bu&&r===this.Lu||(this.Bu=h,this.Lu=r,this.Pu=null,this.Ku()),null!==s){if(s.pr()===s.gr()){var _=this.ya(),d=5*(null===_||this.vr()||this.Zu()?1:_.je());this.Nu()&&(s=Fi(s,this.Ru)),s=new fi(s.pr()-d,s.gr()+d),this.Nu()&&(s=Ei(s,this.Ru));}if(this.Nu()){var w=Fi(s,this.Ru),M=Oi(w);if(i=M,n=this.Ru,i.lu!==n.lu||i.fu!==n.fu){var b=null!==this.Su?Fi(this.Su,this.Ru):null;this.Ru=M,s=Ei(w,M),null!==b&&(this.Su=Ei(b,M));}}this.Gu(s);}else null===this.Tr&&(this.Gu(new fi(-.5,.5)),this.Ru=Oi(null));this.Tu.Du=!0;}},t.prototype.ua=function(){var t=this;return this.vr()?Si:this.Zu()?Di:this.Nu()?function(i){return Bi(i,t.Ru)}:null},t.prototype.ga=function(t,i){return void 0===this.qu.priceFormatter?(void 0===i&&(i=this.qe()),i.format(t)):this.qu.priceFormatter(t)},t}(),qi=function(){function t(t,i){this.Ou=[],this.Ca=new Map,this.xu=0,this.hh=0,this.Sa=1e3,this.Vu=null,this.Ta=new y,this.Da=t,this.pi=i,this.Aa=new xi(this);var n=i.W();this.Ba=this.La("left",n.leftPriceScale),this.Ea=this.La("right",n.rightPriceScale),this.Ba.ta().u(this.Fa.bind(this,this.Ba),this),this.Ea.ta().u(this.Fa.bind(this,this.Ba),this),this.Oa(n);}return t.prototype.Oa=function(t){if(t.leftPriceScale&&this.Ba.Pr(t.leftPriceScale),t.rightPriceScale&&this.Ea.Pr(t.rightPriceScale),t.localization&&(this.Ba.Xe(),this.Ea.Xe()),t.overlayPriceScales)for(var i=0,n=Array.from(this.Ca.values());i<n.length;i++){var s=u(n[i][0].Ct());s.Pr(t.overlayPriceScales),t.localization&&s.Xe();}},t.prototype.Va=function(t){switch(t){case"left":return this.Ba;case"right":return this.Ea}return this.Ca.has(t)?e(this.Ca.get(t))[0].Ct():null},t.prototype.g=function(){this.jt().Pa().M(this),this.Ba.ta().M(this),this.Ea.ta().M(this),this.Ou.forEach((function(t){t.g&&t.g();})),this.Ta.m();},t.prototype.Wa=function(){return this.Sa},t.prototype.za=function(t){this.Sa=t;},t.prototype.jt=function(){return this.pi},t.prototype.Ht=function(){return this.hh},t.prototype.Yt=function(){return this.xu},t.prototype.Ra=function(t){this.hh=t,this.Ia();},t.prototype.ia=function(t){var i=this;this.xu=t,this.Ba.ia(t),this.Ea.ia(t),this.Ou.forEach((function(n){if(i.lh(n)){var s=n.Ct();null!==s&&s.ia(t);}})),this.Ia();},t.prototype.Ge=function(){return this.Ou},t.prototype.lh=function(t){var i=t.Ct();return null===i||this.Ba!==i&&this.Ea!==i},t.prototype.la=function(t,i,n){var s=void 0!==n?n:this.qa().ja+1;this.Ua(t,i,s);},t.prototype.ca=function(t){var i=this.Ou.indexOf(t);r(-1!==i,"removeDataSource: invalid data source"),this.Ou.splice(i,1);var n=u(t.Ct()).Ke();if(this.Ca.has(n)){var s=e(this.Ca.get(n)),h=s.indexOf(t);-1!==h&&(s.splice(h,1),0===s.length&&this.Ca.delete(n));}var a=t.Ct();a&&a.Ge().indexOf(t)>=0&&a.ca(t),null!==a&&(a.fa(),this.Ha(a)),this.Vu=null;},t.prototype._h=function(t){return t===this.Ba?"left":t===this.Ea?"right":"overlay"},t.prototype.Ya=function(){return this.Ba},t.prototype.$a=function(){return this.Ea},t.prototype.Ka=function(t,i){t.da(i);},t.prototype.Xa=function(t,i){t.wa(i),this.Ia();},t.prototype.Za=function(t){t.Ma();},t.prototype.Ja=function(t,i){t.ba(i);},t.prototype.Ga=function(t,i){t.ma(i),this.Ia();},t.prototype.Qa=function(t){t.pa();},t.prototype.Ia=function(){this.Ou.forEach((function(t){t.hn();}));},t.prototype.ji=function(){var t=null;return this.pi.W().rightPriceScale.visible&&0!==this.Ea.Ge().length?t=this.Ea:this.pi.W().leftPriceScale.visible&&0!==this.Ba.Ge().length?t=this.Ba:0!==this.Ou.length&&(t=this.Ou[0].Ct()),null===t&&(t=this.Ea),t},t.prototype.fh=function(){var t=null;return this.pi.W().rightPriceScale.visible?t=this.Ea:this.pi.W().leftPriceScale.visible&&(t=this.Ba),t},t.prototype.Ha=function(t){null!==t&&t.Xu()&&this.io(t);},t.prototype.no=function(t){var i=this.Da.ss();t.$u({_n:!0}),null!==i&&t.Na(i),this.Ia();},t.prototype.so=function(){this.io(this.Ba),this.io(this.Ea);},t.prototype.ho=function(){var t=this;this.Ha(this.Ba),this.Ha(this.Ea),this.Ou.forEach((function(i){t.lh(i)&&t.Ha(i.Ct());})),this.Ia(),this.pi.Wr();},t.prototype.oa=function(){return null===this.Vu&&(this.Vu=zi(this.Ou)),this.Vu},t.prototype.ro=function(){return this.Ta},t.prototype.eo=function(){return this.Aa},t.prototype.io=function(t){var i=t.ka();if(i&&i.length>0&&!this.Da.wi()){var n=this.Da.ss();null!==n&&t.Na(n);}t.hn();},t.prototype.qa=function(){var t=this.oa();if(0===t.length)return {uo:0,ja:0};for(var i=0,n=0,s=0;s<t.length;s++){var h=t[s].xi();null!==h&&(h<i&&(i=h),h>n&&(n=h));}return {uo:i,ja:n}},t.prototype.Ua=function(t,i,n){var s=this.Va(i);if(null===s&&(s=this.La(i,this.pi.W().overlayPriceScales)),this.Ou.push(t),!it(i)){var h=this.Ca.get(i)||[];h.push(t),this.Ca.set(i,h);}s.la(t),t.Si(s),t.Ci(n),this.Ha(s),this.Vu=null;},t.prototype.Fa=function(t,i,n){i.mh!==n.mh&&this.io(t);},t.prototype.La=function(t,i){var n=p({visible:!0,autoScale:!0},T(i)),s=new ji(t,n,this.pi.W().layout,this.pi.W().localization);return s.ia(this.Yt()),s},t}(),Ui=function(t){return t.getUTCFullYear()};function Hi(t,i,n){return i.replace(/yyyy/g,function(t){return ht(Ui(t),4)}(t)).replace(/yy/g,function(t){return ht(Ui(t)%100,2)}(t)).replace(/MMMM/g,function(t,i){return new Date(t.getUTCFullYear(),t.getUTCMonth(),1).toLocaleString(i,{month:"long"})}(t,n)).replace(/MMM/g,function(t,i){return new Date(t.getUTCFullYear(),t.getUTCMonth(),1).toLocaleString(i,{month:"short"})}(t,n)).replace(/MM/g,function(t){return ht(function(t){return t.getUTCMonth()+1}(t),2)}(t)).replace(/dd/g,function(t){return ht(function(t){return t.getUTCDate()}(t),2)}(t))}var Yi=function(){function t(t,i){void 0===t&&(t="yyyy-MM-dd"),void 0===i&&(i="default"),this.ao=t,this.oo=i;}return t.prototype.lo=function(t){return Hi(t,this.ao,this.oo)},t}(),$i=function(){function t(t){this.fo=t||"%h:%m:%s";}return t.prototype.lo=function(t){return this.fo.replace("%h",ht(t.getUTCHours(),2)).replace("%m",ht(t.getUTCMinutes(),2)).replace("%s",ht(t.getUTCSeconds(),2))},t}(),Ki={co:"yyyy-MM-dd",vo:"%h:%m:%s",_o:" ",do:"default"},Xi=function(){function t(t){void 0===t&&(t={});var i=p(p({},Ki),t);this.wo=new Yi(i.co,i.do),this.Mo=new $i(i.vo),this.bo=i._o;}return t.prototype.lo=function(t){return "".concat(this.wo.lo(t)).concat(this.bo).concat(this.Mo.lo(t))},t}();var Zi=function(){function t(t,i){void 0===i&&(i=50),this.mo=0,this.po=1,this.yo=1,this.Gs=new Map,this.ko=new Map,this.No=t,this.xo=i;}return t.prototype.lo=function(t){var i=void 0===t.Co?new Date(1e3*t.So).getTime():new Date(Date.UTC(t.Co.year,t.Co.month-1,t.Co.day)).getTime(),n=this.Gs.get(i);if(void 0!==n)return n.To;if(this.mo===this.xo){var s=this.ko.get(this.yo);this.ko.delete(this.yo),this.Gs.delete(e(s)),this.yo++,this.mo--;}var h=this.No(t);return this.Gs.set(i,{To:h,Do:this.po}),this.ko.set(this.po,i),this.mo++,this.po++,h},t}(),Ji=function(){function t(t,i){r(t<=i,"right should be >= left"),this.Ao=t,this.Bo=i;}return t.prototype.In=function(){return this.Ao},t.prototype.jn=function(){return this.Bo},t.prototype.Lo=function(){return this.Bo-this.Ao+1},t.prototype.Uh=function(t){return this.Ao<=t&&t<=this.Bo},t.prototype.br=function(t){return this.Ao===t.In()&&this.Bo===t.jn()},t}();function Gi(t,i){return null===t||null===i?t===i:t.br(i)}var Qi,tn=function(){function t(){this.Eo=new Map,this.Gs=null;}return t.prototype.Fo=function(t,i){this.Oo(i),this.Gs=null;for(var n=i;n<t.length;++n){var s=t[n],h=this.Eo.get(s.Vo);void 0===h&&(h=[],this.Eo.set(s.Vo,h)),h.push({vs:n,rt:s.rt,Po:s.Vo});}},t.prototype.Wo=function(t,i){var n=Math.ceil(i/t);return null!==this.Gs&&this.Gs.zo===n||(this.Gs={au:this.Ro(n),zo:n}),this.Gs.au},t.prototype.Oo=function(t){if(0!==t){var i=[];this.Eo.forEach((function(n,s){t<=n[0].vs?i.push(s):n.splice(vt(n,t,(function(i){return i.vs<t})),1/0);}));for(var n=0,s=i;n<s.length;n++){var h=s[n];this.Eo.delete(h);}}else this.Eo.clear();},t.prototype.Ro=function(t){for(var i=[],n=0,s=Array.from(this.Eo.keys()).sort((function(t,i){return i-t}));n<s.length;n++){var h=s[n];if(this.Eo.get(h)){var r=i;i=[];for(var u=r.length,a=0,o=e(this.Eo.get(h)),l=o.length,f=1/0,c=-1/0,v=0;v<l;v++){for(var _=o[v],d=_.vs;a<u;){var w=r[a],M=w.vs;if(!(M<d)){f=M;break}a++,i.push(w),c=M,f=1/0;}f-d>=t&&d-c>=t&&(i.push(_),c=d);}for(;a<u;a++)i.push(r[a]);}}return i},t}(),nn=function(){function t(t){this.Io=t;}return t.prototype.jo=function(){return null===this.Io?null:new Ji(Math.floor(this.Io.In()),Math.ceil(this.Io.jn()))},t.prototype.qo=function(){return this.Io},t.Uo=function(){return new t(null)},t}();!function(t){t[t.Year=0]="Year",t[t.Month=1]="Month",t[t.DayOfMonth=2]="DayOfMonth",t[t.Time=3]="Time",t[t.TimeWithSeconds=4]="TimeWithSeconds";}(Qi||(Qi={}));var sn=function(){function t(t,i,n){this.hh=0,this.Ho=null,this.Yo=[],this.zu=null,this.Wu=null,this.$o=new tn,this.Ko=new Map,this.Xo=nn.Uo(),this.Zo=!0,this.Jo=new y,this.Go=new y,this.Qo=new y,this.tl=null,this.il=null,this.nl=[],this.zi=i,this.qu=n,this.sl=i.rightOffset,this.hl=i.barSpacing,this.pi=t,this.rl();}return t.prototype.W=function(){return this.zi},t.prototype.el=function(t){k(this.qu,t),this.ul(),this.rl();},t.prototype.Pr=function(t,i){var n;k(this.zi,t),this.zi.fixLeftEdge&&this.al(),this.zi.fixRightEdge&&this.ol(),void 0!==t.barSpacing&&this.pi.gn(t.barSpacing),void 0!==t.rightOffset&&this.pi.yn(t.rightOffset),void 0!==t.minBarSpacing&&this.pi.gn(null!==(n=t.barSpacing)&&void 0!==n?n:this.hl),this.ul(),this.rl(),this.Qo.m();},t.prototype.gi=function(t){var i;return (null===(i=this.Yo[t])||void 0===i?void 0:i.rt)||null},t.prototype.Ze=function(t,i){if(this.Yo.length<1)return null;if(t.So>this.Yo[this.Yo.length-1].rt.So)return i?this.Yo.length-1:null;var n=vt(this.Yo,t.So,(function(t,i){return t.rt.So<i}));return t.So<this.Yo[n].rt.So?i?n:null:n},t.prototype.wi=function(){return 0===this.hh||0===this.Yo.length||null===this.Ho},t.prototype.ss=function(){return this.ll(),this.Xo.jo()},t.prototype.fl=function(){return this.ll(),this.Xo.qo()},t.prototype.cl=function(){var t=this.ss();if(null===t)return null;var i={from:t.In(),to:t.jn()};return this.vl(i)},t.prototype.vl=function(t){var i=Math.round(t.from),n=Math.round(t.to),s=u(this._l()),h=u(this.dl());return {from:u(this.gi(Math.max(s,i))),to:u(this.gi(Math.min(h,n)))}},t.prototype.wl=function(t){return {from:u(this.Ze(t.from,!0)),to:u(this.Ze(t.to,!0))}},t.prototype.Ht=function(){return this.hh},t.prototype.Ra=function(t){if(isFinite(t)&&!(t<=0)&&this.hh!==t){if(this.zi.lockVisibleTimeRangeOnResize&&this.hh){var i=this.hl*t/this.hh;this.hl=i;}if(this.zi.fixLeftEdge){var n=this.ss();if(null!==n)if(n.In()<=0){var s=this.hh-t;this.sl-=Math.round(s/this.hl)+1;}}this.hh=t,this.Zo=!0,this.Ml(),this.bl();}},t.prototype.At=function(t){if(this.wi()||!x(t))return 0;var i=this.ml()+this.sl-t;return this.hh-(i+.5)*this.hl-1},t.prototype.es=function(t,i){for(var n=this.ml(),s=void 0===i?0:i.from,h=void 0===i?t.length:i.to,r=s;r<h;r++){var e=t[r].rt,u=n+this.sl-e,a=this.hh-(u+.5)*this.hl-1;t[r].tt=a;}},t.prototype.pl=function(t){return Math.ceil(this.gl(t))},t.prototype.yn=function(t){this.Zo=!0,this.sl=t,this.bl(),this.pi.yl(),this.pi.Wr();},t.prototype.ws=function(){return this.hl},t.prototype.gn=function(t){this.kl(t),this.bl(),this.pi.yl(),this.pi.Wr();},t.prototype.Nl=function(){return this.sl},t.prototype.au=function(){if(this.wi())return null;if(null!==this.il)return this.il;for(var t=this.hl,i=5*(this.pi.W().layout.fontSize+4),n=Math.round(i/t),s=u(this.ss()),h=Math.max(s.In(),s.In()-n),r=Math.max(s.jn(),s.jn()-n),e=this.$o.Wo(t,i),a=this._l()+n,o=this.dl()-n,l=this.xl(),f=this.zi.fixLeftEdge||l,c=this.zi.fixRightEdge||l,v=0,_=0,d=e;_<d.length;_++){var w=d[_];if(h<=w.vs&&w.vs<=r){var M=void 0;v<this.nl.length?((M=this.nl[v]).su=this.At(w.vs),M.yu=this.Cl(w.rt,w.Po),M.Po=w.Po):(M={Sl:!1,su:this.At(w.vs),yu:this.Cl(w.rt,w.Po),Po:w.Po},this.nl.push(M)),this.hl>i/2&&!l?M.Sl=!1:M.Sl=f&&w.vs<=a||c&&w.vs>=o,v++;}}return this.nl.length=v,this.il=this.nl,this.nl},t.prototype.Tl=function(){this.Zo=!0,this.gn(this.zi.barSpacing),this.yn(this.zi.rightOffset);},t.prototype.Dl=function(t){this.Zo=!0,this.Ho=t,this.bl(),this.al();},t.prototype.Al=function(t,i){var n=this.gl(t),s=this.ws(),h=s+i*(s/10);this.gn(h),this.zi.rightBarStaysOnScroll||this.yn(this.Nl()+(n-this.gl(t)));},t.prototype.da=function(t){this.zu&&this.pa(),null===this.Wu&&null===this.tl&&(this.wi()||(this.Wu=t,this.Bl()));},t.prototype.wa=function(t){if(null!==this.tl){var i=Nt(this.hh-t,0,this.hh),n=Nt(this.hh-u(this.Wu),0,this.hh);0!==i&&0!==n&&this.gn(this.tl.ws*i/n);}},t.prototype.Ma=function(){null!==this.Wu&&(this.Wu=null,this.Ll());},t.prototype.ba=function(t){null===this.zu&&null===this.tl&&(this.wi()||(this.zu=t,this.Bl()));},t.prototype.ma=function(t){if(null!==this.zu){var i=(this.zu-t)/this.ws();this.sl=u(this.tl).Nl+i,this.Zo=!0,this.bl();}},t.prototype.pa=function(){null!==this.zu&&(this.zu=null,this.Ll());},t.prototype.El=function(){this.Fl(this.zi.rightOffset);},t.prototype.Fl=function(t,i){var n=this;if(void 0===i&&(i=400),!isFinite(t))throw new RangeError("offset is required and must be finite number");if(!isFinite(i)||i<=0)throw new RangeError("animationDuration (optional) must be finite positive number");var s=this.sl,h=performance.now(),r=function(){var e=(performance.now()-h)/i,u=e>=1,a=u?t:s+(t-s)*e;n.yn(a),u||setTimeout(r,20);};r();},t.prototype.vt=function(t,i){this.Zo=!0,this.Yo=t,this.$o.Fo(t,i),this.bl();},t.prototype.Ol=function(){return this.Jo},t.prototype.Vl=function(){return this.Go},t.prototype.Pl=function(){return this.Qo},t.prototype.ml=function(){return this.Ho||0},t.prototype.Wl=function(t){var i=t.Lo();this.kl(this.hh/i),this.sl=t.jn()-this.ml(),this.bl(),this.Zo=!0,this.pi.yl(),this.pi.Wr();},t.prototype.zl=function(){var t=this._l(),i=this.dl();null!==t&&null!==i&&this.Wl(new Ji(t,i+this.zi.rightOffset));},t.prototype.Rl=function(t){var i=new Ji(t.from,t.to);this.Wl(i);},t.prototype.yi=function(t){return void 0!==this.qu.timeFormatter?this.qu.timeFormatter(t.Co||t.So):this.Il.lo(new Date(1e3*t.So))},t.prototype.xl=function(){var t=this.pi.W(),i=t.handleScroll,n=t.handleScale;return !(i.horzTouchDrag||i.mouseWheel||i.pressedMouseMove||i.vertTouchDrag||n.axisDoubleClickReset||n.axisPressedMouseMove.time||n.mouseWheel||n.pinch)},t.prototype._l=function(){return 0===this.Yo.length?null:0},t.prototype.dl=function(){return 0===this.Yo.length?null:this.Yo.length-1},t.prototype.jl=function(t){return (this.hh-1-t)/this.hl},t.prototype.gl=function(t){var i=this.jl(t),n=this.ml()+this.sl-i;return Math.round(1e6*n)/1e6},t.prototype.kl=function(t){var i=this.hl;this.hl=t,this.Ml(),i!==this.hl&&(this.Zo=!0,this.ql());},t.prototype.ll=function(){if(this.Zo)if(this.Zo=!1,this.wi())this.Ul(nn.Uo());else {var t=this.ml(),i=this.hh/this.hl,n=this.sl+t,s=new Ji(n-i+1,n);this.Ul(new nn(s));}},t.prototype.Ml=function(){var t=this.Hl();if(this.hl<t&&(this.hl=t,this.Zo=!0),0!==this.hh){var i=.5*this.hh;this.hl>i&&(this.hl=i,this.Zo=!0);}},t.prototype.Hl=function(){return this.zi.fixLeftEdge&&this.zi.fixRightEdge&&0!==this.Yo.length?this.hh/this.Yo.length:this.zi.minBarSpacing},t.prototype.bl=function(){var t=this.Yl();this.sl>t&&(this.sl=t,this.Zo=!0);var i=this.$l();null!==i&&this.sl<i&&(this.sl=i,this.Zo=!0);},t.prototype.$l=function(){var t=this._l(),i=this.Ho;return null===t||null===i?null:t-i-1+(this.zi.fixLeftEdge?this.hh/this.hl:Math.min(2,this.Yo.length))},t.prototype.Yl=function(){return this.zi.fixRightEdge?0:this.hh/this.hl-Math.min(2,this.Yo.length)},t.prototype.Bl=function(){this.tl={ws:this.ws(),Nl:this.Nl()};},t.prototype.Ll=function(){this.tl=null;},t.prototype.Cl=function(t,i){var n=this,s=this.Ko.get(i);return void 0===s&&(s=new Zi((function(t){return n.Kl(t,i)})),this.Ko.set(i,s)),s.lo(t)},t.prototype.Kl=function(t,i){var n,s=function(t,i,n){switch(t){case 0:case 10:return i?n?4:3:2;case 20:case 21:case 22:case 30:case 31:case 32:case 33:return i?3:2;case 50:return 2;case 60:return 1;case 70:return 0}}(i,this.zi.timeVisible,this.zi.secondsVisible);return void 0!==this.zi.tickMarkFormatter?this.zi.tickMarkFormatter(null!==(n=t.Co)&&void 0!==n?n:t.So,s,this.qu.locale):function(t,i,n){var s={};switch(i){case 0:s.year="numeric";break;case 1:s.month="short";break;case 2:s.day="numeric";break;case 3:s.hour12=!1,s.hour="2-digit",s.minute="2-digit";break;case 4:s.hour12=!1,s.hour="2-digit",s.minute="2-digit",s.second="2-digit";}var h=void 0===t.Co?new Date(1e3*t.So):new Date(Date.UTC(t.Co.year,t.Co.month-1,t.Co.day));return new Date(h.getUTCFullYear(),h.getUTCMonth(),h.getUTCDate(),h.getUTCHours(),h.getUTCMinutes(),h.getUTCSeconds(),h.getUTCMilliseconds()).toLocaleString(n,s)}(t,s,this.qu.locale)},t.prototype.Ul=function(t){var i=this.Xo;this.Xo=t,Gi(i.jo(),this.Xo.jo())||this.Jo.m(),Gi(i.qo(),this.Xo.qo())||this.Go.m(),this.ql();},t.prototype.ql=function(){this.il=null;},t.prototype.ul=function(){this.ql(),this.Ko.clear();},t.prototype.rl=function(){var t=this.qu.dateFormat;this.zi.timeVisible?this.Il=new Xi({co:t,vo:this.zi.secondsVisible?"%h:%m:%s":"%h:%m",_o:"   ",do:this.qu.locale}):this.Il=new Yi(t,this.qu.locale);},t.prototype.al=function(){if(this.zi.fixLeftEdge){var t=this._l();if(null!==t){var i=this.ss();if(null!==i){var n=i.In()-t;if(n<0){var s=this.sl-n-1;this.yn(s);}this.Ml();}}}},t.prototype.ol=function(){this.bl(),this.Ml();},t}();var hn,rn=function(t){function i(i){var n=t.call(this)||this;return n.Xl=new Map,n.Bt=i,n}return m(i,t),i.prototype.Y=function(t){},i.prototype.K=function(t){if(this.Bt.yt){t.save();for(var i=0,n=0,s=this.Bt.Zl;n<s.length;n++){if(0!==(a=s[n]).Gt.length){t.font=a.T;var h=this.Jl(t,a.Gt);h>this.Bt.Ht?a.Al=this.Bt.Ht/h:a.Al=1,i+=a.Gl*a.Al;}}var r=0;switch(this.Bt.Ql){case"top":r=0;break;case"center":r=Math.max((this.Bt.Yt-i)/2,0);break;case"bottom":r=Math.max(this.Bt.Yt-i,0);}t.fillStyle=this.Bt.A;for(var e=0,u=this.Bt.Zl;e<u.length;e++){var a=u[e];t.save();var o=0;switch(this.Bt.tf){case"left":t.textAlign="left",o=a.Gl/2;break;case"center":t.textAlign="center",o=this.Bt.Ht/2;break;case"right":t.textAlign="right",o=this.Bt.Ht-1-a.Gl/2;}t.translate(o,r),t.textBaseline="top",t.font=a.T,t.scale(a.Al,a.Al),t.fillText(a.Gt,0,a.if),t.restore(),r+=a.Gl*a.Al;}t.restore();}},i.prototype.Jl=function(t,i){var n=this.nf(t.font),s=n.get(i);return void 0===s&&(s=t.measureText(i).width,n.set(i,s)),s},i.prototype.nf=function(t){var i=this.Xl.get(t);return void 0===i&&(i=new Map,this.Xl.set(t,i)),i},i}(O),en=function(){function t(t){this.ft=!0,this.Wt={yt:!1,A:"",Yt:0,Ht:0,Zl:[],Ql:"center",tf:"center"},this.zt=new rn(this.Wt),this.Rt=t;}return t.prototype.vt=function(){this.ft=!0;},t.prototype.dt=function(t,i){return this.ft&&(this.wt(t,i),this.ft=!1),this.zt},t.prototype.wt=function(t,i){var n=this.Rt.W(),s=this.Wt;s.yt=n.visible,s.yt&&(s.A=n.color,s.Ht=i,s.Yt=t,s.tf=n.horzAlign,s.Ql=n.vertAlign,s.Zl=[{Gt:n.text,T:L(n.fontSize,n.fontFamily,n.fontStyle),Gl:1.2*n.fontSize,if:0,Al:0}]);},t}(),un=function(t){function i(i,n){var s=t.call(this)||this;return s.zi=n,s.Hi=new en(s),s}return m(i,t),i.prototype.nn=function(){return []},i.prototype.tn=function(){return [this.Hi]},i.prototype.W=function(){return this.zi},i.prototype.hn=function(){this.Hi.vt();},i}(Q);!function(t){t[t.OnTouchEnd=0]="OnTouchEnd",t[t.OnNextTap=1]="OnNextTap";}(hn||(hn={}));var an,on,ln,fn=function(){function t(t,i){this.sf=[],this.hf=[],this.hh=0,this.rf=null,this.ef=null,this.uf=new y,this.af=new y,this.lf=null,this.ff=t,this.zi=i,this.cf=new E(this),this.Da=new sn(this,i.timeScale,this.zi.localization),this.ct=new tt(this,i.crosshair),this.vf=new yi(i.crosshair),this._f=new un(this,i.watermark),this.df(),this.sf[0].za(2e3),this.wf=this.Mf(0),this.bf=this.Mf(1);}return t.prototype.Ce=function(){this.mf(new nt(3));},t.prototype.Wr=function(){this.mf(new nt(2));},t.prototype.We=function(){this.mf(new nt(1));},t.prototype.Se=function(t){var i=this.pf(t);this.mf(i);},t.prototype.gf=function(){return this.ef},t.prototype.yf=function(t){var i=this.ef;this.ef=t,null!==i&&this.Se(i.kf),null!==t&&this.Se(t.kf);},t.prototype.W=function(){return this.zi},t.prototype.Pr=function(t){k(this.zi,t),this.sf.forEach((function(i){return i.Oa(t)})),void 0!==t.timeScale&&this.Da.Pr(t.timeScale),void 0!==t.localization&&this.Da.el(t.localization),(t.leftPriceScale||t.rightPriceScale)&&this.uf.m(),this.wf=this.Mf(0),this.bf=this.Mf(1),this.Ce();},t.prototype.Nf=function(t,i){if("left"!==t)if("right"!==t){var n=this.xf(t);null!==n&&(n.Ct.Pr(i),this.uf.m());}else this.Pr({rightPriceScale:i});else this.Pr({leftPriceScale:i});},t.prototype.xf=function(t){for(var i=0,n=this.sf;i<n.length;i++){var s=n[i],h=s.Va(t);if(null!==h)return {It:s,Ct:h}}return null},t.prototype.bt=function(){return this.Da},t.prototype.Cf=function(){return this.sf},t.prototype.Sf=function(){return this._f},t.prototype.Tf=function(){return this.ct},t.prototype.Df=function(){return this.af},t.prototype.Af=function(t,i){t.ia(i),this.yl();},t.prototype.Ra=function(t){this.hh=t,this.Da.Ra(this.hh),this.sf.forEach((function(i){return i.Ra(t)})),this.yl();},t.prototype.df=function(t){var i=new qi(this.Da,this);void 0!==t?this.sf.splice(t,0,i):this.sf.push(i);var n=void 0===t?this.sf.length-1:t,s=new nt(3);return s.cn(n,{vn:0,_n:!0}),this.mf(s),i},t.prototype.Ka=function(t,i,n){t.Ka(i,n);},t.prototype.Xa=function(t,i,n){t.Xa(i,n),this.Te(),this.mf(this.Bf(t,2));},t.prototype.Za=function(t,i){t.Za(i),this.mf(this.Bf(t,2));},t.prototype.Ja=function(t,i,n){i.Xu()||t.Ja(i,n);},t.prototype.Ga=function(t,i,n){i.Xu()||(t.Ga(i,n),this.Te(),this.mf(this.Bf(t,2)));},t.prototype.Qa=function(t,i){i.Xu()||(t.Qa(i),this.mf(this.Bf(t,2)));},t.prototype.no=function(t,i){t.no(i),this.mf(this.Bf(t,2));},t.prototype.Lf=function(t){this.Da.da(t);},t.prototype.Ef=function(t,i){var n=this.bt();if(!n.wi()&&0!==i){var s=n.Ht();t=Math.max(1,Math.min(t,s)),n.Al(t,i),this.yl();}},t.prototype.Ff=function(t){this.Of(0),this.Vf(t),this.Pf();},t.prototype.Wf=function(t){this.Da.wa(t),this.yl();},t.prototype.zf=function(){this.Da.Ma(),this.Wr();},t.prototype.Of=function(t){this.rf=t,this.Da.ba(t);},t.prototype.Vf=function(t){var i=!1;return null!==this.rf&&Math.abs(t-this.rf)>20&&(this.rf=null,i=!0),this.Da.ma(t),this.yl(),i},t.prototype.Pf=function(){this.Da.pa(),this.Wr(),this.rf=null;},t.prototype._t=function(){return this.hf},t.prototype.Rf=function(t,i,n){this.ct.Yi(t,i);var s=NaN,h=this.Da.pl(t),r=this.Da.ss();null!==r&&(h=Math.min(Math.max(r.In(),h),r.jn()));var e=n.ji(),u=e.kt();null!==u&&(s=e.qi(i,u)),s=this.vf.Je(s,h,n),this.ct.Zi(h,s,n),this.We(),this.af.m(this.ct.Mt(),{x:t,y:i});},t.prototype.If=function(){this.Tf().Gi(),this.We(),this.af.m(null,null);},t.prototype.Te=function(){var t=this.ct.It();if(null!==t){var i=this.ct.Ki(),n=this.ct.Xi();this.Rf(i,n,t);}this.ct.hn();},t.prototype.jf=function(t,i,n){var s=this.Da.gi(0);void 0!==i&&void 0!==n&&this.Da.vt(i,n);var h=this.Da.gi(0),r=this.Da.ml(),e=this.Da.ss();if(null!==e&&null!==s&&null!==h){var u=e.Uh(r),a=s.So>h.So,o=null!==t&&t>r&&!a,l=u&&this.Da.W().shiftVisibleRangeOnNewBar;if(o&&!l){var f=t-r;this.Da.yn(this.Da.Nl()-f);}}this.Da.Dl(t);},t.prototype.Be=function(t){null!==t&&t.ho();},t.prototype.oh=function(t){var i=this.sf.find((function(i){return i.oa().includes(t)}));return void 0===i?null:i},t.prototype.yl=function(){this._f.hn(),this.sf.forEach((function(t){return t.ho()})),this.Te();},t.prototype.g=function(){this.sf.forEach((function(t){return t.g()})),this.sf.length=0,this.zi.localization.priceFormatter=void 0,this.zi.localization.timeFormatter=void 0;},t.prototype.qf=function(){return this.cf},t.prototype.dh=function(){return this.cf.W()},t.prototype.Pa=function(){return this.uf},t.prototype.Uf=function(t,i){var n=this.sf[0],s=this.Hf(i,t,n);return this.hf.push(s),1===this.hf.length?this.Ce():this.Wr(),s},t.prototype.Yf=function(t){var i=this.oh(t),n=this.hf.indexOf(t);r(-1!==n,"Series not found"),this.hf.splice(n,1),u(i).ca(t),t.g&&t.g();},t.prototype.xe=function(t,i){var n=u(this.oh(t));n.ca(t);var s=this.xf(i);if(null===s){var h=t.xi();n.la(t,i,h);}else {h=s.It===n?t.xi():void 0;s.It.la(t,i,h);}},t.prototype.zl=function(){var t=new nt(2);t.Mn(),this.mf(t);},t.prototype.$f=function(t){var i=new nt(2);i.mn(t),this.mf(i);},t.prototype.pn=function(){var t=new nt(2);t.pn(),this.mf(t);},t.prototype.gn=function(t){var i=new nt(2);i.gn(t),this.mf(i);},t.prototype.yn=function(t){var i=new nt(2);i.yn(t),this.mf(i);},t.prototype.Kf=function(){return this.zi.rightPriceScale.visible?"right":"left"},t.prototype.Xf=function(){return this.bf},t.prototype.Zf=function(){return this.wf},t.prototype.Dt=function(t){var i=this.bf,n=this.wf;if(i===n)return i;if(t=Math.max(0,Math.min(100,Math.round(100*t))),null===this.lf||this.lf.Pn!==n||this.lf.Wn!==i)this.lf={Pn:n,Wn:i,Jf:new Map};else {var s=this.lf.Jf.get(t);if(void 0!==s)return s}var h=function(t,i,n){var s=w(t),h=s[0],r=s[1],e=s[2],u=s[3],a=w(i),o=a[0],c=a[1],v=a[2],_=a[3],d=[l(h+n*(o-h)),l(r+n*(c-r)),l(e+n*(v-e)),f(u+n*(_-u))];return "rgba(".concat(d[0],", ").concat(d[1],", ").concat(d[2],", ").concat(d[3],")")}(n,i,t/100);return this.lf.Jf.set(t,h),h},t.prototype.Bf=function(t,i){var n=new nt(i);if(null!==t){var s=this.sf.indexOf(t);n.cn(s,{vn:i});}return n},t.prototype.pf=function(t,i){return void 0===i&&(i=2),this.Bf(this.oh(t),i)},t.prototype.mf=function(t){this.ff&&this.ff(t),this.sf.forEach((function(t){return t.eo().ou().vt()}));},t.prototype.Hf=function(t,i,n){var s=new gi(this,t,i),h=void 0!==t.priceScaleId?t.priceScaleId:this.Kf();return n.la(s,h),it(h)||s.Pr(t),s},t.prototype.Mf=function(t){var i=this.zi.layout;return "gradient"===i.background.type?0===t?i.background.topColor:i.background.bottomColor:i.background.color},t}();function cn(t){void 0!==t.borderColor&&(t.borderUpColor=t.borderColor,t.borderDownColor=t.borderColor),void 0!==t.wickColor&&(t.wickUpColor=t.wickColor,t.wickDownColor=t.wickColor);}function vn(t){return !N(t)&&!C(t)}function _n(t){return N(t)}!function(t){t[t.Disabled=0]="Disabled",t[t.Continuous=1]="Continuous",t[t.OnDataUpdate=2]="OnDataUpdate";}(an||(an={})),function(t){t[t.LastBar=0]="LastBar",t[t.LastVisible=1]="LastVisible";}(on||(on={})),function(t){t.Solid="solid",t.VerticalGradient="gradient";}(ln||(ln={}));var dn=function(){function t(t,i){this.Ft=t,this.Ot=i;}return t.prototype.br=function(t){return this.Ft===t.Ft&&this.Ot===t.Ot},t}();function wn(t){return t.ownerDocument&&t.ownerDocument.defaultView&&t.ownerDocument.defaultView.devicePixelRatio||1}function Mn(t){var i=u(t.getContext("2d"));return i.setTransform(1,0,0,1,0,0),i}function bn(t,i){var n=t.createElement("canvas"),s=wn(n);return n.style.width="".concat(i.Ft,"px"),n.style.height="".concat(i.Ot,"px"),n.width=i.Ft*s,n.height=i.Ot*s,n}function mn(i,n){var s=u(i.ownerDocument).createElement("canvas");i.appendChild(s);var h=bindToDevicePixelRatio(s,{allowDownsampling:!1});return h.resizeCanvas({width:n.Ft,height:n.Ot}),h}function pn(t,i){return t.Gf-i.Gf}function gn(t,i,n){var s=(t.Gf-i.Gf)/(t.rt-i.rt);return Math.sign(s)*Math.min(Math.abs(s),n)}var yn=function(){function t(t,i,n,s){this.Qf=null,this.tc=null,this.ic=null,this.nc=null,this.sc=null,this.hc=0,this.rc=0,this.ec=!1,this.uc=t,this.ac=i,this.oc=n,this.Cn=s;}return t.prototype.lc=function(t,i){if(null!==this.Qf){if(this.Qf.rt===i)return void(this.Qf.Gf=t);if(Math.abs(this.Qf.Gf-t)<this.Cn)return}this.nc=this.ic,this.ic=this.tc,this.tc=this.Qf,this.Qf={rt:i,Gf:t};},t.prototype.xh=function(t,i){if(null!==this.Qf&&null!==this.tc&&!(i-this.Qf.rt>50)){var n=0,s=gn(this.Qf,this.tc,this.ac),h=pn(this.Qf,this.tc),r=[s],e=[h];if(n+=h,null!==this.ic){var u=gn(this.tc,this.ic,this.ac);if(Math.sign(u)===Math.sign(s)){var a=pn(this.tc,this.ic);if(r.push(u),e.push(a),n+=a,null!==this.nc){var o=gn(this.ic,this.nc,this.ac);if(Math.sign(o)===Math.sign(s)){var l=pn(this.ic,this.nc);r.push(o),e.push(l),n+=l;}}}}for(var f,c,v,_=0,d=0;d<r.length;++d)_+=e[d]/n*r[d];if(!(Math.abs(_)<this.uc))this.sc={Gf:t,rt:i},this.rc=_,this.hc=(f=Math.abs(_),c=this.oc,v=Math.log(c),Math.log(1*v/-f)/v);}},t.prototype.fc=function(t){var i=u(this.sc),n=t-i.rt;return i.Gf+this.rc*(Math.pow(this.oc,n)-1)/Math.log(this.oc)},t.prototype.cc=function(t){return null===this.sc||this.vc(t)===this.hc},t.prototype._c=function(){return this.ec},t.prototype.dc=function(){this.ec=!0;},t.prototype.vc=function(t){var i=t-u(this.sc).rt;return Math.min(i,this.hc)},t}(),kn="undefined"!=typeof window;function Nn(){return !!kn&&window.navigator.userAgent.toLowerCase().indexOf("firefox")>-1}function xn(){return !!kn&&/iPhone|iPad|iPod/.test(window.navigator.platform)}function Cn(t){kn&&void 0!==window.chrome&&t.addEventListener("mousedown",(function(t){if(1===t.button)return t.preventDefault(),!1}));}var Sn=function(){function t(t,i,n){var s=this;this.wc=0,this.Mc=null,this.bc={tt:Number.NEGATIVE_INFINITY,it:Number.POSITIVE_INFINITY},this.mc=0,this.gc=null,this.yc={tt:Number.NEGATIVE_INFINITY,it:Number.POSITIVE_INFINITY},this.kc=null,this.Nc=!1,this.xc=null,this.Cc=null,this.Sc=!1,this.Tc=!1,this.Dc=!1,this.Ac=null,this.Bc=null,this.Lc=null,this.Ec=null,this.Fc=null,this.Oc=null,this.Vc=null,this.Pc=0,this.Wc=!1,this.zc=!1,this.Rc=!1,this.Ic=0,this.jc=null,this.qc=!xn(),this.Uc=function(t){s.Hc(t);},this.Yc=function(t){if(s.$c(t)){var i=s.Kc(t);if(++s.mc,s.gc&&s.mc>1)s.Zc(An(t),s.yc).Xc<30&&!s.Dc&&s.Jc(i,s.Qc.Gc),s.tv();}else {i=s.Kc(t);if(++s.wc,s.Mc&&s.wc>1)s.Zc(An(t),s.bc).Xc<5&&!s.Tc&&s.iv(i,s.Qc.nv),s.sv();}},this.hv=t,this.Qc=i,this.zi=n,this.rv();}return t.prototype.g=function(){null!==this.Ac&&(this.Ac(),this.Ac=null),null!==this.Bc&&(this.Bc(),this.Bc=null),null!==this.Ec&&(this.Ec(),this.Ec=null),null!==this.Fc&&(this.Fc(),this.Fc=null),null!==this.Oc&&(this.Oc(),this.Oc=null),null!==this.Lc&&(this.Lc(),this.Lc=null),this.ev(),this.sv();},t.prototype.uv=function(t){var i=this;this.Ec&&this.Ec();var n=this.av.bind(this);if(this.Ec=function(){i.hv.removeEventListener("mousemove",n);},this.hv.addEventListener("mousemove",n),!this.$c(t)){var s=this.Kc(t);this.iv(s,this.Qc.ov),this.qc=!0;}},t.prototype.sv=function(){null!==this.Mc&&clearTimeout(this.Mc),this.wc=0,this.Mc=null,this.bc={tt:Number.NEGATIVE_INFINITY,it:Number.POSITIVE_INFINITY};},t.prototype.tv=function(){null!==this.gc&&clearTimeout(this.gc),this.mc=0,this.gc=null,this.yc={tt:Number.NEGATIVE_INFINITY,it:Number.POSITIVE_INFINITY};},t.prototype.av=function(t){if(!this.Rc&&null===this.Cc&&!this.$c(t)){var i=this.Kc(t);this.iv(i,this.Qc.lv),this.qc=!0;}},t.prototype.fv=function(t){var i=Ln(t.changedTouches,u(this.jc));if(null!==i&&(this.Ic=Bn(t),null===this.Vc&&!this.zc)){this.Wc=!0;var n=this.Zc(An(i),u(this.Cc)),s=n.cv,h=n.vv,r=n.Xc;if(this.Sc||!(r<5)){if(!this.Sc){var e=.5*s,a=h>=e&&!this.zi._v(),o=e>h&&!this.zi.dv();a||o||(this.zc=!0),this.Sc=!0,this.Dc=!0,this.ev(),this.tv();}if(!this.zc){var l=this.Kc(t,i);this.Jc(l,this.Qc.wv),Dn(t);}}}},t.prototype.Mv=function(t){if(0===t.button&&(this.Zc(An(t),u(this.xc)).Xc>=5&&(this.Tc=!0,this.sv()),this.Tc)){var i=this.Kc(t);this.iv(i,this.Qc.bv);}},t.prototype.Zc=function(t,i){var n=Math.abs(i.tt-t.tt),s=Math.abs(i.it-t.it);return {cv:n,vv:s,Xc:n+s}},t.prototype.mv=function(t){var i=Ln(t.changedTouches,u(this.jc));if(null===i&&0===t.touches.length&&(i=t.changedTouches[0]),null!==i){this.jc=null,this.Ic=Bn(t),this.ev(),this.Cc=null,this.Oc&&(this.Oc(),this.Oc=null);var n=this.Kc(t,i);if(this.Jc(n,this.Qc.pv),++this.mc,this.gc&&this.mc>1)this.Zc(An(i),this.yc).Xc<30&&!this.Dc&&this.Jc(n,this.Qc.Gc),this.tv();else this.Dc||(this.Jc(n,this.Qc.gv),this.Qc.gv&&Dn(t));0===this.mc&&Dn(t),0===t.touches.length&&this.Nc&&(this.Nc=!1,Dn(t));}},t.prototype.Hc=function(t){if(0===t.button){var i=this.Kc(t);if(this.xc=null,this.Rc=!1,this.Fc&&(this.Fc(),this.Fc=null),Nn())this.hv.ownerDocument.documentElement.removeEventListener("mouseleave",this.Uc);if(!this.$c(t))if(this.iv(i,this.Qc.yv),++this.wc,this.Mc&&this.wc>1)this.Zc(An(t),this.bc).Xc<5&&!this.Tc&&this.iv(i,this.Qc.nv),this.sv();else this.Tc||this.iv(i,this.Qc.kv);}},t.prototype.ev=function(){null!==this.kc&&(clearTimeout(this.kc),this.kc=null);},t.prototype.Nv=function(t){if(null===this.jc){var i=t.changedTouches[0];this.jc=i.identifier,this.Ic=Bn(t);var n=this.hv.ownerDocument.documentElement;this.Dc=!1,this.Sc=!1,this.zc=!1,this.Cc=An(i),this.Oc&&(this.Oc(),this.Oc=null);var s=this.fv.bind(this),h=this.mv.bind(this);this.Oc=function(){n.removeEventListener("touchmove",s),n.removeEventListener("touchend",h);},n.addEventListener("touchmove",s,{passive:!1}),n.addEventListener("touchend",h,{passive:!1}),this.ev(),this.kc=setTimeout(this.xv.bind(this,t),240);var r=this.Kc(t,i);this.Jc(r,this.Qc.Cv),this.gc||(this.mc=0,this.gc=setTimeout(this.tv.bind(this),500),this.yc=An(i));}},t.prototype.Sv=function(t){if(0===t.button){var i=this.hv.ownerDocument.documentElement;Nn()&&i.addEventListener("mouseleave",this.Uc),this.Tc=!1,this.xc=An(t),this.Fc&&(this.Fc(),this.Fc=null);var n=this.Mv.bind(this),s=this.Hc.bind(this);if(this.Fc=function(){i.removeEventListener("mousemove",n),i.removeEventListener("mouseup",s);},i.addEventListener("mousemove",n),i.addEventListener("mouseup",s),this.Rc=!0,!this.$c(t)){var h=this.Kc(t);this.iv(h,this.Qc.Tv),this.Mc||(this.wc=0,this.Mc=setTimeout(this.sv.bind(this),500),this.bc=An(t));}}},t.prototype.rv=function(){var t=this;this.hv.addEventListener("mouseenter",this.uv.bind(this)),this.hv.addEventListener("touchcancel",this.ev.bind(this));var i=this.hv.ownerDocument,n=function(i){t.Qc.Dv&&(i.target&&t.hv.contains(i.target)||t.Qc.Dv());};this.Bc=function(){i.removeEventListener("touchstart",n);},this.Ac=function(){i.removeEventListener("mousedown",n);},i.addEventListener("mousedown",n),i.addEventListener("touchstart",n,{passive:!0}),xn()&&(this.Lc=function(){t.hv.removeEventListener("dblclick",t.Yc);},this.hv.addEventListener("dblclick",this.Yc)),this.hv.addEventListener("mouseleave",this.Av.bind(this)),this.hv.addEventListener("touchstart",this.Nv.bind(this),{passive:!0}),Cn(this.hv),this.hv.addEventListener("mousedown",this.Sv.bind(this)),this.Bv(),this.hv.addEventListener("touchmove",(function(){}),{passive:!1});},t.prototype.Bv=function(){var t=this;void 0===this.Qc.Lv&&void 0===this.Qc.Ev&&void 0===this.Qc.Fv||(this.hv.addEventListener("touchstart",(function(i){return t.Ov(i.touches)}),{passive:!0}),this.hv.addEventListener("touchmove",(function(i){if(2===i.touches.length&&null!==t.Vc&&void 0!==t.Qc.Ev){var n=Tn(i.touches[0],i.touches[1])/t.Pc;t.Qc.Ev(t.Vc,n),Dn(i);}}),{passive:!1}),this.hv.addEventListener("touchend",(function(i){t.Ov(i.touches);})));},t.prototype.Ov=function(t){1===t.length&&(this.Wc=!1),2!==t.length||this.Wc||this.Nc?this.Vv():this.Pv(t);},t.prototype.Pv=function(t){var i=this.hv.getBoundingClientRect()||{left:0,top:0};this.Vc={tt:(t[0].clientX-i.left+(t[1].clientX-i.left))/2,it:(t[0].clientY-i.top+(t[1].clientY-i.top))/2},this.Pc=Tn(t[0],t[1]),void 0!==this.Qc.Lv&&this.Qc.Lv(),this.ev();},t.prototype.Vv=function(){null!==this.Vc&&(this.Vc=null,void 0!==this.Qc.Fv&&this.Qc.Fv());},t.prototype.Av=function(t){if(this.Ec&&this.Ec(),!this.$c(t)&&this.qc){var i=this.Kc(t);this.iv(i,this.Qc.Wv),this.qc=!xn();}},t.prototype.xv=function(t){var i=Ln(t.touches,u(this.jc));if(null!==i){var n=this.Kc(t,i);this.Jc(n,this.Qc.zv),this.Dc=!0,this.Nc=!0;}},t.prototype.$c=function(t){return t.sourceCapabilities&&void 0!==t.sourceCapabilities.firesTouchEvents?t.sourceCapabilities.firesTouchEvents:Bn(t)<this.Ic+500},t.prototype.Jc=function(t,i){i&&i.call(this.Qc,t);},t.prototype.iv=function(t,i){i&&i.call(this.Qc,t);},t.prototype.Kc=function(t,i){var n=i||t,s=this.hv.getBoundingClientRect()||{left:0,top:0};return {Rv:n.clientX,Iv:n.clientY,jv:n.pageX,qv:n.pageY,Uv:n.screenX,Hv:n.screenY,Yv:n.clientX-s.left,$v:n.clientY-s.top,Kv:t.ctrlKey,Xv:t.altKey,Zv:t.shiftKey,Jv:t.metaKey,Gv:!t.type.startsWith("mouse")&&"contextmenu"!==t.type&&"click"!==t.type,Qv:t.type,t_:n.target,i_:t.view,n_:function(){"touchstart"!==t.type&&Dn(t);}}},t}();function Tn(t,i){var n=t.clientX-i.clientX,s=t.clientY-i.clientY;return Math.sqrt(n*n+s*s)}function Dn(t){t.cancelable&&t.preventDefault();}function An(t){return {tt:t.pageX,it:t.pageY}}function Bn(t){return t.timeStamp||performance.now()}function Ln(t,i){for(var n=0;n<t.length;++n)if(t[n].identifier===i)return t[n];return null}var En=function(){function t(t,i,n,s){this.rh=new Rt(200),this.R=0,this.s_="",this.Yh="",this.th=[],this.h_=new Map,this.R=t,this.s_=i,this.Yh=L(t,n,s);}return t.prototype.g=function(){this.rh.ih(),this.th=[],this.h_.clear();},t.prototype.r_=function(t,i,n,s,h){var r=this.e_(t,i);if("left"!==h){var e=wn(t.canvas);n-=Math.floor(r.u_*e);}s-=Math.floor(r.Yt/2),t.drawImage(r.a_,n,s,r.Ht,r.Yt);},t.prototype.e_=function(t,i){var n,s=this;if(this.h_.has(i))n=e(this.h_.get(i));else {if(this.th.length>=200){var h=e(this.th.shift());this.h_.delete(h);}var r=wn(t.canvas),u=Math.ceil(this.R/4.5),a=Math.round(this.R/10),o=Math.ceil(this.rh.Qt(t,i)),l=St(Math.round(o+2*u)),f=St(this.R+2*u),c=bn(document,new dn(l,f));n={Gt:i,u_:Math.round(Math.max(1,o)),Ht:Math.ceil(l*r),Yt:Math.ceil(f*r),a_:c},0!==o&&(this.th.push(n.Gt),this.h_.set(n.Gt,n)),q(t=Mn(n.a_),r,(function(){t.font=s.Yh,t.fillStyle=s.s_,t.fillText(i,0,f-u-a);}));}return n},t}(),Fn=function(){function t(t,i,n,s){var h=this;this._i=null,this.o_=null,this.l_=!1,this.f_=new Rt(50),this.c_=new En(11,"#000"),this.s_=null,this.Yh=null,this.v_=0,this.__=!1,this.d_=function(){h.w_(h.cf.W()),h.__||h.Di.M_().jt().Wr();},this.b_=function(){h.__||h.Di.M_().jt().Wr();},this.Di=t,this.zi=i,this.cf=n,this.m_="left"===s,this.p_=document.createElement("div"),this.p_.style.height="100%",this.p_.style.overflow="hidden",this.p_.style.width="25px",this.p_.style.left="0",this.p_.style.position="relative",this.g_=mn(this.p_,new dn(16,16)),this.g_.subscribeCanvasConfigured(this.d_);var r=this.g_.canvas;r.style.position="absolute",r.style.zIndex="1",r.style.left="0",r.style.top="0",this.y_=mn(this.p_,new dn(16,16)),this.y_.subscribeCanvasConfigured(this.b_);var e=this.y_.canvas;e.style.position="absolute",e.style.zIndex="2",e.style.left="0",e.style.top="0";var u={Tv:this.k_.bind(this),Cv:this.k_.bind(this),bv:this.N_.bind(this),wv:this.N_.bind(this),Dv:this.x_.bind(this),yv:this.C_.bind(this),pv:this.C_.bind(this),nv:this.S_.bind(this),Gc:this.S_.bind(this),ov:this.T_.bind(this),Wv:this.D_.bind(this)};this.A_=new Sn(this.y_.canvas,u,{_v:function(){return !1},dv:function(){return !0}});}return t.prototype.g=function(){this.A_.g(),this.y_.unsubscribeCanvasConfigured(this.b_),this.y_.destroy(),this.g_.unsubscribeCanvasConfigured(this.d_),this.g_.destroy(),null!==this._i&&this._i._a().M(this),this._i=null,this.c_.g();},t.prototype.B_=function(){return this.p_},t.prototype.ht=function(){return u(this._i).W().borderColor},t.prototype.L_=function(){return this.zi.textColor},t.prototype.S=function(){return this.zi.fontSize},t.prototype.E_=function(){return L(this.S(),this.zi.fontFamily)},t.prototype.F_=function(){var t=this.cf.W(),i=this.s_!==t.A,n=this.Yh!==t.T;return (i||n)&&(this.w_(t),this.s_=t.A),n&&(this.f_.ih(),this.Yh=t.T),t},t.prototype.O_=function(){if(null===this._i)return 0;var t=0,i=this.F_(),n=Mn(this.g_.canvas),s=this._i.au();n.font=this.E_(),s.length>0&&(t=Math.max(this.f_.Qt(n,s[0].yu),this.f_.Qt(n,s[s.length-1].yu)));for(var h=this.V_(),r=h.length;r--;){var e=this.f_.Qt(n,h[r].Gt());e>t&&(t=e);}var u=this._i.kt();if(null!==u&&null!==this.o_){var a=this._i.qi(1,u),o=this._i.qi(this.o_.Ot-2,u);t=Math.max(t,this.f_.Qt(n,this._i.Mi(Math.floor(Math.min(a,o))+.11111111111111,u)),this.f_.Qt(n,this._i.Mi(Math.ceil(Math.max(a,o))-.11111111111111,u)));}var l=t||34,f=Math.ceil(i.N+i.C+i.L+i.F+l);return f+=f%2},t.prototype.P_=function(t){if(t.Ft<0||t.Ot<0)throw new Error("Try to set invalid size to PriceAxisWidget "+JSON.stringify(t));null!==this.o_&&this.o_.br(t)||(this.o_=t,this.__=!0,this.g_.resizeCanvas({width:t.Ft,height:t.Ot}),this.y_.resizeCanvas({width:t.Ft,height:t.Ot}),this.__=!1,this.p_.style.width=t.Ft+"px",this.p_.style.height=t.Ot+"px",this.p_.style.minWidth=t.Ft+"px");},t.prototype.W_=function(){return u(this.o_).Ft},t.prototype.Si=function(t){this._i!==t&&(null!==this._i&&this._i._a().M(this),this._i=t,t._a().u(this.Eu.bind(this),this));},t.prototype.Ct=function(){return this._i},t.prototype.ih=function(){var t=this.Di.z_();this.Di.M_().jt().no(t,u(this.Ct()));},t.prototype.R_=function(t){if(null!==this.o_){if(1!==t){var i=Mn(this.g_.canvas);this.I_(),this.j_(i,this.g_.pixelRatio),this.Rs(i,this.g_.pixelRatio),this.q_(i,this.g_.pixelRatio),this.U_(i,this.g_.pixelRatio);}var n=Mn(this.y_.canvas),s=this.o_.Ft,h=this.o_.Ot;q(n,this.y_.pixelRatio,(function(){n.clearRect(0,0,s,h);})),this.H_(n,this.y_.pixelRatio);}},t.prototype.Y_=function(){return this.g_.canvas},t.prototype.vt=function(){var t;null===(t=this._i)||void 0===t||t.au();},t.prototype.k_=function(t){if(null!==this._i&&!this._i.wi()&&this.Di.M_().W().handleScale.axisPressedMouseMove.price){var i=this.Di.M_().jt(),n=this.Di.z_();this.l_=!0,i.Ka(n,this._i,t.$v);}},t.prototype.N_=function(t){if(null!==this._i&&this.Di.M_().W().handleScale.axisPressedMouseMove.price){var i=this.Di.M_().jt(),n=this.Di.z_(),s=this._i;i.Xa(n,s,t.$v);}},t.prototype.x_=function(){if(null!==this._i&&this.Di.M_().W().handleScale.axisPressedMouseMove.price){var t=this.Di.M_().jt(),i=this.Di.z_(),n=this._i;this.l_&&(this.l_=!1,t.Za(i,n));}},t.prototype.C_=function(t){if(null!==this._i&&this.Di.M_().W().handleScale.axisPressedMouseMove.price){var i=this.Di.M_().jt(),n=this.Di.z_();this.l_=!1,i.Za(n,this._i);}},t.prototype.S_=function(t){this.Di.M_().W().handleScale.axisDoubleClickReset&&this.ih();},t.prototype.T_=function(t){null!==this._i&&(!this.Di.M_().jt().W().handleScale.axisPressedMouseMove.price||this._i.vr()||this._i.Zu()||this.K_(1));},t.prototype.D_=function(t){this.K_(0);},t.prototype.V_=function(){var t=this,i=[],n=null===this._i?void 0:this._i;return function(s){for(var h=0;h<s.length;++h)for(var r=s[h].nn(t.Di.z_(),n),e=0;e<r.length;e++)i.push(r[e]);}(this.Di.z_().oa()),i},t.prototype.j_=function(t,i){var n=this;if(null!==this.o_){var s=this.o_.Ft,h=this.o_.Ot;q(t,i,(function(){var i=n.Di.z_().jt(),r=i.Zf(),e=i.Xf();r===e?U(t,0,0,s,h,r):H(t,0,0,s,h,r,e);}));}},t.prototype.Rs=function(t,i){if(null!==this.o_&&null!==this._i&&this._i.W().borderVisible){t.save(),t.fillStyle=this.ht();var n,s=Math.max(1,Math.floor(this.F_().N*i));n=this.m_?Math.floor(this.o_.Ft*i)-s:0,t.fillRect(n,0,s,Math.ceil(this.o_.Ot*i)),t.restore();}},t.prototype.q_=function(t,i){if(null!==this.o_&&null!==this._i){var n=this._i.au();t.save(),t.strokeStyle=this.ht(),t.font=this.E_(),t.fillStyle=this.ht();var s=this.F_(),h=this._i.W().borderVisible&&this._i.W().drawTicks,r=this.m_?Math.floor((this.o_.Ft-s.C)*i-s.N*i):Math.floor(s.N*i),e=this.m_?Math.round(r-s.L*i):Math.round(r+s.C*i+s.L*i),u=this.m_?"right":"left",a=Math.max(1,Math.floor(i)),o=Math.floor(.5*i);if(h){var l=Math.round(s.C*i);t.beginPath();for(var f=0,c=n;f<c.length;f++){var v=c[f];t.rect(r,Math.round(v.su*i)-o,l,a);}t.fill();}t.fillStyle=this.L_();for(var _=0,d=n;_<d.length;_++){v=d[_];this.c_.r_(t,v.yu,e,Math.round(v.su*i),u);}t.restore();}},t.prototype.I_=function(){if(null!==this.o_&&null!==this._i){var t=this.o_.Ot/2,i=[],n=this._i.oa().slice(),s=this.Di.z_(),h=this.F_();this._i===s.fh()&&this.Di.z_().oa().forEach((function(t){s.lh(t)&&n.push(t);}));var r=this._i.Ge()[0],e=this._i;n.forEach((function(n){var h=n.nn(s,e);h.forEach((function(t){t.oi(null),t.li()&&i.push(t);})),r===n&&h.length>0&&(t=h[0].ti());}));var u=i.filter((function(i){return i.ti()<=t})),a=i.filter((function(i){return i.ti()>t}));if(u.sort((function(t,i){return i.ti()-t.ti()})),u.length&&a.length&&a.push(u[0]),a.sort((function(t,i){return t.ti()-i.ti()})),i.forEach((function(t){return t.oi(t.ti())})),this._i.W().alignLabels){for(var o=1;o<u.length;o++){var l=u[o],f=(v=u[o-1]).Yt(h,!1);l.ti()>(_=v.ai())-f&&l.oi(_-f);}for(var c=1;c<a.length;c++){var v,_;l=a[c],f=(v=a[c-1]).Yt(h,!0);l.ti()<(_=v.ai())+f&&l.oi(_+f);}}}},t.prototype.U_=function(t,i){var n=this;if(null!==this.o_){t.save();var s=this.o_,h=this.V_(),r=this.F_(),e=this.m_?"right":"left";h.forEach((function(h){if(h.fi()){var a=h.dt(u(n._i));t.save(),a.H(t,r,n.f_,s.Ft,e,i),t.restore();}})),t.restore();}},t.prototype.H_=function(t,i){var n=this;if(null!==this.o_&&null!==this._i){t.save();var s=this.o_,h=this.Di.M_().jt(),r=[],e=this.Di.z_(),a=h.Tf().nn(e,this._i);a.length&&r.push(a);var o=this.F_(),l=this.m_?"right":"left";r.forEach((function(h){h.forEach((function(h){t.save(),h.dt(u(n._i)).H(t,o,n.f_,s.Ft,l,i),t.restore();}));})),t.restore();}},t.prototype.K_=function(t){this.p_.style.cursor=1===t?"ns-resize":"default";},t.prototype.Eu=function(){var t=this.O_();this.v_<t&&this.Di.M_().jt().Ce(),this.v_=t;},t.prototype.w_=function(t){this.c_.g(),this.c_=new En(t.S,t.A,t.D);},t}();function On(t,i,n,s,h){t.$&&t.$(i,n,s,h);}function Vn(t,i,n,s,h){t.H(i,n,s,h);}function Pn(t,i){return t.tn(i)}function Wn(t,i){return void 0!==t.Pe?t.Pe(i):[]}var zn=function(){function t(t,i){var n=this;this.o_=new dn(0,0),this.X_=null,this.Z_=null,this.J_=null,this.G_=!1,this.Q_=new y,this.td=0,this.nd=!1,this.sd=null,this.hd=!1,this.rd=null,this.ed=null,this.__=!1,this.d_=function(){n.__||null===n.ud||n.pi().Wr();},this.b_=function(){n.__||null===n.ud||n.pi().Wr();},this.ad=t,this.ud=i,this.ud.ro().u(this.od.bind(this),this,!0),this.ld=document.createElement("td"),this.ld.style.padding="0",this.ld.style.position="relative";var s=document.createElement("div");s.style.width="100%",s.style.height="100%",s.style.position="relative",s.style.overflow="hidden",this.fd=document.createElement("td"),this.fd.style.padding="0",this.vd=document.createElement("td"),this.vd.style.padding="0",this.ld.appendChild(s),this.g_=mn(s,new dn(16,16)),this.g_.subscribeCanvasConfigured(this.d_);var h=this.g_.canvas;h.style.position="absolute",h.style.zIndex="1",h.style.left="0",h.style.top="0",this.y_=mn(s,new dn(16,16)),this.y_.subscribeCanvasConfigured(this.b_);var r=this.y_.canvas;r.style.position="absolute",r.style.zIndex="2",r.style.left="0",r.style.top="0",this._d=document.createElement("tr"),this._d.appendChild(this.fd),this._d.appendChild(this.ld),this._d.appendChild(this.vd),this.dd(),this.A_=new Sn(this.y_.canvas,this,{_v:function(){return null===n.sd&&!n.ad.W().handleScroll.vertTouchDrag},dv:function(){return null===n.sd&&!n.ad.W().handleScroll.horzTouchDrag}});}return t.prototype.g=function(){null!==this.X_&&this.X_.g(),null!==this.Z_&&this.Z_.g(),this.y_.unsubscribeCanvasConfigured(this.b_),this.y_.destroy(),this.g_.unsubscribeCanvasConfigured(this.d_),this.g_.destroy(),null!==this.ud&&this.ud.ro().M(this),this.A_.g();},t.prototype.z_=function(){return u(this.ud)},t.prototype.wd=function(i){null!==this.ud&&this.ud.ro().M(this),this.ud=i,null!==this.ud&&this.ud.ro().u(t.prototype.od.bind(this),this,!0),this.dd();},t.prototype.M_=function(){return this.ad},t.prototype.B_=function(){return this._d},t.prototype.dd=function(){if(null!==this.ud&&(this.Md(),0!==this.pi()._t().length)){if(null!==this.X_){var t=this.ud.Ya();this.X_.Si(u(t));}if(null!==this.Z_){var i=this.ud.$a();this.Z_.Si(u(i));}}},t.prototype.bd=function(){null!==this.X_&&this.X_.vt(),null!==this.Z_&&this.Z_.vt();},t.prototype.Wa=function(){return null!==this.ud?this.ud.Wa():0},t.prototype.za=function(t){this.ud&&this.ud.za(t);},t.prototype.ov=function(t){if(this.ud){this.md();var i=t.Yv,n=t.$v;this.pd(i,n);}},t.prototype.Tv=function(t){this.md(),this.gd(),this.pd(t.Yv,t.$v);},t.prototype.lv=function(t){if(this.ud){this.md();var i=t.Yv,n=t.$v;this.pd(i,n);var s=this.$h(i,n);this.pi().yf(s&&{kf:s.kf,yd:s.yd});}},t.prototype.kv=function(t){if(null!==this.ud){this.md();var i=t.Yv,n=t.$v;if(this.Q_.p()){var s=this.pi().Tf().Mt();this.Q_.m(s,{x:i,y:n});}}},t.prototype.bv=function(t){this.md(),this.kd(t),this.pd(t.Yv,t.$v);},t.prototype.yv=function(t){null!==this.ud&&(this.md(),this.nd=!1,this.Nd(t));},t.prototype.zv=function(t){if(this.nd=!0,null===this.sd){var i={x:t.Yv,y:t.$v};this.xd(i,i);}},t.prototype.Wv=function(t){null!==this.ud&&(this.md(),this.ud.jt().yf(null),this.Cd());},t.prototype.Sd=function(){return this.Q_},t.prototype.Lv=function(){this.td=1,this.Td();},t.prototype.Ev=function(t,i){if(this.ad.W().handleScale.pinch){var n=5*(i-this.td);this.td=i,this.pi().Ef(t.tt,n);}},t.prototype.Cv=function(t){if(this.nd=!1,this.hd=null!==this.sd,this.gd(),null!==this.sd){var i=this.pi().Tf();this.rd={x:i.$t(),y:i.Kt()},this.sd={x:t.Yv,y:t.$v};}},t.prototype.wv=function(t){if(null!==this.ud){var i=t.Yv,n=t.$v;if(null===this.sd)this.kd(t);else {this.hd=!1;var s=u(this.rd),h=s.x+(i-this.sd.x),r=s.y+(n-this.sd.y);this.pd(h,r);}}},t.prototype.pv=function(t){0===this.M_().W().trackingMode.exitMode&&(this.hd=!0),this.Dd(),this.Nd(t);},t.prototype.$h=function(t,i){var n=this.ud;if(null===n)return null;for(var s=0,h=n.oa();s<h.length;s++){var r=h[s],e=this.Ad(r.tn(n),t,i);if(null!==e)return {kf:r,i_:e.i_,yd:e.yd}}return null},t.prototype.Bd=function(t,i){u("left"===i?this.X_:this.Z_).P_(new dn(t,this.o_.Ot));},t.prototype.Ld=function(){return this.o_},t.prototype.P_=function(t){if(t.Ft<0||t.Ot<0)throw new Error("Try to set invalid size to PaneWidget "+JSON.stringify(t));this.o_.br(t)||(this.o_=t,this.__=!0,this.g_.resizeCanvas({width:t.Ft,height:t.Ot}),this.y_.resizeCanvas({width:t.Ft,height:t.Ot}),this.__=!1,this.ld.style.width=t.Ft+"px",this.ld.style.height=t.Ot+"px");},t.prototype.Ed=function(){var t=u(this.ud);t.Ha(t.Ya()),t.Ha(t.$a());for(var i=0,n=t.Ge();i<n.length;i++){var s=n[i];if(t.lh(s)){var h=s.Ct();null!==h&&t.Ha(h),s.hn();}}},t.prototype.Y_=function(){return this.g_.canvas},t.prototype.R_=function(t){if(0!==t&&null!==this.ud){if(t>1&&this.Ed(),null!==this.X_&&this.X_.R_(t),null!==this.Z_&&this.Z_.R_(t),1!==t){var i=Mn(this.g_.canvas);i.save(),this.j_(i,this.g_.pixelRatio),this.ud&&(this.Fd(i,this.g_.pixelRatio),this.Od(i,this.g_.pixelRatio),this.Vd(i,this.g_.pixelRatio,Pn)),i.restore();}var n=Mn(this.y_.canvas);n.clearRect(0,0,Math.ceil(this.o_.Ft*this.y_.pixelRatio),Math.ceil(this.o_.Ot*this.y_.pixelRatio)),this.Vd(n,this.g_.pixelRatio,Wn),this.Pd(n,this.y_.pixelRatio);}},t.prototype.Wd=function(){return this.X_},t.prototype.zd=function(){return this.Z_},t.prototype.od=function(){null!==this.ud&&this.ud.ro().M(this),this.ud=null;},t.prototype.j_=function(t,i){var n=this;q(t,i,(function(){var i=n.pi(),s=i.Zf(),h=i.Xf();s===h?U(t,0,0,n.o_.Ft,n.o_.Ot,h):H(t,0,0,n.o_.Ft,n.o_.Ot,s,h);}));},t.prototype.Fd=function(t,i){var n=u(this.ud),s=n.eo().ou().dt(n.Yt(),n.Ht());null!==s&&(t.save(),s.H(t,i,!1),t.restore());},t.prototype.Od=function(t,i){var n=this.pi().Sf();this.Rd(t,i,Pn,On,n),this.Rd(t,i,Pn,Vn,n);},t.prototype.Pd=function(t,i){this.Rd(t,i,Pn,Vn,this.pi().Tf());},t.prototype.Vd=function(t,i,n){for(var s=u(this.ud).oa(),h=0,r=s;h<r.length;h++){var e=r[h];this.Rd(t,i,n,On,e);}for(var a=0,o=s;a<o.length;a++){e=o[a];this.Rd(t,i,n,Vn,e);}},t.prototype.Rd=function(t,i,n,s,h){for(var r=u(this.ud),e=n(h,r),a=r.Yt(),o=r.Ht(),l=r.jt().gf(),f=null!==l&&l.kf===h,c=null!==l&&f&&void 0!==l.yd?l.yd.Kh:void 0,v=0,_=e;v<_.length;v++){var d=_[v].dt(a,o);null!==d&&(t.save(),s(d,t,i,f,c),t.restore());}},t.prototype.Ad=function(t,i,n){for(var s=0,h=t;s<h.length;s++){var r=h[s],e=r.dt(this.o_.Ot,this.o_.Ft);if(null!==e&&e.$h){var u=e.$h(i,n);if(null!==u)return {i_:r,yd:u}}}return null},t.prototype.Md=function(){if(null!==this.ud){var t=this.ad,i=this.ud.Ya().W().visible,n=this.ud.$a().W().visible;i||null===this.X_||(this.fd.removeChild(this.X_.B_()),this.X_.g(),this.X_=null),n||null===this.Z_||(this.vd.removeChild(this.Z_.B_()),this.Z_.g(),this.Z_=null);var s=t.jt().qf();i&&null===this.X_&&(this.X_=new Fn(this,t.W().layout,s,"left"),this.fd.appendChild(this.X_.B_())),n&&null===this.Z_&&(this.Z_=new Fn(this,t.W().layout,s,"right"),this.vd.appendChild(this.Z_.B_()));}},t.prototype.Id=function(t){return t.Gv&&this.nd||null!==this.sd},t.prototype.jd=function(t){return Math.max(0,Math.min(t,this.o_.Ft-1))},t.prototype.qd=function(t){return Math.max(0,Math.min(t,this.o_.Ot-1))},t.prototype.pd=function(t,i){this.pi().Rf(this.jd(t),this.qd(i),u(this.ud));},t.prototype.Cd=function(){this.pi().If();},t.prototype.Dd=function(){this.hd&&(this.sd=null,this.Cd());},t.prototype.xd=function(t,i){this.sd=t,this.hd=!1,this.pd(i.x,i.y);var n=this.pi().Tf();this.rd={x:n.$t(),y:n.Kt()};},t.prototype.pi=function(){return this.ad.jt()},t.prototype.Ud=function(){var t=this.pi(),i=this.z_(),n=i.ji();t.Qa(i,n),t.Pf(),this.J_=null,this.G_=!1;},t.prototype.Nd=function(t){var i=this;if(this.G_){var n=performance.now();if(null!==this.ed&&this.ed.xh(t.Yv,n),null===this.ed||this.ed.cc(n))this.Ud();else {var s=this.pi(),h=s.bt(),r=this.ed,e=function(){if(!r._c()){var t=performance.now(),n=r.cc(t);if(!r._c()){var u=h.Nl();s.Vf(r.fc(t)),u===h.Nl()&&(n=!0,i.ed=null);}n?i.Ud():requestAnimationFrame(e);}};requestAnimationFrame(e);}}},t.prototype.md=function(){this.sd=null;},t.prototype.gd=function(){if(this.ud){if(this.Td(),document.activeElement!==document.body&&document.activeElement!==document.documentElement)u(document.activeElement).blur();else {var t=document.getSelection();null!==t&&t.removeAllRanges();}!this.ud.ji().wi()&&this.pi().bt().wi();}},t.prototype.kd=function(t){if(null!==this.ud){var i=this.pi();if(!i.bt().wi()){var n=this.ad.W(),s=n.handleScroll,h=n.kineticScroll;if(s.pressedMouseMove&&!t.Gv||(s.horzTouchDrag||s.vertTouchDrag)&&t.Gv){var r=this.ud.ji(),e=performance.now();null!==this.J_||this.Id(t)||(this.J_={x:t.Rv,y:t.Iv,So:e,Yv:t.Yv,$v:t.$v}),null!==this.ed&&this.ed.lc(t.Yv,e),null===this.J_||this.G_||this.J_.x===t.Rv&&this.J_.y===t.Iv||(null===this.ed&&(t.Gv&&h.touch||!t.Gv&&h.mouse)&&(this.ed=new yn(.2,7,.997,15),this.ed.lc(this.J_.Yv,this.J_.So),this.ed.lc(t.Yv,e)),r.wi()||i.Ja(this.ud,r,t.$v),i.Of(t.Yv),this.G_=!0),this.G_&&(r.wi()||i.Ga(this.ud,r,t.$v),i.Vf(t.Yv));}}}},t.prototype.Td=function(){var t=performance.now(),i=null===this.ed||this.ed.cc(t);null!==this.ed&&(i||this.Ud()),null!==this.ed&&(this.ed.dc(),this.ed=null);},t}(),Rn=function(){function t(t,i,n,s,h){var r=this;this.ft=!0,this.o_=new dn(0,0),this.d_=function(){return r.R_(3)},this.m_="left"===t,this.cf=n.qf,this.zi=i,this.Hd=s,this.Yd=h,this.p_=document.createElement("div"),this.p_.style.width="25px",this.p_.style.height="100%",this.p_.style.overflow="hidden",this.g_=mn(this.p_,new dn(16,16)),this.g_.subscribeCanvasConfigured(this.d_);}return t.prototype.g=function(){this.g_.unsubscribeCanvasConfigured(this.d_),this.g_.destroy();},t.prototype.B_=function(){return this.p_},t.prototype.Ld=function(){return this.o_},t.prototype.P_=function(t){if(t.Ft<0||t.Ot<0)throw new Error("Try to set invalid size to PriceAxisStub "+JSON.stringify(t));this.o_.br(t)||(this.o_=t,this.g_.resizeCanvas({width:t.Ft,height:t.Ot}),this.p_.style.width="".concat(t.Ft,"px"),this.p_.style.minWidth="".concat(t.Ft,"px"),this.p_.style.height="".concat(t.Ot,"px"),this.ft=!0);},t.prototype.R_=function(t){if((!(t<3)||this.ft)&&0!==this.o_.Ft&&0!==this.o_.Ot){this.ft=!1;var i=Mn(this.g_.canvas);this.j_(i,this.g_.pixelRatio),this.Rs(i,this.g_.pixelRatio);}},t.prototype.Y_=function(){return this.g_.canvas},t.prototype.Rs=function(t,i){if(this.Hd()){var n=this.o_.Ft;t.save(),t.fillStyle=this.zi.timeScale.borderColor;var s=Math.floor(this.cf.W().N*i),h=this.m_?Math.round(n*i)-s:0;t.fillRect(h,0,s,s),t.restore();}},t.prototype.j_=function(t,i){var n=this;q(t,i,(function(){U(t,0,0,n.o_.Ft,n.o_.Ot,n.Yd());}));},t}();function In(t,i){return t.Po>i.Po?t:i}var jn=function(){function t(t){var i=this;this.$d=null,this.Kd=null,this.k=null,this.Xd=!1,this.o_=new dn(0,0),this.Zd=new y,this.f_=new Rt(5),this.__=!1,this.d_=function(){i.__||i.ad.jt().Wr();},this.b_=function(){i.__||i.ad.jt().Wr();},this.ad=t,this.zi=t.W().layout,this.Jd=document.createElement("tr"),this.Gd=document.createElement("td"),this.Gd.style.padding="0",this.Qd=document.createElement("td"),this.Qd.style.padding="0",this.p_=document.createElement("td"),this.p_.style.height="25px",this.p_.style.padding="0",this.tw=document.createElement("div"),this.tw.style.width="100%",this.tw.style.height="100%",this.tw.style.position="relative",this.tw.style.overflow="hidden",this.p_.appendChild(this.tw),this.g_=mn(this.tw,new dn(16,16)),this.g_.subscribeCanvasConfigured(this.d_);var n=this.g_.canvas;n.style.position="absolute",n.style.zIndex="1",n.style.left="0",n.style.top="0",this.y_=mn(this.tw,new dn(16,16)),this.y_.subscribeCanvasConfigured(this.b_);var s=this.y_.canvas;s.style.position="absolute",s.style.zIndex="2",s.style.left="0",s.style.top="0",this.Jd.appendChild(this.Gd),this.Jd.appendChild(this.p_),this.Jd.appendChild(this.Qd),this.iw(),this.ad.jt().Pa().u(this.iw.bind(this),this),this.A_=new Sn(this.y_.canvas,this,{_v:function(){return !0},dv:function(){return !1}});}return t.prototype.g=function(){this.A_.g(),null!==this.$d&&this.$d.g(),null!==this.Kd&&this.Kd.g(),this.y_.unsubscribeCanvasConfigured(this.b_),this.y_.destroy(),this.g_.unsubscribeCanvasConfigured(this.d_),this.g_.destroy();},t.prototype.B_=function(){return this.Jd},t.prototype.nw=function(){return this.$d},t.prototype.sw=function(){return this.Kd},t.prototype.Tv=function(t){if(!this.Xd){this.Xd=!0;var i=this.ad.jt();!i.bt().wi()&&this.ad.W().handleScale.axisPressedMouseMove.time&&i.Lf(t.Yv);}},t.prototype.Cv=function(t){this.Tv(t);},t.prototype.Dv=function(){var t=this.ad.jt();!t.bt().wi()&&this.Xd&&(this.Xd=!1,this.ad.W().handleScale.axisPressedMouseMove.time&&t.zf());},t.prototype.bv=function(t){var i=this.ad.jt();!i.bt().wi()&&this.ad.W().handleScale.axisPressedMouseMove.time&&i.Wf(t.Yv);},t.prototype.wv=function(t){this.bv(t);},t.prototype.yv=function(){this.Xd=!1;var t=this.ad.jt();t.bt().wi()&&!this.ad.W().handleScale.axisPressedMouseMove.time||t.zf();},t.prototype.pv=function(){this.yv();},t.prototype.nv=function(){this.ad.W().handleScale.axisDoubleClickReset&&this.ad.jt().pn();},t.prototype.Gc=function(){this.nv();},t.prototype.ov=function(){this.ad.jt().W().handleScale.axisPressedMouseMove.time&&this.K_(1);},t.prototype.Wv=function(){this.K_(0);},t.prototype.Ld=function(){return this.o_},t.prototype.hw=function(){return this.Zd},t.prototype.rw=function(t,i,n){this.o_&&this.o_.br(t)||(this.o_=t,this.__=!0,this.g_.resizeCanvas({width:t.Ft,height:t.Ot}),this.y_.resizeCanvas({width:t.Ft,height:t.Ot}),this.__=!1,this.p_.style.width=t.Ft+"px",this.p_.style.height=t.Ot+"px",this.Zd.m(t)),null!==this.$d&&this.$d.P_(new dn(i,t.Ot)),null!==this.Kd&&this.Kd.P_(new dn(n,t.Ot));},t.prototype.ew=function(){var t=this.uw();return Math.ceil(t.N+t.C+t.S+t.O+t.B)},t.prototype.vt=function(){this.ad.jt().bt().au();},t.prototype.Y_=function(){return this.g_.canvas},t.prototype.R_=function(t){if(0!==t){if(1!==t){var i=Mn(this.g_.canvas);this.j_(i,this.g_.pixelRatio),this.Rs(i,this.g_.pixelRatio),this.q_(i,this.g_.pixelRatio),null!==this.$d&&this.$d.R_(t),null!==this.Kd&&this.Kd.R_(t);}var n=Mn(this.y_.canvas),s=this.y_.pixelRatio;n.clearRect(0,0,Math.ceil(this.o_.Ft*s),Math.ceil(this.o_.Ot*s)),this.aw([this.ad.jt().Tf()],n,s);}},t.prototype.j_=function(t,i){var n=this;q(t,i,(function(){U(t,0,0,n.o_.Ft,n.o_.Ot,n.ad.jt().Xf());}));},t.prototype.Rs=function(t,i){if(this.ad.W().timeScale.borderVisible){t.save(),t.fillStyle=this.ow();var n=Math.max(1,Math.floor(this.uw().N*i));t.fillRect(0,0,Math.ceil(this.o_.Ft*i),n),t.restore();}},t.prototype.q_=function(t,i){var n=this,s=this.ad.jt().bt().au();if(s&&0!==s.length){var h=s.reduce(In,s[0]).Po;h>30&&h<50&&(h=30),t.save(),t.strokeStyle=this.ow();var r=this.uw(),e=r.N+r.C+r.O+r.S-r.V;t.textAlign="center",t.fillStyle=this.ow();var u=Math.floor(this.uw().N*i),a=Math.max(1,Math.floor(i)),o=Math.floor(.5*i);if(this.ad.jt().bt().W().borderVisible){t.beginPath();for(var l=Math.round(r.C*i),f=s.length;f--;){var c=Math.round(s[f].su*i);t.rect(c-o,u,a,l);}t.fill();}t.fillStyle=this.j(),q(t,i,(function(){t.font=n.lw();for(var i=0,r=s;i<r.length;i++){if((l=r[i]).Po<h){var u=l.Sl?n.fw(t,l.su,l.yu):l.su;t.fillText(l.yu,u,e);}}t.font=n.cw();for(var a=0,o=s;a<o.length;a++){var l;if((l=o[a]).Po>=h){u=l.Sl?n.fw(t,l.su,l.yu):l.su;t.fillText(l.yu,u,e);}}})),t.restore();}},t.prototype.fw=function(t,i,n){var s=this.f_.Qt(t,n),h=s/2,r=Math.floor(i-h)+.5;return r<0?i+=Math.abs(0-r):r+s>this.o_.Ft&&(i-=Math.abs(this.o_.Ft-(r+s))),i},t.prototype.aw=function(t,i,n){for(var s=this.uw(),h=0,r=t;h<r.length;h++)for(var e=0,u=r[h].Ti();e<u.length;e++){var a=u[e];i.save(),a.dt().H(i,s,n),i.restore();}},t.prototype.ow=function(){return this.ad.W().timeScale.borderColor},t.prototype.j=function(){return this.zi.textColor},t.prototype.R=function(){return this.zi.fontSize},t.prototype.lw=function(){return L(this.R(),this.zi.fontFamily)},t.prototype.cw=function(){return L(this.R(),this.zi.fontFamily,"bold")},t.prototype.uw=function(){null===this.k&&(this.k={N:1,V:NaN,O:NaN,B:NaN,mi:NaN,C:3,S:NaN,T:"",bi:new Rt});var t=this.k,i=this.lw();if(t.T!==i){var n=this.R();t.S=n,t.T=i,t.O=Math.ceil(n/2.5),t.B=t.O,t.mi=Math.ceil(n/2),t.V=Math.round(this.R()/5),t.bi.ih();}return this.k},t.prototype.K_=function(t){this.p_.style.cursor=1===t?"ew-resize":"default";},t.prototype.iw=function(){var t=this.ad.jt(),i=t.W();i.leftPriceScale.visible||null===this.$d||(this.Gd.removeChild(this.$d.B_()),this.$d.g(),this.$d=null),i.rightPriceScale.visible||null===this.Kd||(this.Qd.removeChild(this.Kd.B_()),this.Kd.g(),this.Kd=null);var n={qf:this.ad.jt().qf()},s=function(){return i.leftPriceScale.borderVisible&&t.bt().W().borderVisible},h=function(){return t.Xf()};i.leftPriceScale.visible&&null===this.$d&&(this.$d=new Rn("left",i,n,s,h),this.Gd.appendChild(this.$d.B_())),i.rightPriceScale.visible&&null===this.Kd&&(this.Kd=new Rn("right",i,n,s,h),this.Qd.appendChild(this.Kd.B_()));},t}(),qn=function(){function t(t,i){var n;this._w=[],this.dw=0,this.xu=0,this.hh=0,this.ww=0,this.Mw=0,this.bw=null,this.mw=!1,this.Q_=new y,this.af=new y,this.zi=i,this.Jd=document.createElement("div"),this.Jd.classList.add("tv-lightweight-charts"),this.Jd.style.overflow="hidden",this.Jd.style.width="100%",this.Jd.style.height="100%",(n=this.Jd).style.userSelect="none",n.style.webkitUserSelect="none",n.style.msUserSelect="none",n.style.MozUserSelect="none",n.style.webkitTapHighlightColor="transparent",this.pw=document.createElement("table"),this.pw.setAttribute("cellspacing","0"),this.Jd.appendChild(this.pw),this.gw=this.yw.bind(this),this.Jd.addEventListener("wheel",this.gw,{passive:!1}),this.pi=new fn(this.ff.bind(this),this.zi),this.jt().Df().u(this.kw.bind(this),this),this.Nw=new jn(this),this.pw.appendChild(this.Nw.B_());var s=this.zi.width,h=this.zi.height;if(0===s||0===h){var r=t.getBoundingClientRect();0===s&&(s=Math.floor(r.width),s-=s%2),0===h&&(h=Math.floor(r.height),h-=h%2);}this.xw(s,h),this.Cw(),t.appendChild(this.Jd),this.Sw(),this.pi.bt().Pl().u(this.pi.Ce.bind(this.pi),this),this.pi.Pa().u(this.pi.Ce.bind(this.pi),this);}return t.prototype.jt=function(){return this.pi},t.prototype.W=function(){return this.zi},t.prototype.Tw=function(){return this._w},t.prototype.Dw=function(){return this.Nw},t.prototype.g=function(){this.Jd.removeEventListener("wheel",this.gw),0!==this.dw&&window.cancelAnimationFrame(this.dw),this.pi.Df().M(this),this.pi.bt().Pl().M(this),this.pi.Pa().M(this),this.pi.g();for(var t=0,i=this._w;t<i.length;t++){var n=i[t];this.pw.removeChild(n.B_()),n.Sd().M(this),n.g();}this._w=[],u(this.Nw).g(),null!==this.Jd.parentElement&&this.Jd.parentElement.removeChild(this.Jd),this.af.g(),this.Q_.g();},t.prototype.xw=function(t,i,n){if(void 0===n&&(n=!1),this.xu!==i||this.hh!==t){this.xu=i,this.hh=t;var s=i+"px",h=t+"px";u(this.Jd).style.height=s,u(this.Jd).style.width=h,this.pw.style.height=s,this.pw.style.width=h,n?this.Aw(new nt(3)):this.pi.Ce();}},t.prototype.R_=function(t){void 0===t&&(t=new nt(3));for(var i=0;i<this._w.length;i++)this._w[i].R_(t.wn(i).vn);this.zi.timeScale.visible&&this.Nw.R_(t.dn());},t.prototype.Pr=function(t){this.pi.Pr(t),this.Sw();var i=t.width||this.hh,n=t.height||this.xu;this.xw(i,n);},t.prototype.Sd=function(){return this.Q_},t.prototype.Df=function(){return this.af},t.prototype.Bw=function(){var t=this;null!==this.bw&&(this.Aw(this.bw),this.bw=null);var i=this._w[0],n=bn(document,new dn(this.hh,this.xu)),s=Mn(n),h=wn(n);return q(s,h,(function(){var n=0,h=0,r=function(i){for(var r=0;r<t._w.length;r++){var e=t._w[r],a=e.Ld().Ot,o=u("left"===i?e.Wd():e.zd()),l=o.Y_();s.drawImage(l,n,h,o.W_(),a),h+=a;}};t.Lw()&&(r("left"),n=u(i.Wd()).W_()),h=0;for(var e=0;e<t._w.length;e++){var a=t._w[e],o=a.Ld(),l=a.Y_();s.drawImage(l,n,h,o.Ft,o.Ot),h+=o.Ot;}n+=i.Ld().Ft,t.Ew()&&(h=0,r("right"));var f=function(i){var r=u("left"===i?t.Nw.nw():t.Nw.sw()),e=r.Ld(),a=r.Y_();s.drawImage(a,n,h,e.Ft,e.Ot);};if(t.zi.timeScale.visible){n=0,t.Lw()&&(f("left"),n=u(i.Wd()).W_());var c=t.Nw.Ld();l=t.Nw.Y_();s.drawImage(l,n,h,c.Ft,c.Ot),t.Ew()&&(n+=i.Ld().Ft,f("right"),s.restore());}})),n},t.prototype.Fw=function(t){return "none"===t?0:("left"!==t||this.Lw())&&("right"!==t||this.Ew())?0===this._w.length?0:u("left"===t?this._w[0].Wd():this._w[0].zd()).W_():0},t.prototype.Ow=function(){for(var t=0,i=0,n=0,s=0,h=this._w;s<h.length;s++){var r=h[s];this.Lw()&&(i=Math.max(i,u(r.Wd()).O_())),this.Ew()&&(n=Math.max(n,u(r.zd()).O_())),t+=r.Wa();}var e=this.hh,a=this.xu,o=Math.max(e-i-n,0),l=this.zi.timeScale.visible,f=l?this.Nw.ew():0;f%2&&(f+=1);for(var c=0+f,v=a<c?0:a-c,_=v/t,d=0,w=0;w<this._w.length;++w){(r=this._w[w]).wd(this.pi.Cf()[w]);var M,b=0;b=w===this._w.length-1?v-d:Math.round(r.Wa()*_),d+=M=Math.max(b,2),r.P_(new dn(o,M)),this.Lw()&&r.Bd(i,"left"),this.Ew()&&r.Bd(n,"right"),r.z_()&&this.pi.Af(r.z_(),M);}this.Nw.rw(new dn(l?o:0,f),l?i:0,l?n:0),this.pi.Ra(o),this.ww!==i&&(this.ww=i),this.Mw!==n&&(this.Mw=n);},t.prototype.yw=function(t){var i=t.deltaX/100,n=-t.deltaY/100;if(0!==i&&this.zi.handleScroll.mouseWheel||0!==n&&this.zi.handleScale.mouseWheel){switch(t.cancelable&&t.preventDefault(),t.deltaMode){case t.DOM_DELTA_PAGE:i*=120,n*=120;break;case t.DOM_DELTA_LINE:i*=32,n*=32;}if(0!==n&&this.zi.handleScale.mouseWheel){var s=Math.sign(n)*Math.min(1,Math.abs(n)),h=t.clientX-this.Jd.getBoundingClientRect().left;this.jt().Ef(h,s);}0!==i&&this.zi.handleScroll.mouseWheel&&this.jt().Ff(-80*i);}},t.prototype.Aw=function(t){var i,n=t.dn();3===n&&this.Vw(),3!==n&&2!==n||(this.Pw(t),this.Ww(t),this.Nw.vt(),this._w.forEach((function(t){t.bd();})),3===(null===(i=this.bw)||void 0===i?void 0:i.dn())&&(this.bw.Nn(t),this.Vw(),this.Pw(this.bw),this.Ww(this.bw),t=this.bw,this.bw=null)),this.R_(t);},t.prototype.Ww=function(t){for(var i=0,n=t.kn();i<n.length;i++){var s=n[i];this.xn(s);}},t.prototype.Pw=function(t){for(var i=this.pi.Cf(),n=0;n<i.length;n++)t.wn(n)._n&&i[n].so();},t.prototype.xn=function(t){var i=this.pi.bt();switch(t.bn){case 0:i.zl();break;case 1:i.Rl(t.St);break;case 2:i.gn(t.St);break;case 3:i.yn(t.St);break;case 4:i.Tl();}},t.prototype.ff=function(t){var i=this;null!==this.bw?this.bw.Nn(t):this.bw=t,this.mw||(this.mw=!0,this.dw=window.requestAnimationFrame((function(){if(i.mw=!1,i.dw=0,null!==i.bw){var t=i.bw;i.bw=null,i.Aw(t);}})));},t.prototype.Vw=function(){this.Cw();},t.prototype.Cw=function(){for(var t=this.pi.Cf(),i=t.length,n=this._w.length,s=i;s<n;s++){var h=e(this._w.pop());this.pw.removeChild(h.B_()),h.Sd().M(this),h.g();}for(s=n;s<i;s++){(h=new zn(this,t[s])).Sd().u(this.zw.bind(this),this),this._w.push(h),this.pw.insertBefore(h.B_(),this.Nw.B_());}for(s=0;s<i;s++){var r=t[s];(h=this._w[s]).z_()!==r?h.wd(r):h.dd();}this.Sw(),this.Ow();},t.prototype.Rw=function(t,i){var n,s=new Map;null!==t&&this.pi._t().forEach((function(i){var n=i.er(t);null!==n&&s.set(i,n);}));if(null!==t){var h=this.pi.bt().gi(t);null!==h&&(n=h);}var r=this.jt().gf(),e=null!==r&&r.kf instanceof gi?r.kf:void 0,u=null!==r&&void 0!==r.yd?r.yd.Zh:void 0;return {rt:n,Iw:i||void 0,jw:e,qw:s,Uw:u}},t.prototype.zw=function(t,i){var n=this;this.Q_.m((function(){return n.Rw(t,i)}));},t.prototype.kw=function(t,i){var n=this;this.af.m((function(){return n.Rw(t,i)}));},t.prototype.Sw=function(){var t=this.zi.timeScale.visible?"":"none";this.Nw.B_().style.display=t;},t.prototype.Lw=function(){return this._w[0].z_().Ya().W().visible},t.prototype.Ew=function(){return this._w[0].z_().$a().W().visible},t}();function Un(t,i,n){var s=n.value;return {vs:i,rt:t,St:[s,s,s,s]}}function Hn(t,i,n){var s=n.value,h={vs:i,rt:t,St:[s,s,s,s]};return "color"in n&&void 0!==n.color&&(h.A=n.color),h}function Yn(t){return void 0!==t.St}function $n(t){return function(i,n,s){return void 0===(h=s).open&&void 0===h.value?{rt:i,vs:n}:t(i,n,s);var h;}}var Kn={Candlestick:$n((function(t,i,n){var s={vs:i,rt:t,St:[n.open,n.high,n.low,n.close]};return "color"in n&&void 0!==n.color&&(s.A=n.color),"borderColor"in n&&void 0!==n.borderColor&&(s.Tt=n.borderColor),"wickColor"in n&&void 0!==n.wickColor&&(s.qs=n.wickColor),s})),Bar:$n((function(t,i,n){var s={vs:i,rt:t,St:[n.open,n.high,n.low,n.close]};return "color"in n&&void 0!==n.color&&(s.A=n.color),s})),Area:$n(Un),Baseline:$n(Un),Histogram:$n(Hn),Line:$n(Hn)};function Xn(t){return Kn[t]}function Zn(t){return 60*t*60*1e3}function Jn(t){return 60*t*1e3}var Gn,Qn=[{Hw:(Gn=1,1e3*Gn),Po:10},{Hw:Jn(1),Po:20},{Hw:Jn(5),Po:21},{Hw:Jn(30),Po:22},{Hw:Zn(1),Po:30},{Hw:Zn(3),Po:31},{Hw:Zn(6),Po:32},{Hw:Zn(12),Po:33}];function ts(t,i){if(t.getUTCFullYear()!==i.getUTCFullYear())return 70;if(t.getUTCMonth()!==i.getUTCMonth())return 60;if(t.getUTCDate()!==i.getUTCDate())return 50;for(var n=Qn.length-1;n>=0;--n)if(Math.floor(i.getTime()/Qn[n].Hw)!==Math.floor(t.getTime()/Qn[n].Hw))return Qn[n].Po;return 0}function is(t,i){if(void 0===i&&(i=0),0!==t.length){for(var n=0===i?null:t[i-1].rt.So,s=null!==n?new Date(1e3*n):null,h=0,r=i;r<t.length;++r){var e=t[r],u=new Date(1e3*e.rt.So);null!==s&&(e.Vo=ts(u,s)),h+=e.rt.So-(n||e.rt.So),n=e.rt.So,s=u;}if(0===i&&t.length>1){var a=Math.ceil(h/(t.length-1)),o=new Date(1e3*(t[0].rt.So-a));t[0].Vo=ts(new Date(1e3*t[0].rt.So),o);}}}function ns(t){if(!vn(t))throw new Error("time must be of type BusinessDay");var i=new Date(Date.UTC(t.year,t.month-1,t.day,0,0,0,0));return {So:Math.round(i.getTime()/1e3),Co:t}}function ss(t){if(!_n(t))throw new Error("time must be of type isUTCTimestamp");return {So:t}}function hs(t){return 0===t.length?null:vn(t[0].time)?ns:ss}function rs(t){return _n(t)?ss(t):vn(t)?ns(t):ns(es(t))}function es(t){var i=new Date(t);if(isNaN(i.getTime()))throw new Error("Invalid date string=".concat(t,", expected format=yyyy-mm-dd"));return {day:i.getUTCDate(),month:i.getUTCMonth()+1,year:i.getUTCFullYear()}}function us(t){C(t.time)&&(t.time=es(t.time));}function as(t){return {vs:0,Yw:new Map,Ve:t}}function os(t){if(void 0!==t&&0!==t.length)return {$w:t[0].rt.So,Kw:t[t.length-1].rt.So}}var ls=function(){function t(){this.Xw=new Map,this.Zw=new Map,this.Jw=new Map,this.Gw=[];}return t.prototype.g=function(){this.Xw.clear(),this.Zw.clear(),this.Jw.clear(),this.Gw=[];},t.prototype.Qw=function(t,i){var n=this,s=0!==this.Xw.size,h=!1,r=this.Zw.get(t);if(void 0!==r)if(1===this.Zw.size)s=!1,h=!0,this.Xw.clear();else for(var e=0,a=this.Gw;e<a.length;e++){a[e].pointData.Yw.delete(t)&&(h=!0);}var o=[];if(0!==i.length){!function(t){t.forEach(us);}(i);var l=u(hs(i)),f=Xn(t.Rr());o=i.map((function(i){var s=l(i.time),r=n.Xw.get(s.So);void 0===r&&(r=as(s),n.Xw.set(s.So,r),h=!0);var e=f(s,r.vs,i);return r.Yw.set(t,e),e}));}s&&this.tM(),this.iM(t,o);var c=-1;if(h){var v=[];this.Xw.forEach((function(t){v.push({Vo:0,rt:t.Ve,pointData:t});})),v.sort((function(t,i){return t.rt.So-i.rt.So})),c=this.nM(v);}return this.sM(t,c,function(t,i){var n=os(t),s=os(i);if(void 0!==n&&void 0!==s)return {Ae:n.Kw>=s.Kw&&n.$w>=s.$w}}(this.Zw.get(t),r))},t.prototype.Yf=function(t){return this.Qw(t,[])},t.prototype.hM=function(t,i){us(i);var n=u(hs([i]))(i.time),s=this.Jw.get(t);if(void 0!==s&&n.So<s.So)throw new Error("Cannot update oldest data, last time=".concat(s.So,", new time=").concat(n.So));var h=this.Xw.get(n.So),r=void 0===h;void 0===h&&(h=as(n),this.Xw.set(n.So,h));var e=Xn(t.Rr())(n,h.vs,i);h.Yw.set(t,e),this.rM(t,e);var a={Ae:Yn(e)};if(!r)return this.sM(t,-1,a);var o={Vo:0,rt:h.Ve,pointData:h},l=vt(this.Gw,o.rt.So,(function(t,i){return t.rt.So<i}));this.Gw.splice(l,0,o);for(var f=l;f<this.Gw.length;++f)fs(this.Gw[f].pointData,f);return is(this.Gw,l),this.sM(t,l,a)},t.prototype.rM=function(t,i){var n=this.Zw.get(t);void 0===n&&(n=[],this.Zw.set(t,n));var s=0!==n.length?n[n.length-1]:null;null===s||i.rt.So>s.rt.So?Yn(i)&&n.push(i):Yn(i)?n[n.length-1]=i:n.splice(-1,1),this.Jw.set(t,i.rt);},t.prototype.iM=function(t,i){0!==i.length?(this.Zw.set(t,i.filter(Yn)),this.Jw.set(t,i[i.length-1].rt)):(this.Zw.delete(t),this.Jw.delete(t));},t.prototype.tM=function(){for(var t=0,i=this.Gw;t<i.length;t++){var n=i[t];0===n.pointData.Yw.size&&this.Xw.delete(n.rt.So);}},t.prototype.nM=function(t){for(var i=-1,n=0;n<this.Gw.length&&n<t.length;++n){var s=this.Gw[n],h=t[n];if(s.rt.So!==h.rt.So){i=n;break}h.Vo=s.Vo,fs(h.pointData,n);}if(-1===i&&this.Gw.length!==t.length&&(i=Math.min(this.Gw.length,t.length)),-1===i)return -1;for(n=i;n<t.length;++n)fs(t[n].pointData,n);return is(t,i),this.Gw=t,i},t.prototype.eM=function(){if(0===this.Zw.size)return null;var t=0;return this.Zw.forEach((function(i){0!==i.length&&(t=Math.max(t,i[i.length-1].vs));})),t},t.prototype.sM=function(t,i,n){var s={uM:new Map,bt:{ml:this.eM()}};if(-1!==i)this.Zw.forEach((function(i,h){s.uM.set(h,{ph:i,aM:h===t?n:void 0});})),this.Zw.has(t)||s.uM.set(t,{ph:[],aM:n}),s.bt.oM=this.Gw,s.bt.lM=i;else {var h=this.Zw.get(t);s.uM.set(t,{ph:h||[],aM:n});}return s},t}();function fs(t,i){t.vs=i,t.Yw.forEach((function(t){t.vs=i;}));}var cs={color:"#FF0000",price:0,lineStyle:2,lineWidth:1,lineVisible:!0,axisLabelVisible:!0,title:""},vs=function(){function t(t){this.Lr=t;}return t.prototype.applyOptions=function(t){this.Lr.Pr(t);},t.prototype.options=function(){return this.Lr.W()},t.prototype.fM=function(){return this.Lr},t}();function _s(t){var i=t.overlay,n=function(t,i){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&i.indexOf(s)<0&&(n[s]=t[s]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var h=0;for(s=Object.getOwnPropertySymbols(t);h<s.length;h++)i.indexOf(s[h])<0&&Object.prototype.propertyIsEnumerable.call(t,s[h])&&(n[s[h]]=t[s[h]]);}return n}(t,["overlay"]);return i&&(n.priceScaleId=""),n}var ds=function(){function t(t,i,n){this.Kn=t,this.cM=i,this.vM=n;}return t.prototype.priceFormatter=function(){return this.Kn.qe()},t.prototype.priceToCoordinate=function(t){var i=this.Kn.kt();return null===i?null:this.Kn.Ct().xt(t,i.St)},t.prototype.coordinateToPrice=function(t){var i=this.Kn.kt();return null===i?null:this.Kn.Ct().qi(t,i.St)},t.prototype.barsInLogicalRange=function(t){if(null===t)return null;var i=new nn(new Ji(t.from,t.to)).jo(),n=this.Kn.an();if(n.wi())return null;var s=n.ne(i.In(),1),h=n.ne(i.jn(),-1),r=u(n.Qr()),e=u(n.un());if(null!==s&&null!==h&&s.vs>h.vs)return {barsBefore:t.from-r,barsAfter:e-t.to};var a={barsBefore:null===s||s.vs===r?t.from-r:s.vs-r,barsAfter:null===h||h.vs===e?e-t.to:e-h.vs};return null!==s&&null!==h&&(a.from=s.rt.Co||s.rt.So,a.to=h.rt.Co||h.rt.So),a},t.prototype.setData=function(t){this.Kn.Rr(),this.cM._M(this.Kn,t);},t.prototype.update=function(t){this.Kn.Rr(),this.cM.dM(this.Kn,t);},t.prototype.setMarkers=function(t){var i=t.map((function(t){return p(p({},t),{time:rs(t.time)})}));this.Kn.Le(i);},t.prototype.applyOptions=function(t){var i=_s(t);this.Kn.Pr(i);},t.prototype.options=function(){return T(this.Kn.W())},t.prototype.priceScale=function(){return this.vM.priceScale(this.Kn.Ct().Ke())},t.prototype.createPriceLine=function(t){var i=k(T(cs),t),n=this.Kn.Ee(i);return new vs(n)},t.prototype.removePriceLine=function(t){this.Kn.Fe(t.fM());},t.prototype.seriesType=function(){return this.Kn.Rr()},t}(),ws=function(t){function i(){return null!==t&&t.apply(this,arguments)||this}return m(i,t),i.prototype.applyOptions=function(i){cn(i),t.prototype.applyOptions.call(this,i);},i}(ds),Ms={autoScale:!0,mode:0,invertScale:!1,alignLabels:!0,borderVisible:!0,borderColor:"#2B2B43",entireTextOnly:!1,visible:!1,drawTicks:!0,scaleMargins:{bottom:.1,top:.2}},bs={color:"rgba(0, 0, 0, 0)",visible:!1,fontSize:48,fontFamily:B,fontStyle:"",text:"",horzAlign:"center",vertAlign:"center"},ms={width:0,height:0,layout:{background:{type:"solid",color:"#FFFFFF"},textColor:"#191919",fontSize:11,fontFamily:B},crosshair:{vertLine:{color:"#758696",width:1,style:3,visible:!0,labelVisible:!0,labelBackgroundColor:"#4c525e"},horzLine:{color:"#758696",width:1,style:3,visible:!0,labelVisible:!0,labelBackgroundColor:"#4c525e"},mode:1},grid:{vertLines:{color:"#D6DCDE",style:0,visible:!0},horzLines:{color:"#D6DCDE",style:0,visible:!0}},overlayPriceScales:p({},Ms),leftPriceScale:p(p({},Ms),{visible:!1}),rightPriceScale:p(p({},Ms),{visible:!0}),timeScale:{rightOffset:0,barSpacing:6,minBarSpacing:.5,fixLeftEdge:!1,fixRightEdge:!1,lockVisibleTimeRangeOnResize:!1,rightBarStaysOnScroll:!1,borderVisible:!0,borderColor:"#2B2B43",visible:!0,timeVisible:!1,secondsVisible:!0,shiftVisibleRangeOnNewBar:!0},watermark:bs,localization:{locale:kn?navigator.language:"",dateFormat:"dd MMM 'yy"},handleScroll:{mouseWheel:!0,pressedMouseMove:!0,horzTouchDrag:!0,vertTouchDrag:!0},handleScale:{axisPressedMouseMove:{time:!0,price:!0},axisDoubleClickReset:!0,mouseWheel:!0,pinch:!0},kineticScroll:{mouse:!1,touch:!0},trackingMode:{exitMode:1}},ps={upColor:"#26a69a",downColor:"#ef5350",wickVisible:!0,borderVisible:!0,borderColor:"#378658",borderUpColor:"#26a69a",borderDownColor:"#ef5350",wickColor:"#737375",wickUpColor:"#26a69a",wickDownColor:"#ef5350"},gs={upColor:"#26a69a",downColor:"#ef5350",openVisible:!0,thinBars:!0},ys={color:"#2196f3",lineStyle:0,lineWidth:3,lineType:0,crosshairMarkerVisible:!0,crosshairMarkerRadius:4,crosshairMarkerBorderColor:"",crosshairMarkerBackgroundColor:"",lastPriceAnimation:0},ks={topColor:"rgba( 46, 220, 135, 0.4)",bottomColor:"rgba( 40, 221, 100, 0)",lineColor:"#33D778",lineStyle:0,lineWidth:3,lineType:0,crosshairMarkerVisible:!0,crosshairMarkerRadius:4,crosshairMarkerBorderColor:"",crosshairMarkerBackgroundColor:"",lastPriceAnimation:0},Ns={baseValue:{type:"price",price:0},topFillColor1:"rgba(38, 166, 154, 0.28)",topFillColor2:"rgba(38, 166, 154, 0.05)",topLineColor:"rgba(38, 166, 154, 1)",bottomFillColor1:"rgba(239, 83, 80, 0.05)",bottomFillColor2:"rgba(239, 83, 80, 0.28)",bottomLineColor:"rgba(239, 83, 80, 1)",lineWidth:3,lineStyle:0,crosshairMarkerVisible:!0,crosshairMarkerRadius:4,crosshairMarkerBorderColor:"",crosshairMarkerBackgroundColor:"",lastPriceAnimation:0},xs={color:"#26a69a",base:0},Cs={title:"",visible:!0,lastValueVisible:!0,priceLineVisible:!0,priceLineSource:0,priceLineWidth:1,priceLineColor:"",priceLineStyle:2,baseLineVisible:!0,baseLineWidth:1,baseLineColor:"#B2B5BE",baseLineStyle:0,priceFormat:{type:"price",precision:2,minMove:.01}},Ss=function(){function t(t,i){this.wM=t,this.MM=i;}return t.prototype.applyOptions=function(t){this.wM.jt().Nf(this.MM,t);},t.prototype.options=function(){return this._i().W()},t.prototype.width=function(){return it(this.MM)?this.wM.Fw("left"===this.MM?"left":"right"):0},t.prototype._i=function(){return u(this.wM.jt().xf(this.MM)).Ct},t}(),Ts=function(){function t(t,i){this.bM=new y,this.Go=new y,this.Zd=new y,this.pi=t,this.Da=t.bt(),this.Nw=i,this.Da.Ol().u(this.mM.bind(this)),this.Da.Vl().u(this.pM.bind(this)),this.Nw.hw().u(this.gM.bind(this));}return t.prototype.g=function(){this.Da.Ol().M(this),this.Da.Vl().M(this),this.Nw.hw().M(this),this.bM.g(),this.Go.g(),this.Zd.g();},t.prototype.scrollPosition=function(){return this.Da.Nl()},t.prototype.scrollToPosition=function(t,i){i?this.Da.Fl(t,1e3):this.pi.yn(t);},t.prototype.scrollToRealTime=function(){this.Da.El();},t.prototype.getVisibleRange=function(){var t,i,n=this.Da.cl();return null===n?null:{from:null!==(t=n.from.Co)&&void 0!==t?t:n.from.So,to:null!==(i=n.to.Co)&&void 0!==i?i:n.to.So}},t.prototype.setVisibleRange=function(t){var i={from:rs(t.from),to:rs(t.to)},n=this.Da.wl(i);this.pi.$f(n);},t.prototype.getVisibleLogicalRange=function(){var t=this.Da.fl();return null===t?null:{from:t.In(),to:t.jn()}},t.prototype.setVisibleLogicalRange=function(t){r(t.from<=t.to,"The from index cannot be after the to index."),this.pi.$f(t);},t.prototype.resetTimeScale=function(){this.pi.pn();},t.prototype.fitContent=function(){this.pi.zl();},t.prototype.logicalToCoordinate=function(t){var i=this.pi.bt();return i.wi()?null:i.At(t)},t.prototype.coordinateToLogical=function(t){return this.Da.wi()?null:this.Da.pl(t)},t.prototype.timeToCoordinate=function(t){var i=rs(t),n=this.Da.Ze(i,!1);return null===n?null:this.Da.At(n)},t.prototype.coordinateToTime=function(t){var i,n=this.pi.bt(),s=n.pl(t),h=n.gi(s);return null===h?null:null!==(i=h.Co)&&void 0!==i?i:h.So},t.prototype.width=function(){return this.Nw.Ld().Ft},t.prototype.height=function(){return this.Nw.Ld().Ot},t.prototype.subscribeVisibleTimeRangeChange=function(t){this.bM.u(t);},t.prototype.unsubscribeVisibleTimeRangeChange=function(t){this.bM._(t);},t.prototype.subscribeVisibleLogicalRangeChange=function(t){this.Go.u(t);},t.prototype.unsubscribeVisibleLogicalRangeChange=function(t){this.Go._(t);},t.prototype.subscribeSizeChange=function(t){this.Zd.u(t);},t.prototype.unsubscribeSizeChange=function(t){this.Zd._(t);},t.prototype.applyOptions=function(t){this.Da.Pr(t);},t.prototype.options=function(){return T(this.Da.W())},t.prototype.mM=function(){this.bM.p()&&this.bM.m(this.getVisibleRange());},t.prototype.pM=function(){this.Go.p()&&this.Go.m(this.getVisibleLogicalRange());},t.prototype.gM=function(t){this.Zd.m(t.Ft,t.Ot);},t}();function Ds(t){if(void 0!==t&&"custom"!==t.type){var i=t;void 0!==i.minMove&&void 0===i.precision&&(i.precision=function(t){if(t>=1)return 0;for(var i=0;i<8;i++){var n=Math.round(t);if(Math.abs(n-t)<1e-8)return i;t*=10;}return i}(i.minMove));}}function As(t){return function(t){if(S(t.handleScale)){var i=t.handleScale;t.handleScale={axisDoubleClickReset:i,axisPressedMouseMove:{time:i,price:i},mouseWheel:i,pinch:i};}else if(void 0!==t.handleScale&&S(t.handleScale.axisPressedMouseMove)){var n=t.handleScale.axisPressedMouseMove;t.handleScale.axisPressedMouseMove={time:n,price:n};}var s=t.handleScroll;S(s)&&(t.handleScroll={horzTouchDrag:s,vertTouchDrag:s,mouseWheel:s,pressedMouseMove:s});}(t),function(t){if(t.priceScale){t.leftPriceScale=t.leftPriceScale||{},t.rightPriceScale=t.rightPriceScale||{};var i=t.priceScale.position;delete t.priceScale.position,t.leftPriceScale=k(t.leftPriceScale,t.priceScale),t.rightPriceScale=k(t.rightPriceScale,t.priceScale),"left"===i&&(t.leftPriceScale.visible=!0,t.rightPriceScale.visible=!1),"right"===i&&(t.leftPriceScale.visible=!1,t.rightPriceScale.visible=!0),"none"===i&&(t.leftPriceScale.visible=!1,t.rightPriceScale.visible=!1),t.overlayPriceScales=t.overlayPriceScales||{},void 0!==t.priceScale.invertScale&&(t.overlayPriceScales.invertScale=t.priceScale.invertScale),void 0!==t.priceScale.scaleMargins&&(t.overlayPriceScales.scaleMargins=t.priceScale.scaleMargins);}}(t),function(t){t.layout&&t.layout.backgroundColor&&!t.layout.background&&(t.layout.background={type:"solid",color:t.layout.backgroundColor});}(t),t}var Bs=function(){function t(t,i){var n=this;this.yM=new ls,this.kM=new Map,this.NM=new Map,this.xM=new y,this.CM=new y;var s=void 0===i?T(ms):k(T(ms),As(i));this.wM=new qn(t,s),this.wM.Sd().u((function(t){n.xM.p()&&n.xM.m(n.SM(t()));}),this),this.wM.Df().u((function(t){n.CM.p()&&n.CM.m(n.SM(t()));}),this);var h=this.wM.jt();this.TM=new Ts(h,this.wM.Dw());}return t.prototype.remove=function(){this.wM.Sd().M(this),this.wM.Df().M(this),this.TM.g(),this.wM.g(),this.kM.clear(),this.NM.clear(),this.xM.g(),this.CM.g(),this.yM.g();},t.prototype.resize=function(t,i,n){this.wM.xw(t,i,n);},t.prototype.addAreaSeries=function(t){void 0===t&&(t={}),Ds((t=_s(t)).priceFormat);var i=k(T(Cs),ks,t),n=this.wM.jt().Uf("Area",i),s=new ds(n,this,this);return this.kM.set(s,n),this.NM.set(n,s),s},t.prototype.addBaselineSeries=function(t){void 0===t&&(t={}),Ds((t=_s(t)).priceFormat);var i=k(T(Cs),T(Ns),t),n=this.wM.jt().Uf("Baseline",i),s=new ds(n,this,this);return this.kM.set(s,n),this.NM.set(n,s),s},t.prototype.addBarSeries=function(t){void 0===t&&(t={}),Ds((t=_s(t)).priceFormat);var i=k(T(Cs),gs,t),n=this.wM.jt().Uf("Bar",i),s=new ds(n,this,this);return this.kM.set(s,n),this.NM.set(n,s),s},t.prototype.addCandlestickSeries=function(t){void 0===t&&(t={}),cn(t=_s(t)),Ds(t.priceFormat);var i=k(T(Cs),ps,t),n=this.wM.jt().Uf("Candlestick",i),s=new ws(n,this,this);return this.kM.set(s,n),this.NM.set(n,s),s},t.prototype.addHistogramSeries=function(t){void 0===t&&(t={}),Ds((t=_s(t)).priceFormat);var i=k(T(Cs),xs,t),n=this.wM.jt().Uf("Histogram",i),s=new ds(n,this,this);return this.kM.set(s,n),this.NM.set(n,s),s},t.prototype.addLineSeries=function(t){void 0===t&&(t={}),Ds((t=_s(t)).priceFormat);var i=k(T(Cs),ys,t),n=this.wM.jt().Uf("Line",i),s=new ds(n,this,this);return this.kM.set(s,n),this.NM.set(n,s),s},t.prototype.removeSeries=function(t){var i=e(this.kM.get(t)),n=this.yM.Yf(i);this.wM.jt().Yf(i),this.DM(n),this.kM.delete(t),this.NM.delete(i);},t.prototype._M=function(t,i){this.DM(this.yM.Qw(t,i));},t.prototype.dM=function(t,i){this.DM(this.yM.hM(t,i));},t.prototype.subscribeClick=function(t){this.xM.u(t);},t.prototype.unsubscribeClick=function(t){this.xM._(t);},t.prototype.subscribeCrosshairMove=function(t){this.CM.u(t);},t.prototype.unsubscribeCrosshairMove=function(t){this.CM._(t);},t.prototype.priceScale=function(t){return void 0===t&&(t=this.wM.jt().Kf()),new Ss(this.wM,t)},t.prototype.timeScale=function(){return this.TM},t.prototype.applyOptions=function(t){this.wM.Pr(As(t));},t.prototype.options=function(){return this.wM.W()},t.prototype.takeScreenshot=function(){return this.wM.Bw()},t.prototype.DM=function(t){var i=this.wM.jt();i.jf(t.bt.ml,t.bt.oM,t.bt.lM),t.uM.forEach((function(t,i){return i.Z(t.ph,t.aM)})),i.yl();},t.prototype.AM=function(t){return e(this.NM.get(t))},t.prototype.SM=function(t){var i=this,n=new Map;t.qw.forEach((function(t,s){n.set(i.AM(s),t);}));var s=void 0===t.jw?void 0:this.AM(t.jw);return {time:t.rt&&(t.rt.Co||t.rt.So),point:t.Iw,hoveredSeries:s,hoveredMarkerId:t.Uw,seriesPrices:n}},t}();function Ls(t,i){var n;if(C(t)){var s=document.getElementById(t);r(null!==s,"Cannot find element in DOM with id=".concat(t)),n=s;}else n=t;return new Bs(n,i)}

    function msToString(timeMs) {
        return `${Math.floor(timeMs / 1000 / 60)}:${Math.floor((timeMs / 1000) % 60)}.${timeMs % 1000}`;
    }

    //данный лист заполняется согласно ListBox Sensors_select
    var SensorType;
    (function (SensorType) {
        SensorType[SensorType["TempSensor"] = 0] = "TempSensor";
        SensorType[SensorType["AbsolutePressureSensor"] = 1] = "AbsolutePressureSensor";
        SensorType[SensorType["TeslameterSensor"] = 2] = "TeslameterSensor";
        SensorType[SensorType["VoltmeterSensor"] = 3] = "VoltmeterSensor";
        SensorType[SensorType["AmpermetrSensor"] = 4] = "AmpermetrSensor";
        SensorType[SensorType["AccelerometerXSensor"] = 5] = "AccelerometerXSensor";
        SensorType[SensorType["AccelerometerYSensor"] = 6] = "AccelerometerYSensor";
        SensorType[SensorType["AccelerometerZSensor"] = 7] = "AccelerometerZSensor";
        SensorType[SensorType["ElectricalConductivitySensor"] = 8] = "ElectricalConductivitySensor";
        SensorType[SensorType["HumiditySensor"] = 9] = "HumiditySensor";
        SensorType[SensorType["LightSensor"] = 10] = "LightSensor";
        SensorType[SensorType["TempOutsideSensor"] = 11] = "TempOutsideSensor";
        SensorType[SensorType["ColorimeterSensor"] = 12] = "ColorimeterSensor";
        SensorType[SensorType["PhSensor"] = 13] = "PhSensor";
    })(SensorType || (SensorType = {}));

    class SensorMode {
        constructor(minValue, maxValue, unit) {
            this.minValue = minValue;
            this.maxValue = maxValue;
            this.unit = unit;
        }
        toString() {
            return `${this.minValue}...${this.maxValue} ${this.unit}`;
        }
    }
    SensorMode.Disabled = new SensorMode(0, 0, '');
    const SENSORS_PREFERENCES = new Map([
        [SensorType.TempSensor, {
                accuracy: 1,
                name: "Датчик T эксп.",
                ico: "/sensors/Temp_1.png",
                modes: [
                    new SensorMode(-40, 165, "°С"),
                ]
            }],
        [SensorType.AbsolutePressureSensor, {
                accuracy: 1,
                name: "Датчик P абс.",
                ico: "/sensors/Pressure.png",
                modes: [
                    new SensorMode(0, 500, "кПа"),
                ]
            }],
        [SensorType.TeslameterSensor, {
                accuracy: 1,
                name: "Тесламетр",
                ico: "/sensors/Tesla.png",
                modes: [
                    new SensorMode(-100, 100, "мЛт"),
                ]
            }],
        [SensorType.VoltmeterSensor, {
                accuracy: 3,
                name: "Вольтметр",
                ico: "/sensors/Voltage.png",
                modes: [
                    new SensorMode(-15, 15, "В"),
                ]
            }],
        [SensorType.AmpermetrSensor, {
                accuracy: 3,
                name: "Амперметр",
                ico: "/sensors/Amper.png",
                modes: [
                    new SensorMode(-1, 1, "A"),
                ]
            }],
        [SensorType.AccelerometerXSensor, {
                accuracy: 3,
                name: "Датчик ускорения. Ось Х",
                ico: "/sensors/Accelerometr.png",
                modes: [
                    new SensorMode(-2, 2, "g"),
                    new SensorMode(-4, 4, "g"),
                    new SensorMode(-8, 8, "g"),
                    new SensorMode(-16, 16, "g"),
                ]
            }],
        [SensorType.AccelerometerYSensor, {
                accuracy: 3,
                name: "Датчик ускорения. Ось Y",
                ico: "/sensors/Accelerometr.png",
                modes: [
                    new SensorMode(-2, 2, "g"),
                    new SensorMode(-4, 4, "g"),
                    new SensorMode(-8, 8, "g"),
                    new SensorMode(-16, 16, "g"),
                ]
            }],
        [SensorType.AccelerometerZSensor, {
                accuracy: 3,
                name: "Датчик ускорения. Ось Z",
                ico: "/sensors/Accelerometr.png",
                modes: [
                    new SensorMode(-2, 2, "g"),
                    new SensorMode(-4, 4, "g"),
                    new SensorMode(-8, 8, "g"),
                    new SensorMode(-16, 16, "g"),
                ]
            }],
        [SensorType.ElectricalConductivitySensor, {
                accuracy: 1,
                name: "Датчик электропроводимости",
                ico: "/sensors/Electrical_conduct.png",
                modes: [
                    SensorMode.Disabled,
                    new SensorMode(0, 200, "мкСм/см"),
                    new SensorMode(0, 2000, "мкСм/см"),
                    new SensorMode(0, 20000, "мкСм/см"),
                ]
            }],
        [SensorType.HumiditySensor, {
                accuracy: 1,
                name: "Датчик влажности",
                ico: "/sensors/Humidity.png",
                modes: [
                    new SensorMode(0, 100, "%"),
                ]
            }],
        [SensorType.LightSensor, {
                accuracy: 0,
                name: "Датчик освещенности",
                ico: "/sensors/Illumination.png",
                modes: [
                    new SensorMode(0, 180000, "лк"),
                ]
            }],
        [SensorType.TempOutsideSensor, {
                accuracy: 1,
                name: "Датчик Т окр.",
                ico: "/sensors/Temp_2.png",
                modes: [
                    new SensorMode(-40, 60, "°С"),
                ]
            }],
        [SensorType.ColorimeterSensor, {
                accuracy: 2,
                name: "Колориметр",
                ico: "/sensors/Colorimeter.png",
                modes: [
                    new SensorMode(0, 2, "D"),
                ]
            }],
        [SensorType.PhSensor, {
                accuracy: 2,
                name: "Датчик pH",
                ico: "/sensors/pH.png",
                modes: [
                    new SensorMode(0, 14, "pH"),
                ]
            }],
    ]);

    const defaultCoefficients = {
        factoryK: 1,
        factoryD: 0,
        userK: 1,
        userD: 0,
    };
    function applyCoefficients(value, coefficients) {
        const coefs = Object.assign(Object.assign({}, defaultCoefficients), coefficients);
        const factory = value * coefs.factoryK + coefs.factoryD;
        return factory * coefs.userK + coefs.userD;
    }
    function round(value, accuracy) {
        const multiplier = Math.pow(10, accuracy);
        return Math.floor(value * multiplier) / multiplier;
    }

    const chartColors = [
        '#CB4335',
        '#9B59B6',
        '#85C1E9',
        '#76D7C4',
        '#D4AC0D',
        '#A04000',
        '#FF00CC',
    ];

    /* src\components\ArchiveChart.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$1, console: console_1$2 } = globals;
    const file$k = "src\\components\\ArchiveChart.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    // (138:8) {#each archiveValues.sensorsArchiveValues as sensorValues, i}
    function create_each_block_1$3(ctx) {
    	let span;
    	let t0_value = SENSORS_PREFERENCES.get(/*sensorValues*/ ctx[26].sensorType).name + "";
    	let t0;
    	let t1;
    	let input;
    	let t2;
    	let br;
    	let mounted;
    	let dispose;

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[17](/*i*/ ctx[28], ...args);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			br = element("br");
    			set_style(span, "color", /*getColor*/ ctx[10](/*i*/ ctx[28]), false);
    			add_location(span, file$k, 138, 12, 4877);
    			attr_dev(input, "class", "legend__checkbox svelte-s6sm94");
    			attr_dev(input, "type", "checkbox");
    			input.checked = true;
    			add_location(input, file$k, 139, 12, 4984);
    			add_location(br, file$k, 140, 12, 5112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", change_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*archiveValues*/ 1 && t0_value !== (t0_value = SENSORS_PREFERENCES.get(/*sensorValues*/ ctx[26].sensorType).name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(138:8) {#each archiveValues.sensorsArchiveValues as sensorValues, i}",
    		ctx
    	});

    	return block;
    }

    // (149:16) {#if crosshairValues[i] !== null}
    function create_if_block$8(ctx) {
    	let span;
    	let t0_value = SENSORS_PREFERENCES.get(/*sensorValues*/ ctx[26].sensorType).name + "";
    	let t0;
    	let t1;
    	let t2_value = /*crosshairValues*/ ctx[6][/*i*/ ctx[28]] + "";
    	let t2;
    	let t3;
    	let t4_value = /*sensorValues*/ ctx[26].unit + "";
    	let t4;
    	let br;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			br = element("br");
    			set_style(span, "color", /*getColor*/ ctx[10](/*i*/ ctx[28]), false);
    			add_location(span, file$k, 149, 20, 5588);
    			add_location(br, file$k, 149, 156, 5724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*archiveValues*/ 1 && t0_value !== (t0_value = SENSORS_PREFERENCES.get(/*sensorValues*/ ctx[26].sensorType).name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*crosshairValues*/ 64 && t2_value !== (t2_value = /*crosshairValues*/ ctx[6][/*i*/ ctx[28]] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*archiveValues*/ 1 && t4_value !== (t4_value = /*sensorValues*/ ctx[26].unit + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(149:16) {#if crosshairValues[i] !== null}",
    		ctx
    	});

    	return block;
    }

    // (148:12) {#each archiveValues.sensorsArchiveValues as sensorValues, i}
    function create_each_block$5(ctx) {
    	let if_block_anchor;
    	let if_block = /*crosshairValues*/ ctx[6][/*i*/ ctx[28]] !== null && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*crosshairValues*/ ctx[6][/*i*/ ctx[28]] !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(148:12) {#each archiveValues.sensorsArchiveValues as sensorValues, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let span0;
    	let t2;
    	let br0;
    	let t3;
    	let t4;
    	let br1;
    	let t5;
    	let span1;
    	let t6_value = strings$1.chartCrosshairTime + "";
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10_value = strings$1.timeFormat + "";
    	let t10;
    	let t11;
    	let div1_hidden_value;
    	let style_top = `${/*crosshairLabelOffsetY*/ ctx[4]}px`;
    	let t12;
    	let div3;
    	let each_value_1 = /*archiveValues*/ ctx[0].sensorsArchiveValues;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*archiveValues*/ ctx[0].sensorsArchiveValues;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = `${strings$1.chartCrosshairValues}`;
    			t2 = space();
    			br0 = element("br");
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			span1 = element("span");
    			t6 = text(t6_value);
    			t7 = space();
    			t8 = text(/*crosshairCurrentTime*/ ctx[3]);
    			t9 = text(" [");
    			t10 = text(t10_value);
    			t11 = text("]");
    			t12 = space();
    			div3 = element("div");
    			div3.textContent = `${/*labelX*/ ctx[9]}`;
    			attr_dev(div0, "class", "legend svelte-s6sm94");
    			add_location(div0, file$k, 136, 4, 4774);
    			add_location(span0, file$k, 146, 12, 5394);
    			add_location(br0, file$k, 146, 57, 5439);
    			add_location(br1, file$k, 152, 12, 5783);
    			add_location(span1, file$k, 153, 12, 5800);
    			attr_dev(div1, "class", "crosshair-label");
    			div1.hidden = div1_hidden_value = !/*crosshairLabelVisible*/ ctx[5];
    			set_style(div1, "top", style_top, false);
    			set_style(div1, "left", /*crosshairLeftOffset*/ ctx[8], false);
    			set_style(div1, "right", /*crosshairRightOffset*/ ctx[7], false);
    			add_location(div1, file$k, 144, 8, 5201);
    			attr_dev(div2, "class", "chart");
    			add_location(div2, file$k, 143, 4, 5148);
    			attr_dev(div3, "class", "chart-label chart-label-x");
    			add_location(div3, file$k, 156, 4, 5918);
    			attr_dev(div4, "class", "chart-wrapper svelte-s6sm94");
    			toggle_class(div4, "hidden", !/*isVisible*/ ctx[1]);
    			add_location(div4, file$k, 135, 0, 4716);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t4);
    			append_dev(div1, br1);
    			append_dev(div1, t5);
    			append_dev(div1, span1);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    			append_dev(span1, t8);
    			append_dev(span1, t9);
    			append_dev(span1, t10);
    			append_dev(span1, t11);
    			/*div2_binding*/ ctx[18](div2);
    			append_dev(div4, t12);
    			append_dev(div4, div3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*setChartVisible, getColor, SENSORS_PREFERENCES, archiveValues*/ 3073) {
    				each_value_1 = /*archiveValues*/ ctx[0].sensorsArchiveValues;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*getColor, archiveValues, crosshairValues, SENSORS_PREFERENCES*/ 1089) {
    				each_value = /*archiveValues*/ ctx[0].sensorsArchiveValues;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*crosshairCurrentTime*/ 8) set_data_dev(t8, /*crosshairCurrentTime*/ ctx[3]);

    			if (dirty & /*crosshairLabelVisible*/ 32 && div1_hidden_value !== (div1_hidden_value = !/*crosshairLabelVisible*/ ctx[5])) {
    				prop_dev(div1, "hidden", div1_hidden_value);
    			}

    			if (dirty & /*crosshairLabelOffsetY*/ 16 && style_top !== (style_top = `${/*crosshairLabelOffsetY*/ ctx[4]}px`)) {
    				set_style(div1, "top", style_top, false);
    			}

    			if (dirty & /*crosshairLeftOffset*/ 256) {
    				set_style(div1, "left", /*crosshairLeftOffset*/ ctx[8], false);
    			}

    			if (dirty & /*crosshairRightOffset*/ 128) {
    				set_style(div1, "right", /*crosshairRightOffset*/ ctx[7], false);
    			}

    			if (dirty & /*isVisible*/ 2) {
    				toggle_class(div4, "hidden", !/*isVisible*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*div2_binding*/ ctx[18](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let crosshairLabelRight;
    	let crosshairLeftOffset;
    	let crosshairRightOffset;
    	let numberOfVisiblePoints;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArchiveChart', slots, []);
    	let { archiveValues } = $$props;
    	let { isVisible = true } = $$props;

    	// Internal
    	let chartElement;

    	let timeScale = undefined;
    	let chart;
    	let lineSeriesList = [];
    	const labelX = strings$1.time;
    	let crosshairCurrentValues = "";
    	let crosshairCurrentTime = "";
    	let crosshairLabelOffsetX = 0;
    	let crosshairLabelOffsetY = 0;
    	let crosshairLabelVisible = false;
    	let crosshairValues = [];

    	onMount(() => {
    		chart = Ls(chartElement, {
    			crosshair: { vertLine: { labelVisible: false } },
    			rightPriceScale: {
    				scaleMargins: { top: 0.01, bottom: 0.01 }
    			}
    		});

    		timeScale = chart.timeScale();

    		timeScale.applyOptions({
    			timeVisible: true,
    			secondsVisible: true,
    			tickMarkFormatter: msToString
    		});

    		resetZoom();

    		archiveValues.sensorsArchiveValues.forEach((sensorValue, sensorIdx) => {
    			const lineSeries = chart.addLineSeries({
    				lastValueVisible: false,
    				color: getColor(sensorIdx),
    				lineWidth: 2
    			});

    			const data = sensorValue.values.map((val, valueIdx) => {
    				return {
    					time: archiveValues.time[valueIdx],
    					value: val
    				};
    			}).filter(point => point.value != null);

    			console.log(data);
    			lineSeries.setData(data);

    			// lineSeries.setMarkers(data.map(d => {
    			//     console.log(d)
    			//     return getMarker(d.time, getColor(sensorIdx))
    			// }))
    			lineSeriesList[sensorIdx] = lineSeries;
    		});

    		chart.subscribeCrosshairMove(event => {
    			$$invalidate(5, crosshairLabelVisible = event.time && event.seriesPrices.size > 0);
    			if (!crosshairLabelVisible) return;

    			lineSeriesList.forEach((lineSeries, i) => {
    				if (!lineSeries.options().visible) {
    					$$invalidate(6, crosshairValues[i] = null, crosshairValues);
    					return;
    				}

    				const sensor = archiveValues.sensorsArchiveValues[i];
    				const prefs = SENSORS_PREFERENCES.get(sensor.sensorType);
    				$$invalidate(6, crosshairValues[i] = round(event.seriesPrices.get(lineSeries), prefs.accuracy), crosshairValues);
    			});

    			$$invalidate(3, crosshairCurrentTime = msToString(event.time));
    			$$invalidate(15, crosshairLabelOffsetX = event.point.x);
    			$$invalidate(4, crosshairLabelOffsetY = event.point.y);
    		});

    		const onResize = () => {
    			chart.resize(chartElement.clientWidth, chartElement.clientHeight, true);
    		};

    		window.addEventListener('resize', onResize);

    		return () => {
    			chart.remove();
    			window.removeEventListener('resize', onResize);
    		};
    	});

    	const defaultMarker = {
    		time: 0,
    		position: 'inBar',
    		color: "red",
    		shape: 'circle',
    		size: 0.5
    	};

    	function getMarker(time, color) {
    		return Object.assign(Object.assign({}, defaultMarker), { time, color });
    	}

    	function getColor(sensorIdx) {
    		return chartColors[sensorIdx % chartColors.length];
    	}

    	function setChartVisible(index, isVisible) {
    		lineSeriesList[index].applyOptions({ visible: isVisible });
    	}

    	function zoomIn() {
    		const range = timeScale.getVisibleLogicalRange();
    		const step = range.to / 10;
    		range.to -= step;
    		range.from += step;
    		if (range.to < range.from) return;
    		timeScale.setVisibleLogicalRange(range);
    	}

    	function zoomOut() {
    		const range = timeScale.getVisibleLogicalRange();
    		const step = range.to / 10;
    		range.to += step;
    		range.from -= step;
    		timeScale.setVisibleLogicalRange(range);
    	}

    	function resetZoom() {
    		const margin = numberOfVisiblePoints / 50;

    		timeScale.setVisibleLogicalRange({
    			from: -margin,
    			to: numberOfVisiblePoints + margin
    		});
    	}

    	const writable_props = ['archiveValues', 'isVisible'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<ArchiveChart> was created with unknown prop '${key}'`);
    	});

    	const change_handler = (i, e) => {
    		setChartVisible(i, e.target.checked);
    	};

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chartElement = $$value;
    			$$invalidate(2, chartElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('archiveValues' in $$props) $$invalidate(0, archiveValues = $$props.archiveValues);
    		if ('isVisible' in $$props) $$invalidate(1, isVisible = $$props.isVisible);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createChart: Ls,
    		msToString,
    		strings: strings$1,
    		SENSORS_PREFERENCES,
    		round,
    		chartColors,
    		archiveValues,
    		isVisible,
    		chartElement,
    		timeScale,
    		chart,
    		lineSeriesList,
    		labelX,
    		crosshairCurrentValues,
    		crosshairCurrentTime,
    		crosshairLabelOffsetX,
    		crosshairLabelOffsetY,
    		crosshairLabelVisible,
    		crosshairValues,
    		defaultMarker,
    		getMarker,
    		getColor,
    		setChartVisible,
    		zoomIn,
    		zoomOut,
    		resetZoom,
    		numberOfVisiblePoints,
    		crosshairLabelRight,
    		crosshairRightOffset,
    		crosshairLeftOffset
    	});

    	$$self.$inject_state = $$props => {
    		if ('archiveValues' in $$props) $$invalidate(0, archiveValues = $$props.archiveValues);
    		if ('isVisible' in $$props) $$invalidate(1, isVisible = $$props.isVisible);
    		if ('chartElement' in $$props) $$invalidate(2, chartElement = $$props.chartElement);
    		if ('timeScale' in $$props) timeScale = $$props.timeScale;
    		if ('chart' in $$props) chart = $$props.chart;
    		if ('lineSeriesList' in $$props) lineSeriesList = $$props.lineSeriesList;
    		if ('crosshairCurrentValues' in $$props) crosshairCurrentValues = $$props.crosshairCurrentValues;
    		if ('crosshairCurrentTime' in $$props) $$invalidate(3, crosshairCurrentTime = $$props.crosshairCurrentTime);
    		if ('crosshairLabelOffsetX' in $$props) $$invalidate(15, crosshairLabelOffsetX = $$props.crosshairLabelOffsetX);
    		if ('crosshairLabelOffsetY' in $$props) $$invalidate(4, crosshairLabelOffsetY = $$props.crosshairLabelOffsetY);
    		if ('crosshairLabelVisible' in $$props) $$invalidate(5, crosshairLabelVisible = $$props.crosshairLabelVisible);
    		if ('crosshairValues' in $$props) $$invalidate(6, crosshairValues = $$props.crosshairValues);
    		if ('numberOfVisiblePoints' in $$props) numberOfVisiblePoints = $$props.numberOfVisiblePoints;
    		if ('crosshairLabelRight' in $$props) $$invalidate(16, crosshairLabelRight = $$props.crosshairLabelRight);
    		if ('crosshairRightOffset' in $$props) $$invalidate(7, crosshairRightOffset = $$props.crosshairRightOffset);
    		if ('crosshairLeftOffset' in $$props) $$invalidate(8, crosshairLeftOffset = $$props.crosshairLeftOffset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*crosshairLabelOffsetX, chartElement*/ 32772) {
    			$$invalidate(16, crosshairLabelRight = crosshairLabelOffsetX < (chartElement === null || chartElement === void 0
    			? void 0
    			: chartElement.clientWidth) / 2);
    		}

    		if ($$self.$$.dirty & /*crosshairLabelRight, crosshairLabelOffsetX*/ 98304) {
    			$$invalidate(8, crosshairLeftOffset = crosshairLabelRight ? crosshairLabelOffsetX + 'px' : '');
    		}

    		if ($$self.$$.dirty & /*crosshairLabelRight, chartElement, crosshairLabelOffsetX*/ 98308) {
    			$$invalidate(7, crosshairRightOffset = crosshairLabelRight
    			? ''
    			: (chartElement === null || chartElement === void 0
    				? void 0
    				: chartElement.clientWidth) - crosshairLabelOffsetX + "px");
    		}

    		if ($$self.$$.dirty & /*archiveValues*/ 1) {
    			numberOfVisiblePoints = archiveValues.time.length;
    		}
    	};

    	return [
    		archiveValues,
    		isVisible,
    		chartElement,
    		crosshairCurrentTime,
    		crosshairLabelOffsetY,
    		crosshairLabelVisible,
    		crosshairValues,
    		crosshairRightOffset,
    		crosshairLeftOffset,
    		labelX,
    		getColor,
    		setChartVisible,
    		zoomIn,
    		zoomOut,
    		resetZoom,
    		crosshairLabelOffsetX,
    		crosshairLabelRight,
    		change_handler,
    		div2_binding
    	];
    }

    class ArchiveChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			archiveValues: 0,
    			isVisible: 1,
    			zoomIn: 12,
    			zoomOut: 13,
    			resetZoom: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArchiveChart",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*archiveValues*/ ctx[0] === undefined && !('archiveValues' in props)) {
    			console_1$2.warn("<ArchiveChart> was created without expected prop 'archiveValues'");
    		}
    	}

    	get archiveValues() {
    		throw new Error("<ArchiveChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set archiveValues(value) {
    		throw new Error("<ArchiveChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVisible() {
    		throw new Error("<ArchiveChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVisible(value) {
    		throw new Error("<ArchiveChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zoomIn() {
    		return this.$$.ctx[12];
    	}

    	set zoomIn(value) {
    		throw new Error("<ArchiveChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zoomOut() {
    		return this.$$.ctx[13];
    	}

    	set zoomOut(value) {
    		throw new Error("<ArchiveChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetZoom() {
    		return this.$$.ctx[14];
    	}

    	set resetZoom(value) {
    		throw new Error("<ArchiveChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DataTable.svelte generated by Svelte v3.48.0 */
    const file$j = "src\\components\\DataTable.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (38:16) {#each headers as header}
    function create_each_block_2$1(ctx) {
    	let td;
    	let t_value = /*header*/ ctx[16] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$j, 38, 20, 912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*headers*/ 2 && t_value !== (t_value = /*header*/ ctx[16] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(38:16) {#each headers as header}",
    		ctx
    	});

    	return block;
    }

    // (51:24) {:else }
    function create_else_block$2(ctx) {
    	let td;
    	let t_value = /*cell*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$j, 51, 28, 1415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paused, rowsSnapshot, rows*/ 25 && t_value !== (t_value = /*cell*/ ctx[13] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(51:24) {:else }",
    		ctx
    	});

    	return block;
    }

    // (49:49) 
    function create_if_block_1$3(ctx) {
    	let td;
    	let t_value = msToString(/*cell*/ ctx[13]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$j, 49, 28, 1326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paused, rowsSnapshot, rows*/ 25 && t_value !== (t_value = msToString(/*cell*/ ctx[13]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(49:49) ",
    		ctx
    	});

    	return block;
    }

    // (47:24) {#if (cell == null)}
    function create_if_block$7(ctx) {
    	let td;

    	const block = {
    		c: function create() {
    			td = element("td");
    			td.textContent = `${strings$1.noData}`;
    			add_location(td, file$j, 47, 28, 1222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(47:24) {#if (cell == null)}",
    		ctx
    	});

    	return block;
    }

    // (46:20) {#each row as cell, colIdx}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*cell*/ ctx[13] == null) return create_if_block$7;
    		if (/*colIdx*/ ctx[15] === 0) return create_if_block_1$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(46:20) {#each row as cell, colIdx}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {#each (paused ? rowsSnapshot : rows) as row (row[0])}
    function create_each_block$4(key_1, ctx) {
    	let tr;
    	let t;
    	let each_value_1 = /*row*/ ctx[10];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$j, 44, 16, 1096);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*strings, paused, rowsSnapshot, rows, msToString*/ 25) {
    				each_value_1 = /*row*/ ctx[10];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(44:12) {#each (paused ? rowsSnapshot : rows) as row (row[0])}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let t;
    	let tbody;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let each_value_2 = /*headers*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value = /*paused*/ ctx[3]
    	? /*rowsSnapshot*/ ctx[4]
    	: /*rows*/ ctx[0];

    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[10][0];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$j, 36, 12, 845);
    			add_location(thead, file$j, 35, 12, 825);
    			add_location(tbody, file$j, 42, 12, 1005);
    			add_location(table, file$j, 34, 8, 805);
    			attr_dev(div0, "class", "scroll");
    			add_location(div0, file$j, 32, 4, 775);
    			attr_dev(div1, "class", "table-wrapper");
    			toggle_class(div1, "hidden", !/*isVisible*/ ctx[2]);
    			add_location(div1, file$j, 31, 0, 717);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*headers*/ 2) {
    				each_value_2 = /*headers*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*paused, rowsSnapshot, rows, strings, msToString*/ 25) {
    				each_value = /*paused*/ ctx[3]
    				? /*rowsSnapshot*/ ctx[4]
    				: /*rows*/ ctx[0];

    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each1_lookup, tbody, destroy_block, create_each_block$4, null, get_each_context$4);
    			}

    			if (dirty & /*isVisible*/ 4) {
    				toggle_class(div1, "hidden", !/*isVisible*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DataTable', slots, []);
    	let { rows = [] } = $$props;
    	let { headers = [] } = $$props;
    	let { isVisible = true } = $$props;

    	// Internal
    	let tempRows = [];

    	let paused = false;
    	let rowsSnapshot = [];

    	function addRow(newRow) {
    		$$invalidate(0, rows = [newRow, ...rows]);
    	}

    	function pause() {
    		$$invalidate(4, rowsSnapshot = rows.slice());
    		$$invalidate(3, paused = true);
    	}

    	function start() {
    		$$invalidate(0, rows = [...tempRows.reverse(), ...rows]);
    		$$invalidate(4, rowsSnapshot = []);
    		$$invalidate(3, paused = false);
    	}

    	function getRowsSnapshot() {
    		return paused ? rowsSnapshot : rows.slice();
    	}

    	const writable_props = ['rows', 'headers', 'isVisible'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DataTable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('rows' in $$props) $$invalidate(0, rows = $$props.rows);
    		if ('headers' in $$props) $$invalidate(1, headers = $$props.headers);
    		if ('isVisible' in $$props) $$invalidate(2, isVisible = $$props.isVisible);
    	};

    	$$self.$capture_state = () => ({
    		strings: strings$1,
    		msToString,
    		rows,
    		headers,
    		isVisible,
    		tempRows,
    		paused,
    		rowsSnapshot,
    		addRow,
    		pause,
    		start,
    		getRowsSnapshot
    	});

    	$$self.$inject_state = $$props => {
    		if ('rows' in $$props) $$invalidate(0, rows = $$props.rows);
    		if ('headers' in $$props) $$invalidate(1, headers = $$props.headers);
    		if ('isVisible' in $$props) $$invalidate(2, isVisible = $$props.isVisible);
    		if ('tempRows' in $$props) tempRows = $$props.tempRows;
    		if ('paused' in $$props) $$invalidate(3, paused = $$props.paused);
    		if ('rowsSnapshot' in $$props) $$invalidate(4, rowsSnapshot = $$props.rowsSnapshot);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		rows,
    		headers,
    		isVisible,
    		paused,
    		rowsSnapshot,
    		addRow,
    		pause,
    		start,
    		getRowsSnapshot
    	];
    }

    class DataTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			rows: 0,
    			headers: 1,
    			isVisible: 2,
    			addRow: 5,
    			pause: 6,
    			start: 7,
    			getRowsSnapshot: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DataTable",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get rows() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headers() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVisible() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVisible(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addRow() {
    		return this.$$.ctx[5];
    	}

    	set addRow(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pause() {
    		return this.$$.ctx[6];
    	}

    	set pause(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		return this.$$.ctx[7];
    	}

    	set start(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getRowsSnapshot() {
    		return this.$$.ctx[8];
    	}

    	set getRowsSnapshot(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function rowsToColumns(rows) {
        const colCount = rows[0].length;
        const result = Array(colCount);
        for (let colIdx = 0; colIdx < colCount; colIdx++) {
            result[colIdx] = rows.map(r => r[colIdx]);
        }
        return result;
    }
    function columnsToRows(columns) {
        const rowCount = columns[0].length;
        const result = Array(rowCount);
        for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
            result[rowIdx] = columns.map(r => r[rowIdx]);
        }
        return result;
    }

    /* src\views\SavedDataView.svelte generated by Svelte v3.48.0 */
    const file$i = "src\\views\\SavedDataView.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (56:28) {#each tableHeaders as header}
    function create_each_block_2(ctx) {
    	let td;
    	let t_value = /*header*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$i, 56, 32, 2110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(56:28) {#each tableHeaders as header}",
    		ctx
    	});

    	return block;
    }

    // (69:36) {:else }
    function create_else_block$1(ctx) {
    	let td;
    	let t_value = /*cell*/ ctx[12] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$i, 69, 40, 2743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(69:36) {:else }",
    		ctx
    	});

    	return block;
    }

    // (67:61) 
    function create_if_block_1$2(ctx) {
    	let td;
    	let t_value = msToString(/*cell*/ ctx[12]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$i, 67, 40, 2630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(67:61) ",
    		ctx
    	});

    	return block;
    }

    // (65:36) {#if (cell == null)}
    function create_if_block$6(ctx) {
    	let td;

    	const block = {
    		c: function create() {
    			td = element("td");
    			td.textContent = `${strings$1.noData}`;
    			add_location(td, file$i, 65, 40, 2502);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(65:36) {#if (cell == null)}",
    		ctx
    	});

    	return block;
    }

    // (64:32) {#each row as cell, colIdx}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*cell*/ ctx[12] == null) return create_if_block$6;
    		if (/*colIdx*/ ctx[14] === 0) return create_if_block_1$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(64:32) {#each row as cell, colIdx}",
    		ctx
    	});

    	return block;
    }

    // (62:24) {#each rows as row (row[0])}
    function create_each_block$3(key_1, ctx) {
    	let tr;
    	let t;
    	let each_value_1 = /*row*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$i, 62, 28, 2340);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*strings, rows, msToString*/ 32) {
    				each_value_1 = /*row*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(62:24) {#each rows as row (row[0])}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let main;
    	let header;
    	let div0;
    	let span;
    	let t1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let hr;
    	let t3;
    	let div5;
    	let div3;
    	let archivechart;
    	let t4;
    	let div2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let t5;
    	let tbody;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let t6;
    	let div4;
    	let button0;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let button1;
    	let img2;
    	let img2_src_value;
    	let button1_disabled_value;
    	let t8;
    	let button2;
    	let img3;
    	let img3_src_value;
    	let button2_disabled_value;
    	let t9;
    	let button3;
    	let img4;
    	let img4_src_value;
    	let button3_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	let archivechart_props = {
    		archiveValues: /*archiveValues*/ ctx[0],
    		isVisible: /*dataDisplay*/ ctx[1] === DataDisplay.Graphics
    	};

    	archivechart = new ArchiveChart({
    			props: archivechart_props,
    			$$inline: true
    		});

    	/*archivechart_binding*/ ctx[6](archivechart);
    	let each_value_2 = /*tableHeaders*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*rows*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[9][0];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = `${strings$1.workWithSavedData}`;
    			t1 = space();
    			img0 = element("img");
    			t2 = space();
    			hr = element("hr");
    			t3 = space();
    			div5 = element("div");
    			div3 = element("div");
    			create_component(archivechart.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div4 = element("div");
    			button0 = element("button");
    			img1 = element("img");
    			t7 = space();
    			button1 = element("button");
    			img2 = element("img");
    			t8 = space();
    			button2 = element("button");
    			img3 = element("img");
    			t9 = space();
    			button3 = element("button");
    			img4 = element("img");
    			attr_dev(span, "class", "header__title svelte-1s9n8ud");
    			add_location(span, file$i, 36, 12, 1372);
    			attr_dev(div0, "class", "row");
    			add_location(div0, file$i, 35, 8, 1342);
    			attr_dev(img0, "class", "header-icon svelte-1s9n8ud");
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Logging.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$i, 41, 8, 1489);
    			attr_dev(header, "class", "row w-full align-center justify-between svelte-1s9n8ud");
    			add_location(header, file$i, 34, 4, 1277);
    			attr_dev(hr, "class", "header-divider svelte-1s9n8ud");
    			add_location(hr, file$i, 43, 4, 1563);
    			add_location(tr, file$i, 54, 24, 2014);
    			add_location(thead, file$i, 53, 24, 1982);
    			add_location(tbody, file$i, 60, 24, 2251);
    			add_location(table, file$i, 52, 20, 1950);
    			attr_dev(div1, "class", "scroll");
    			add_location(div1, file$i, 50, 16, 1908);
    			attr_dev(div2, "class", "table-wrapper");
    			toggle_class(div2, "hidden", /*dataDisplay*/ ctx[1] !== DataDisplay.Measures);
    			add_location(div2, file$i, 49, 12, 1812);
    			attr_dev(div3, "class", "chart svelte-1s9n8ud");
    			add_location(div3, file$i, 45, 8, 1628);

    			if (!src_url_equal(img1.src, img1_src_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures
    			? "/img/ico_measure.png"
    			: "/img/ico_graphics.png")) attr_dev(img1, "src", img1_src_value);

    			add_location(img1, file$i, 83, 16, 3170);
    			attr_dev(button0, "class", "measure-graphics");
    			add_location(button0, file$i, 82, 12, 3087);
    			if (!src_url_equal(img2.src, img2_src_value = "/img/ico_zoom.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "zoom");
    			add_location(img2, file$i, 86, 16, 3404);
    			button1.disabled = button1_disabled_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures;
    			add_location(button1, file$i, 85, 12, 3304);
    			if (!src_url_equal(img3.src, img3_src_value = "/img/ico_zoom_out.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "zoom_out");
    			add_location(img3, file$i, 89, 16, 3577);
    			button2.disabled = button2_disabled_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures;
    			add_location(button2, file$i, 88, 12, 3479);
    			if (!src_url_equal(img4.src, img4_src_value = "/img/ico_zoom_in.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "zoom_in");
    			add_location(img4, file$i, 92, 16, 3757);
    			button3.disabled = button3_disabled_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures;
    			add_location(button3, file$i, 91, 12, 3660);
    			attr_dev(div4, "class", "controls control-buttons svelte-1s9n8ud");
    			add_location(div4, file$i, 81, 8, 3036);
    			attr_dev(div5, "class", "work-zone svelte-1s9n8ud");
    			add_location(div5, file$i, 44, 4, 1596);
    			attr_dev(main, "class", "column content-wrapper svelte-1s9n8ud");
    			add_location(main, file$i, 33, 0, 1235);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, div0);
    			append_dev(div0, span);
    			append_dev(header, t1);
    			append_dev(header, img0);
    			append_dev(main, t2);
    			append_dev(main, hr);
    			append_dev(main, t3);
    			append_dev(main, div5);
    			append_dev(div5, div3);
    			mount_component(archivechart, div3, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t5);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			append_dev(button0, img1);
    			append_dev(div4, t7);
    			append_dev(div4, button1);
    			append_dev(button1, img2);
    			append_dev(div4, t8);
    			append_dev(div4, button2);
    			append_dev(button2, img3);
    			append_dev(div4, t9);
    			append_dev(div4, button3);
    			append_dev(button3, img4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggleMeasureGraphics*/ ctx[3], false, false, false),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*chart*/ ctx[2].resetZoom)) /*chart*/ ctx[2].resetZoom.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*chart*/ ctx[2].zoomOut)) /*chart*/ ctx[2].zoomOut.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*chart*/ ctx[2].zoomIn)) /*chart*/ ctx[2].zoomIn.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const archivechart_changes = {};
    			if (dirty & /*archiveValues*/ 1) archivechart_changes.archiveValues = /*archiveValues*/ ctx[0];
    			if (dirty & /*dataDisplay*/ 2) archivechart_changes.isVisible = /*dataDisplay*/ ctx[1] === DataDisplay.Graphics;
    			archivechart.$set(archivechart_changes);

    			if (dirty & /*tableHeaders*/ 16) {
    				each_value_2 = /*tableHeaders*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*rows, strings, msToString*/ 32) {
    				each_value = /*rows*/ ctx[5];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each1_lookup, tbody, destroy_block, create_each_block$3, null, get_each_context$3);
    			}

    			if (dirty & /*dataDisplay, DataDisplay*/ 2) {
    				toggle_class(div2, "hidden", /*dataDisplay*/ ctx[1] !== DataDisplay.Measures);
    			}

    			if (!current || dirty & /*dataDisplay*/ 2 && !src_url_equal(img1.src, img1_src_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures
    			? "/img/ico_measure.png"
    			: "/img/ico_graphics.png")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (!current || dirty & /*dataDisplay*/ 2 && button1_disabled_value !== (button1_disabled_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (!current || dirty & /*dataDisplay*/ 2 && button2_disabled_value !== (button2_disabled_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (!current || dirty & /*dataDisplay*/ 2 && button3_disabled_value !== (button3_disabled_value = /*dataDisplay*/ ctx[1] === DataDisplay.Measures)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(archivechart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(archivechart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*archivechart_binding*/ ctx[6](null);
    			destroy_component(archivechart);
    			destroy_each(each_blocks_1, detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SavedDataView', slots, []);
    	let { archiveValues } = $$props;
    	if (!archiveValues) archiveValues = { time: [], sensorsArchiveValues: [] };

    	// Internal
    	let chartEl;

    	let dataDisplay = DataDisplay.Measures;
    	let chart;

    	function toggleMeasureGraphics() {
    		$$invalidate(1, dataDisplay = dataDisplay === DataDisplay.Measures
    		? DataDisplay.Graphics
    		: DataDisplay.Measures);
    	}

    	const tableHeaders = [`${strings$1.time} [${strings$1.timeFormat}]`];

    	tableHeaders.push(...archiveValues.sensorsArchiveValues.map(s => {
    		const prefs = SENSORS_PREFERENCES.get(s.sensorType);
    		return `${prefs.name} [${s.unit}]`;
    	}));

    	const tableColumns = [archiveValues.time, ...archiveValues.sensorsArchiveValues.map(s => s.values)];
    	const rows = columnsToRows(tableColumns);
    	const writable_props = ['archiveValues'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SavedDataView> was created with unknown prop '${key}'`);
    	});

    	function archivechart_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chart = $$value;
    			$$invalidate(2, chart);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('archiveValues' in $$props) $$invalidate(0, archiveValues = $$props.archiveValues);
    	};

    	$$self.$capture_state = () => ({
    		strings: strings$1,
    		DataDisplay,
    		ArchiveChart,
    		SENSORS_PREFERENCES,
    		msToString,
    		columnsToRows,
    		archiveValues,
    		chartEl,
    		dataDisplay,
    		chart,
    		toggleMeasureGraphics,
    		tableHeaders,
    		tableColumns,
    		rows
    	});

    	$$self.$inject_state = $$props => {
    		if ('archiveValues' in $$props) $$invalidate(0, archiveValues = $$props.archiveValues);
    		if ('chartEl' in $$props) chartEl = $$props.chartEl;
    		if ('dataDisplay' in $$props) $$invalidate(1, dataDisplay = $$props.dataDisplay);
    		if ('chart' in $$props) $$invalidate(2, chart = $$props.chart);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		archiveValues,
    		dataDisplay,
    		chart,
    		toggleMeasureGraphics,
    		tableHeaders,
    		rows,
    		archivechart_binding
    	];
    }

    class SavedDataView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { archiveValues: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SavedDataView",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*archiveValues*/ ctx[0] === undefined && !('archiveValues' in props)) {
    			console.warn("<SavedDataView> was created without expected prop 'archiveValues'");
    		}
    	}

    	get archiveValues() {
    		throw new Error("<SavedDataView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set archiveValues(value) {
    		throw new Error("<SavedDataView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function useEffect(cb, deps) {
        let cleanup;
        function apply() {
            if (cleanup)
                cleanup();
            cleanup = cb();
        }
        if (deps) {
            let values = [];
            afterUpdate(() => {
                const new_values = deps();
                if (new_values.some((value, i) => value !== values[i])) {
                    apply();
                    values = new_values;
                }
            });
        }
        else {
            // no deps = always run
            afterUpdate(apply);
        }
        onDestroy(() => {
            if (cleanup)
                cleanup();
        });
    }

    /* src\screens\SavedDataScreen.svelte generated by Svelte v3.48.0 */

    // (18:0) {#if (archiveValues)}
    function create_if_block$5(ctx) {
    	let saveddataview;
    	let current;

    	saveddataview = new SavedDataView({
    			props: { archiveValues: /*archiveValues*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(saveddataview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(saveddataview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const saveddataview_changes = {};
    			if (dirty & /*archiveValues*/ 1) saveddataview_changes.archiveValues = /*archiveValues*/ ctx[0];
    			saveddataview.$set(saveddataview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(saveddataview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(saveddataview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(saveddataview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(18:0) {#if (archiveValues)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*archiveValues*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*archiveValues*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*archiveValues*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SavedDataScreen', slots, []);
    	let { repository } = $$props;
    	let { id } = $$props;

    	// Internal
    	let archiveValues;

    	useEffect(
    		() => {
    			if (!repository || !id) return;

    			repository.getArchiveValues(id).then(result => {
    				$$invalidate(0, archiveValues = result);
    			});
    		},
    		() => [repository]
    	);

    	const writable_props = ['repository', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SavedDataScreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('repository' in $$props) $$invalidate(1, repository = $$props.repository);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		SavedDataView,
    		useEffect,
    		repository,
    		id,
    		archiveValues
    	});

    	$$self.$inject_state = $$props => {
    		if ('repository' in $$props) $$invalidate(1, repository = $$props.repository);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('archiveValues' in $$props) $$invalidate(0, archiveValues = $$props.archiveValues);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [archiveValues, repository, id];
    }

    class SavedDataScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { repository: 1, id: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SavedDataScreen",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*repository*/ ctx[1] === undefined && !('repository' in props)) {
    			console.warn("<SavedDataScreen> was created without expected prop 'repository'");
    		}

    		if (/*id*/ ctx[2] === undefined && !('id' in props)) {
    			console.warn("<SavedDataScreen> was created without expected prop 'id'");
    		}
    	}

    	get repository() {
    		throw new Error("<SavedDataScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set repository(value) {
    		throw new Error("<SavedDataScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<SavedDataScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SavedDataScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.48.0 */

    const file$h = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$h, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$h, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$j($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$j,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.48.0 */
    const file$g = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$3(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$g, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$g, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$i($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    var RoutePath;
    (function (RoutePath) {
        RoutePath["Main"] = "/";
        RoutePath["SavedData"] = "/saved-data";
        RoutePath["Dashboard"] = "/dashboard";
    })(RoutePath || (RoutePath = {}));

    class ReadSettingsException extends Error {
        constructor(message = strings$1.readSettingsError) {
            super(message);
        }
    }

    class Sensor {
        constructor(lab, sensorType) {
            this.lab = lab;
            this.sensorType = sensorType;
            this.selectedModeIdx = 0;
            this.markerColor = chartColors[0];
            this.markerSize = 1;
            this.lineColor = chartColors[0];
            this.lineSize = 3;
            const preferences = SENSORS_PREFERENCES.get(sensorType);
            this.modes = preferences.modes;
            this.name = preferences.name;
            this.ico = preferences.ico;
            this.accuracy = preferences.accuracy;
            if (this.modes.length === 0)
                throw new Error("modes must contains a least one element");
        }
        get mode() {
            return this.modes[this.selectedModeIdx];
        }
        set mode(mode) {
            const idx = this.modes.indexOf(mode);
            if (idx === -1)
                return;
            if (this.modes.length > 0) {
                this.lab.setMode(this.sensorType, idx);
            }
            this.selectedModeIdx = idx;
        }
        getLastValue() {
            const value = this.lab.getValue(this.sensorType);
            if (isNaN(value) || value == null)
                return null;
            return round(value, this.accuracy);
        }
    }

    var AccelerometerMode;
    (function (AccelerometerMode) {
        AccelerometerMode[AccelerometerMode["M2G"] = 0] = "M2G";
        AccelerometerMode[AccelerometerMode["M4G"] = 1] = "M4G";
        AccelerometerMode[AccelerometerMode["M8G"] = 2] = "M8G";
        AccelerometerMode[AccelerometerMode["M16G"] = 3] = "M16G";
    })(AccelerometerMode || (AccelerometerMode = {}));

    var ConductometerMode;
    (function (ConductometerMode) {
        ConductometerMode[ConductometerMode["K0"] = 0] = "K0";
        ConductometerMode[ConductometerMode["K1"] = 1] = "K1";
        ConductometerMode[ConductometerMode["K10"] = 2] = "K10";
        ConductometerMode[ConductometerMode["K100"] = 3] = "K100";
    })(ConductometerMode || (ConductometerMode = {}));

    class SensorValuesConverter {
        static convert(sensorType, rawValues, factorySettings, userSettings) {
            switch (sensorType) {
                case SensorType.TempSensor:
                    return this.convertTempSensor(rawValues, factorySettings, userSettings);
                case SensorType.AbsolutePressureSensor:
                    return this.convertAbsolutePressureSensor(rawValues, factorySettings, userSettings);
                case SensorType.TeslameterSensor:
                    return this.convertTeslameterSensor(rawValues, factorySettings, userSettings);
                case SensorType.VoltmeterSensor:
                    return this.convertVoltmeterSensor(rawValues, factorySettings, userSettings);
                case SensorType.AmpermetrSensor:
                    return this.convertAmpermetrSensor(rawValues, factorySettings, userSettings);
                case SensorType.AccelerometerXSensor:
                    return this.convertAccelerometerXSensor(rawValues, factorySettings, userSettings);
                case SensorType.AccelerometerYSensor:
                    return this.convertAccelerometerYSensor(rawValues, factorySettings, userSettings);
                case SensorType.AccelerometerZSensor:
                    return this.convertAccelerometerZSensor(rawValues, factorySettings, userSettings);
                case SensorType.ElectricalConductivitySensor:
                    return this.convertElectricalConductivitySensor(rawValues, factorySettings, userSettings);
                case SensorType.HumiditySensor:
                    return this.convertHumiditySensor(rawValues, factorySettings, userSettings);
                case SensorType.LightSensor:
                    return this.convertLightSensor(rawValues, factorySettings, userSettings);
                case SensorType.TempOutsideSensor:
                    return this.convertTempOutsideSensor(rawValues, factorySettings, userSettings);
                case SensorType.ColorimeterSensor:
                    return this.convertColorimeterSensor(rawValues, factorySettings, userSettings);
                case SensorType.PhSensor:
                    return this.convertPhSensor(rawValues, factorySettings, userSettings);
                default:
                    return null;
            }
        }
        static convertTempSensor(rawValues, factorySettings, userSettings) {
            const tempSensor = rawValues.channel2;
            const tempK = tempSensor < factorySettings.pointT_Channel2
                ? factorySettings.k1_Channel2
                : factorySettings.k2_Channel2;
            const tempD = tempSensor < factorySettings.pointT_Channel2
                ? factorySettings.delta1_Channel2
                : factorySettings.delta2_Channel2;
            return applyCoefficients(rawValues.channel2, {
                factoryK: tempK,
                factoryD: tempD,
                userK: userSettings.k_TempSensor,
                userD: userSettings.delta_TempSensor,
            });
        }
        static convertAbsolutePressureSensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.pressure, {
                factoryD: factorySettings.delta_AbsolutePressureSensor,
                factoryK: 0.1,
                userD: userSettings.delta_AbsolutePressureSensor
            });
        }
        static convertTeslameterSensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.channel3, {
                factoryK: factorySettings.k_Channel0,
                factoryD: factorySettings.delta_Channel0,
                userK: userSettings.k_TeslametrSensor,
                userD: userSettings.delta_TeslametrSensor
            });
        }
        static convertVoltmeterSensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.channel0, {
                factoryK: factorySettings.k_Channel0,
                factoryD: factorySettings.delta_Channel0,
                userK: userSettings.k_VoltmeterSensor,
                userD: userSettings.delta_VoltmeterSensor,
            });
        }
        static convertAmpermetrSensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.channel1, {
                factoryK: factorySettings.k_Channel1,
                factoryD: factorySettings.delta_Channel1,
                userK: userSettings.k_AmpermetrSensor,
                userD: userSettings.delta_AmpermetrSensor
            });
        }
        static convertAccelerometerXSensor(rawValues, factorySettings, userSettings) {
            const accelerometrMultiplyer = this.getAcceleometerMultiplyer(rawValues.accelerometerMode);
            return rawValues.accelerometerX * accelerometrMultiplyer;
        }
        static convertAccelerometerYSensor(rawValues, factorySettings, userSettings) {
            const accelerometrMultiplyer = this.getAcceleometerMultiplyer(rawValues.accelerometerMode);
            return rawValues.accelerometerY * accelerometrMultiplyer;
        }
        static convertAccelerometerZSensor(rawValues, factorySettings, userSettings) {
            const accelerometrMultiplyer = this.getAcceleometerMultiplyer(rawValues.accelerometerMode);
            return rawValues.accelerometerZ * accelerometrMultiplyer;
        }
        static convertElectricalConductivitySensor(rawValues, factorySettings, userSettings) {
            let factConductivityK = 1;
            let factConductivityDelta = 0;
            let userConductivityK = 1;
            let userConductivityDelta = 0;
            switch (rawValues.conductometerMode) {
                case ConductometerMode.K1:
                    factConductivityK = factorySettings.k1_Channel3;
                    factConductivityDelta = factorySettings.delta1_Channel3;
                    userConductivityK = userSettings.k1_ConductivitySensor;
                    userConductivityDelta = userSettings.delta1_ConductivitySensor;
                    break;
                case ConductometerMode.K10:
                    factConductivityK = factorySettings.k2_Channel3;
                    factConductivityDelta = factorySettings.delta2_Channel3;
                    userConductivityK = userSettings.k2_ConductivitySensor;
                    userConductivityDelta = userSettings.delta2_ConductivitySensor;
                    break;
                case ConductometerMode.K100:
                    factConductivityK = factorySettings.k3_Channel3;
                    factConductivityDelta = factorySettings.delta3_Channel3;
                    userConductivityK = userSettings.k3_ConductivitySensor;
                    userConductivityDelta = userSettings.delta3_ConductivitySensor;
                    break;
            }
            return applyCoefficients(rawValues.channel3, {
                factoryK: factConductivityK,
                factoryD: factConductivityDelta,
                userK: userConductivityK,
                userD: userConductivityDelta,
            });
        }
        static convertHumiditySensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.humidity, {
                factoryK: 0.01,
                factoryD: factorySettings.delta_HumiditySensor,
                userD: userSettings.delta_HumiditySensor
            });
        }
        static convertLightSensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.light, {
                factoryD: factorySettings.delta_LightSensor,
                userD: userSettings.delta_LightSensor
            });
        }
        static convertTempOutsideSensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.tempADC, {
                factoryK: 0.01,
                factoryD: factorySettings.delta_TempOutsideSensor,
                userD: userSettings.delta_TempOutsideSensor
            });
        }
        static convertColorimeterSensor(rawValues, factorySettings, userSettings) {
            return 0;
        }
        static convertPhSensor(rawValues, factorySettings, userSettings) {
            return applyCoefficients(rawValues.channel0, {
                factoryK: factorySettings.k_Channel0,
                factoryD: factorySettings.delta_Channel0,
                userK: userSettings.k_pHSensor,
                userD: userSettings.delta_pHSensor,
            });
        }
        static getAcceleometerMultiplyer(accelerometerMode) {
            switch (accelerometerMode) {
                case (AccelerometerMode.M2G):
                    return 0.064 * 0.001;
                case (AccelerometerMode.M4G):
                    return 0.128 * 0.001;
                case (AccelerometerMode.M8G):
                    return 0.256 * 0.001;
                case (AccelerometerMode.M16G):
                    return 0.512 * 0.001;
                default:
                    return 0.064 * 0.001;
            }
        }
    }

    class Lab {
        constructor(repository) {
            this.repository = repository;
            this.values = new Map();
            this.sensors = [];
            this.isStopped = true;
            this.lastRawValues = undefined;
            this._onError = new Event();
            repository.onError.addEventListener(message => {
                this.stop();
                this._onError.emit(message);
            });
        }
        get onError() { return this._onError; }
        async init() {
            this.factorySettings = await this.repository.getFactorySettings();
            this.userSettings = await this.repository.getUserSettings(this.labType);
            const sensorValues = await this.repository.getSensorsValuesAsync();
            if (this.factorySettings == null || this.userSettings == null)
                throw new ReadSettingsException();
            this.sensors = this.availableSensors.map(sensorType => new Sensor(this, sensorType));
            this.updateModes(sensorValues);
            return this;
        }
        getSensors() {
            return this.sensors;
        }
        update() {
            if (this.isStopped)
                return;
            this.updateValues();
        }
        updateValues() {
            const rawValues = this.repository.getLastSensorsValues();
            if (rawValues == null || rawValues == this.lastRawValues) {
                this.values.forEach((value, key, map) => {
                    map.set(key, null);
                });
                return;
            }
            this.lastRawValues = rawValues;
            this.availableSensors.map((sensorType) => {
                this.values.set(sensorType, SensorValuesConverter.convert(sensorType, rawValues, this.factorySettings, this.userSettings));
            });
            this.updateModes(rawValues);
        }
        updateModes(values) { }
        getValue(sensorType) {
            var _a;
            return (_a = this.values.get(sensorType)) !== null && _a !== void 0 ? _a : null;
        }
        setMode(sensorType, modeIdx) {
        }
        ;
        getMode(sensorType) {
            return undefined;
        }
        ;
        async start() {
            await this.repository.start();
            this.isStopped = false;
            this.interval = self.setInterval(() => this.update(), 250);
        }
        async stop() {
            self.clearInterval(this.interval);
            this.isStopped = true;
            await this.repository.stop();
        }
    }

    /* src\components\Logo.svelte generated by Svelte v3.48.0 */

    const file$f = "src\\components\\Logo.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/img/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-yswupl");
    			add_location(img, file$f, 1, 4, 31);
    			attr_dev(div, "class", "logo-wrapper svelte-yswupl");
    			add_location(div, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\ContentHeader.svelte generated by Svelte v3.48.0 */

    const file$e = "src\\components\\ContentHeader.svelte";

    function create_fragment$g(ctx) {
    	let header;
    	let span;
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			span = element("span");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			img = element("img");
    			add_location(span, file$e, 6, 4, 83);
    			if (!src_url_equal(img.src, img_src_value = /*iconUri*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1bs1sqp");
    			add_location(img, file$e, 9, 4, 122);
    			attr_dev(header, "class", "svelte-1bs1sqp");
    			add_location(header, file$e, 5, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, span);
    			append_dev(span, t0);
    			append_dev(header, t1);
    			append_dev(header, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (dirty & /*iconUri*/ 1 && !src_url_equal(img.src, img_src_value = /*iconUri*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentHeader', slots, []);
    	let { iconUri } = $$props;
    	let { title } = $$props;
    	const writable_props = ['iconUri', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentHeader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('iconUri' in $$props) $$invalidate(0, iconUri = $$props.iconUri);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ iconUri, title });

    	$$self.$inject_state = $$props => {
    		if ('iconUri' in $$props) $$invalidate(0, iconUri = $$props.iconUri);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [iconUri, title];
    }

    class ContentHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { iconUri: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentHeader",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*iconUri*/ ctx[0] === undefined && !('iconUri' in props)) {
    			console.warn("<ContentHeader> was created without expected prop 'iconUri'");
    		}

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<ContentHeader> was created without expected prop 'title'");
    		}
    	}

    	get iconUri() {
    		throw new Error("<ContentHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconUri(value) {
    		throw new Error("<ContentHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ContentHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ContentHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\AboutView.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\views\\AboutView.svelte";

    function create_fragment$f(ctx) {
    	let div4;
    	let contentheader;
    	let t0;
    	let div3;
    	let div0;
    	let span0;
    	let t3;
    	let span1;
    	let raw_value = strings$1.aboutContactCellphone + "";
    	let t4;
    	let a0;
    	let t5_value = strings$1.aboutSiteUrl + "";
    	let t5;
    	let t6;
    	let div2;
    	let span2;
    	let t9;
    	let a1;
    	let t10_value = strings$1.aboutSiteUrl + "";
    	let t10;
    	let t11;
    	let div1;
    	let current;

    	contentheader = new ContentHeader({
    			props: {
    				title: strings$1.about,
    				iconUri: "/img/Info.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(contentheader.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = `${strings$1.support}:`;
    			t3 = space();
    			span1 = element("span");
    			t4 = space();
    			a0 = element("a");
    			t5 = text(t5_value);
    			t6 = space();
    			div2 = element("div");
    			span2 = element("span");
    			span2.textContent = `${strings$1.site}:`;
    			t9 = space();
    			a1 = element("a");
    			t10 = text(t10_value);
    			t11 = space();
    			div1 = element("div");
    			attr_dev(span0, "class", "svelte-10qeq8r");
    			add_location(span0, file$d, 10, 12, 310);
    			attr_dev(span1, "class", "svelte-10qeq8r");
    			add_location(span1, file$d, 11, 12, 354);
    			attr_dev(a0, "href", links.appOwnerSite);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-10qeq8r");
    			add_location(a0, file$d, 12, 12, 417);
    			attr_dev(div0, "class", "about-row svelte-10qeq8r");
    			add_location(div0, file$d, 9, 8, 274);
    			attr_dev(span2, "class", "svelte-10qeq8r");
    			add_location(span2, file$d, 15, 12, 549);
    			attr_dev(a1, "href", links.appOwnerSite);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-10qeq8r");
    			add_location(a1, file$d, 16, 12, 590);
    			attr_dev(div1, "class", "svelte-10qeq8r");
    			add_location(div1, file$d, 17, 12, 674);
    			attr_dev(div2, "class", "about-row svelte-10qeq8r");
    			add_location(div2, file$d, 14, 8, 513);
    			attr_dev(div3, "class", "info svelte-10qeq8r");
    			add_location(div3, file$d, 8, 4, 247);
    			attr_dev(div4, "class", "content-wrapper svelte-10qeq8r");
    			add_location(div4, file$d, 5, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(contentheader, div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t3);
    			append_dev(div0, span1);
    			span1.innerHTML = raw_value;
    			append_dev(div0, t4);
    			append_dev(div0, a0);
    			append_dev(a0, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, span2);
    			append_dev(div2, t9);
    			append_dev(div2, a1);
    			append_dev(a1, t10);
    			append_dev(div2, t11);
    			append_dev(div2, div1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(contentheader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AboutView', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AboutView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ strings: strings$1, links, ContentHeader });
    	return [];
    }

    class AboutView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AboutView",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\Title.svelte generated by Svelte v3.48.0 */

    const file$c = "src\\components\\Title.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(div, "class", "title svelte-c8nnfh");
    			add_location(div, file$c, 3, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	let { title } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({ title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Title> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\SensorSettingsView.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\views\\SensorSettingsView.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (20:20) {#each sensor.modes as mode}
    function create_each_block$2(ctx) {
    	let option;
    	let t_value = /*mode*/ ctx[6].toString() + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*mode*/ ctx[6];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-yx7oej");
    			add_location(option, file$b, 20, 24, 737);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sensor*/ 1 && t_value !== (t_value = /*mode*/ ctx[6].toString() + "")) set_data_dev(t, t_value);

    			if (dirty & /*sensor*/ 1 && option_value_value !== (option_value_value = /*mode*/ ctx[6])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(20:20) {#each sensor.modes as mode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div7;
    	let contentheader;
    	let t0;
    	let title;
    	let t1;
    	let div6;
    	let div5;
    	let div0;
    	let label0;
    	let t3;
    	let select0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let input0;
    	let t7;
    	let div2;
    	let label2;
    	let t9;
    	let select1;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t14;
    	let div3;
    	let label3;
    	let t16;
    	let input1;
    	let t17;
    	let div4;
    	let label4;
    	let t19;
    	let select2;
    	let option4;
    	let option5;
    	let option6;
    	let current;
    	let mounted;
    	let dispose;

    	contentheader = new ContentHeader({
    			props: {
    				title: /*sensor*/ ctx[0].name,
    				iconUri: /*sensor*/ ctx[0].ico
    			},
    			$$inline: true
    		});

    	title = new Title({
    			props: { title: strings$1.sensorSettings },
    			$$inline: true
    		});

    	let each_value = /*sensor*/ ctx[0].modes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			create_component(contentheader.$$.fragment);
    			t0 = space();
    			create_component(title.$$.fragment);
    			t1 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = `${strings$1.rangeAndUnit}`;
    			t3 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = `${strings$1.chartLineColor}`;
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = `${strings$1.chartLineWidth}`;
    			t9 = space();
    			select1 = element("select");
    			option0 = element("option");
    			option0.textContent = "1";
    			option1 = element("option");
    			option1.textContent = "2";
    			option2 = element("option");
    			option2.textContent = "3";
    			option3 = element("option");
    			option3.textContent = "4";
    			t14 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = `${strings$1.chartMarkerColor}`;
    			t16 = space();
    			input1 = element("input");
    			t17 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = `${strings$1.chartMarkerWidth}`;
    			t19 = space();
    			select2 = element("select");
    			option4 = element("option");
    			option4.textContent = "0.5";
    			option5 = element("option");
    			option5.textContent = "1";
    			option6 = element("option");
    			option6.textContent = "2";
    			attr_dev(label0, "class", "svelte-yx7oej");
    			add_location(label0, file$b, 17, 16, 576);
    			attr_dev(select0, "class", "svelte-yx7oej");
    			if (/*sensor*/ ctx[0].mode === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[1].call(select0));
    			add_location(select0, file$b, 18, 16, 630);
    			attr_dev(div0, "class", "setting-row svelte-yx7oej");
    			add_location(div0, file$b, 16, 12, 534);
    			attr_dev(label1, "class", "svelte-yx7oej");
    			add_location(label1, file$b, 25, 16, 912);
    			attr_dev(input0, "type", "color");
    			attr_dev(input0, "class", "svelte-yx7oej");
    			add_location(input0, file$b, 26, 16, 968);
    			attr_dev(div1, "class", "setting-row svelte-yx7oej");
    			add_location(div1, file$b, 24, 12, 870);
    			attr_dev(label2, "class", "svelte-yx7oej");
    			add_location(label2, file$b, 29, 16, 1092);
    			option0.__value = 1;
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-yx7oej");
    			add_location(option0, file$b, 31, 20, 1206);
    			option1.__value = 2;
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-yx7oej");
    			add_location(option1, file$b, 32, 20, 1255);
    			option2.__value = 3;
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-yx7oej");
    			add_location(option2, file$b, 33, 20, 1304);
    			option3.__value = 4;
    			option3.value = option3.__value;
    			attr_dev(option3, "class", "svelte-yx7oej");
    			add_location(option3, file$b, 34, 20, 1353);
    			attr_dev(select1, "class", "svelte-yx7oej");
    			if (/*sensor*/ ctx[0].lineSize === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[3].call(select1));
    			add_location(select1, file$b, 30, 16, 1148);
    			attr_dev(div2, "class", "setting-row svelte-yx7oej");
    			add_location(div2, file$b, 28, 12, 1050);
    			attr_dev(label3, "class", "svelte-yx7oej");
    			add_location(label3, file$b, 38, 16, 1481);
    			attr_dev(input1, "type", "color");
    			attr_dev(input1, "class", "svelte-yx7oej");
    			add_location(input1, file$b, 39, 16, 1539);
    			attr_dev(div3, "class", "setting-row svelte-yx7oej");
    			add_location(div3, file$b, 37, 12, 1439);
    			attr_dev(label4, "class", "svelte-yx7oej");
    			add_location(label4, file$b, 42, 16, 1665);
    			option4.__value = 0.5;
    			option4.value = option4.__value;
    			attr_dev(option4, "class", "svelte-yx7oej");
    			add_location(option4, file$b, 44, 20, 1783);
    			option5.__value = 1;
    			option5.value = option5.__value;
    			attr_dev(option5, "class", "svelte-yx7oej");
    			add_location(option5, file$b, 45, 20, 1836);
    			option6.__value = 2;
    			option6.value = option6.__value;
    			attr_dev(option6, "class", "svelte-yx7oej");
    			add_location(option6, file$b, 46, 20, 1885);
    			attr_dev(select2, "class", "svelte-yx7oej");
    			if (/*sensor*/ ctx[0].markerSize === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[5].call(select2));
    			add_location(select2, file$b, 43, 16, 1723);
    			attr_dev(div4, "class", "setting-row svelte-yx7oej");
    			add_location(div4, file$b, 41, 12, 1623);
    			attr_dev(div5, "class", "settings svelte-yx7oej");
    			add_location(div5, file$b, 15, 8, 499);
    			attr_dev(div6, "class", "w-full h-full svelte-yx7oej");
    			add_location(div6, file$b, 14, 4, 463);
    			attr_dev(div7, "class", "content-wrapper svelte-yx7oej");
    			add_location(div7, file$b, 10, 0, 321);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			mount_component(contentheader, div7, null);
    			append_dev(div7, t0);
    			mount_component(title, div7, null);
    			append_dev(div7, t1);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, select0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select0, null);
    			}

    			select_option(select0, /*sensor*/ ctx[0].mode);
    			append_dev(div5, t4);
    			append_dev(div5, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input0);
    			set_input_value(input0, /*sensor*/ ctx[0].lineColor);
    			append_dev(div5, t7);
    			append_dev(div5, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t9);
    			append_dev(div2, select1);
    			append_dev(select1, option0);
    			append_dev(select1, option1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			select_option(select1, /*sensor*/ ctx[0].lineSize);
    			append_dev(div5, t14);
    			append_dev(div5, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t16);
    			append_dev(div3, input1);
    			set_input_value(input1, /*sensor*/ ctx[0].markerColor);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t19);
    			append_dev(div4, select2);
    			append_dev(select2, option4);
    			append_dev(select2, option5);
    			append_dev(select2, option6);
    			select_option(select2, /*sensor*/ ctx[0].markerSize);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[1]),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[2]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const contentheader_changes = {};
    			if (dirty & /*sensor*/ 1) contentheader_changes.title = /*sensor*/ ctx[0].name;
    			if (dirty & /*sensor*/ 1) contentheader_changes.iconUri = /*sensor*/ ctx[0].ico;
    			contentheader.$set(contentheader_changes);

    			if (dirty & /*sensor*/ 1) {
    				each_value = /*sensor*/ ctx[0].modes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*sensor*/ 1) {
    				select_option(select0, /*sensor*/ ctx[0].mode);
    			}

    			if (dirty & /*sensor*/ 1) {
    				set_input_value(input0, /*sensor*/ ctx[0].lineColor);
    			}

    			if (dirty & /*sensor*/ 1) {
    				select_option(select1, /*sensor*/ ctx[0].lineSize);
    			}

    			if (dirty & /*sensor*/ 1) {
    				set_input_value(input1, /*sensor*/ ctx[0].markerColor);
    			}

    			if (dirty & /*sensor*/ 1) {
    				select_option(select2, /*sensor*/ ctx[0].markerSize);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentheader.$$.fragment, local);
    			transition_in(title.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentheader.$$.fragment, local);
    			transition_out(title.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(contentheader);
    			destroy_component(title);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SensorSettingsView', slots, []);
    	let { sensor } = $$props;
    	const writable_props = ['sensor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SensorSettingsView> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		sensor.mode = select_value(this);
    		$$invalidate(0, sensor);
    	}

    	function input0_input_handler() {
    		sensor.lineColor = this.value;
    		$$invalidate(0, sensor);
    	}

    	function select1_change_handler() {
    		sensor.lineSize = select_value(this);
    		$$invalidate(0, sensor);
    	}

    	function input1_input_handler() {
    		sensor.markerColor = this.value;
    		$$invalidate(0, sensor);
    	}

    	function select2_change_handler() {
    		sensor.markerSize = select_value(this);
    		$$invalidate(0, sensor);
    	}

    	$$self.$$set = $$props => {
    		if ('sensor' in $$props) $$invalidate(0, sensor = $$props.sensor);
    	};

    	$$self.$capture_state = () => ({ strings: strings$1, ContentHeader, Title, sensor });

    	$$self.$inject_state = $$props => {
    		if ('sensor' in $$props) $$invalidate(0, sensor = $$props.sensor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sensor,
    		select0_change_handler,
    		input0_input_handler,
    		select1_change_handler,
    		input1_input_handler,
    		select2_change_handler
    	];
    }

    class SensorSettingsView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { sensor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SensorSettingsView",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sensor*/ ctx[0] === undefined && !('sensor' in props)) {
    			console.warn("<SensorSettingsView> was created without expected prop 'sensor'");
    		}
    	}

    	get sensor() {
    		throw new Error("<SensorSettingsView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sensor(value) {
    		throw new Error("<SensorSettingsView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TimeUnit;
    (function (TimeUnit) {
        TimeUnit[TimeUnit["Second"] = 1] = "Second";
        TimeUnit[TimeUnit["Minute"] = 60] = "Minute";
    })(TimeUnit || (TimeUnit = {}));

    var TimeFormat;
    (function (TimeFormat) {
        TimeFormat[TimeFormat["Stopwatch"] = 0] = "Stopwatch";
        TimeFormat[TimeFormat["MinutesSeconds"] = 1] = "MinutesSeconds";
        TimeFormat[TimeFormat["HoursMinutes"] = 2] = "HoursMinutes";
    })(TimeFormat || (TimeFormat = {}));

    class Settings {
    }
    Settings.timeFormat = TimeFormat.Stopwatch;
    Settings.experimentTime = 60;

    /* src\views\SettingsView.svelte generated by Svelte v3.48.0 */
    const file$a = "src\\views\\SettingsView.svelte";

    function create_fragment$c(ctx) {
    	let div4;
    	let contentheader;
    	let t0;
    	let title;
    	let t1;
    	let div3;
    	let div1;
    	let label0;
    	let t3;
    	let div0;
    	let input;
    	let t4;
    	let select0;
    	let option0;
    	let t5_value = strings$1.timeSecond + "";
    	let t5;
    	let option1;
    	let t6_value = strings$1.timeMinute + "";
    	let t6;
    	let t7;
    	let div2;
    	let label1;
    	let t9;
    	let select1;
    	let option2;
    	let t10_value = strings$1.modeStopwatch + "";
    	let t10;
    	let option3;
    	let t11_value = strings$1.modeMinutesAndSeconds + "";
    	let t11;
    	let option4;
    	let t12_value = strings$1.modeHoursAndMinutes + "";
    	let t12;
    	let current;
    	let mounted;
    	let dispose;

    	contentheader = new ContentHeader({
    			props: {
    				title: strings$1.settings,
    				iconUri: "/img/Gear.png"
    			},
    			$$inline: true
    		});

    	title = new Title({
    			props: { title: strings$1.experimentSettings },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(contentheader.$$.fragment);
    			t0 = space();
    			create_component(title.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = `${strings$1.experimentTimeLabel}`;
    			t3 = space();
    			div0 = element("div");
    			input = element("input");
    			t4 = space();
    			select0 = element("select");
    			option0 = element("option");
    			t5 = text(t5_value);
    			option1 = element("option");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = `${strings$1.timeFormatLabel}`;
    			t9 = space();
    			select1 = element("select");
    			option2 = element("option");
    			t10 = text(t10_value);
    			option3 = element("option");
    			t11 = text(t11_value);
    			option4 = element("option");
    			t12 = text(t12_value);
    			attr_dev(label0, "class", "svelte-52nhvb");
    			add_location(label0, file$a, 26, 12, 881);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", maxTime);
    			attr_dev(input, "class", "svelte-52nhvb");
    			add_location(input, file$a, 28, 16, 982);
    			option0.__value = TimeUnit.Second;
    			option0.value = option0.__value;
    			attr_dev(option0, "class", "svelte-52nhvb");
    			add_location(option0, file$a, 30, 20, 1116);
    			option1.__value = TimeUnit.Minute;
    			option1.value = option1.__value;
    			attr_dev(option1, "class", "svelte-52nhvb");
    			add_location(option1, file$a, 31, 20, 1198);
    			attr_dev(select0, "class", "svelte-52nhvb");
    			if (/*timeUnit*/ ctx[0] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[3].call(select0));
    			add_location(select0, file$a, 29, 16, 1065);
    			attr_dev(div0, "class", "setting-value svelte-52nhvb");
    			add_location(div0, file$a, 27, 12, 938);
    			attr_dev(div1, "class", "setting-row svelte-52nhvb");
    			add_location(div1, file$a, 25, 8, 843);
    			attr_dev(label1, "class", "svelte-52nhvb");
    			add_location(label1, file$a, 36, 12, 1366);
    			option2.__value = TimeFormat.Stopwatch;
    			option2.value = option2.__value;
    			attr_dev(option2, "class", "svelte-52nhvb");
    			add_location(option2, file$a, 38, 16, 1466);
    			option3.__value = TimeFormat.MinutesSeconds;
    			option3.value = option3.__value;
    			attr_dev(option3, "class", "svelte-52nhvb");
    			add_location(option3, file$a, 39, 16, 1552);
    			option4.__value = TimeFormat.HoursMinutes;
    			option4.value = option4.__value;
    			attr_dev(option4, "class", "svelte-52nhvb");
    			add_location(option4, file$a, 40, 16, 1651);
    			attr_dev(select1, "class", "setting-value svelte-52nhvb");
    			add_location(select1, file$a, 37, 12, 1419);
    			attr_dev(div2, "class", "setting-row svelte-52nhvb");
    			add_location(div2, file$a, 35, 8, 1328);
    			attr_dev(div3, "class", "settings svelte-52nhvb");
    			add_location(div3, file$a, 24, 4, 812);
    			attr_dev(div4, "class", "content-wrapper svelte-52nhvb");
    			add_location(div4, file$a, 20, 0, 655);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(contentheader, div4, null);
    			append_dev(div4, t0);
    			mount_component(title, div4, null);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*timeValue*/ ctx[1]);
    			append_dev(div0, t4);
    			append_dev(div0, select0);
    			append_dev(select0, option0);
    			append_dev(option0, t5);
    			append_dev(select0, option1);
    			append_dev(option1, t6);
    			select_option(select0, /*timeUnit*/ ctx[0]);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t9);
    			append_dev(div2, select1);
    			append_dev(select1, option2);
    			append_dev(option2, t10);
    			append_dev(select1, option3);
    			append_dev(option3, t11);
    			append_dev(select1, option4);
    			append_dev(option4, t12);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[3])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*timeValue*/ 2 && to_number(input.value) !== /*timeValue*/ ctx[1]) {
    				set_input_value(input, /*timeValue*/ ctx[1]);
    			}

    			if (dirty & /*timeUnit, TimeUnit*/ 1) {
    				select_option(select0, /*timeUnit*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentheader.$$.fragment, local);
    			transition_in(title.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentheader.$$.fragment, local);
    			transition_out(title.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(contentheader);
    			destroy_component(title);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let _timeUnit = TimeUnit.Second;
    const maxTime = 60;

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SettingsView', slots, []);
    	let timeUnit = _timeUnit;
    	let timeValue = Settings.experimentTime / timeUnit;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SettingsView> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		timeValue = to_number(this.value);
    		($$invalidate(1, timeValue), $$invalidate(0, timeUnit));
    	}

    	function select0_change_handler() {
    		timeUnit = select_value(this);
    		$$invalidate(0, timeUnit);
    	}

    	$$self.$capture_state = () => ({
    		TimeUnit,
    		_timeUnit,
    		ContentHeader,
    		strings: strings$1,
    		TimeFormat,
    		Settings,
    		Title,
    		maxTime,
    		timeUnit,
    		timeValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('timeUnit' in $$props) $$invalidate(0, timeUnit = $$props.timeUnit);
    		if ('timeValue' in $$props) $$invalidate(1, timeValue = $$props.timeValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*timeValue, timeUnit*/ 3) {
    			{
    				if (timeValue > maxTime) $$invalidate(1, timeValue = maxTime);
    				Settings.experimentTime = timeValue * timeUnit;
    				_timeUnit = timeUnit;
    			}
    		}
    	};

    	return [timeUnit, timeValue, input_input_handler, select0_change_handler];
    }

    class SettingsView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SettingsView",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\views\WifiSettingsView.svelte generated by Svelte v3.48.0 */
    const file$9 = "src\\views\\WifiSettingsView.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let contentheader;
    	let current;

    	contentheader = new ContentHeader({
    			props: {
    				title: strings$1.settings,
    				iconUri: "/img/Gear.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(contentheader.$$.fragment);
    			attr_dev(div, "class", "content-wrapper svelte-ntg7qb");
    			add_location(div, file$9, 6, 0, 188);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(contentheader, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contentheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contentheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(contentheader);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WifiSettingsView', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WifiSettingsView> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ContentHeader, strings: strings$1, Title });
    	return [];
    }

    class WifiSettingsView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WifiSettingsView",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Hamburger.svelte generated by Svelte v3.48.0 */

    const file$8 = "src\\components\\Hamburger.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let span2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			span2 = element("span");
    			attr_dev(span0, "class", "line line1 svelte-nnrt7s");
    			add_location(span0, file$8, 5, 8, 166);
    			attr_dev(span1, "class", "line line2 svelte-nnrt7s");
    			add_location(span1, file$8, 6, 8, 207);
    			attr_dev(span2, "class", "line line3 svelte-nnrt7s");
    			add_location(span2, file$8, 7, 8, 248);
    			attr_dev(div0, "class", "hamburger-lines svelte-nnrt7s");
    			add_location(div0, file$8, 4, 4, 128);
    			attr_dev(div1, "class", "wrapper svelte-nnrt7s");
    			toggle_class(div1, "checked", /*value*/ ctx[0]);
    			add_location(div1, file$8, 3, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t0);
    			append_dev(div0, span1);
    			append_dev(div0, t1);
    			append_dev(div0, span2);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				toggle_class(div1, "checked", /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hamburger', slots, []);
    	let { value } = $$props;
    	const writable_props = ['value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hamburger> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, value = !value);

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ value });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, click_handler];
    }

    class Hamburger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hamburger",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Hamburger> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\MainView.svelte generated by Svelte v3.48.0 */
    const file$7 = "src\\views\\MainView.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (43:8) {#if navExpanded}
    function create_if_block_5(ctx) {
    	let logo;
    	let current;
    	logo = new Logo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(logo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(logo, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(43:8) {#if navExpanded}",
    		ctx
    	});

    	return block;
    }

    // (53:12) {#each sensors as sensor, i (sensor.name)}
    function create_each_block$1(key_1, ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let t1_value = /*sensor*/ ctx[17].name + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[12](/*i*/ ctx[19]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			if (!src_url_equal(img.src, img_src_value = /*sensor*/ ctx[17].ico)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-tsebii");
    			add_location(img, file$7, 56, 20, 1976);
    			attr_dev(span, "class", "svelte-tsebii");
    			add_location(span, file$7, 57, 20, 2019);
    			attr_dev(div, "class", "menu-item svelte-tsebii");
    			toggle_class(div, "selected", /*selectedSensorIdx*/ ctx[2] == /*i*/ ctx[19]);
    			add_location(div, file$7, 53, 16, 1795);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*sensors*/ 1 && !src_url_equal(img.src, img_src_value = /*sensor*/ ctx[17].ico)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*sensors*/ 1 && t1_value !== (t1_value = /*sensor*/ ctx[17].name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*selectedSensorIdx, sensors*/ 5) {
    				toggle_class(div, "selected", /*selectedSensorIdx*/ ctx[2] == /*i*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(53:12) {#each sensors as sensor, i (sensor.name)}",
    		ctx
    	});

    	return block;
    }

    // (100:32) 
    function create_if_block_4(ctx) {
    	let aboutview;
    	let current;
    	aboutview = new AboutView({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(aboutview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(aboutview, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aboutview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aboutview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(aboutview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(100:32) ",
    		ctx
    	});

    	return block;
    }

    // (98:39) 
    function create_if_block_3(ctx) {
    	let wifisettingsview;
    	let current;
    	wifisettingsview = new WifiSettingsView({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(wifisettingsview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wifisettingsview, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wifisettingsview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wifisettingsview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wifisettingsview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(98:39) ",
    		ctx
    	});

    	return block;
    }

    // (96:35) 
    function create_if_block_2(ctx) {
    	let settingsview;
    	let current;
    	settingsview = new SettingsView({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(settingsview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(settingsview, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settingsview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settingsview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settingsview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(96:35) ",
    		ctx
    	});

    	return block;
    }

    // (94:43) 
    function create_if_block_1(ctx) {
    	let sensorsettingsview;
    	let current;

    	sensorsettingsview = new SensorSettingsView({
    			props: {
    				sensor: /*sensors*/ ctx[0][/*selectedSensorIdx*/ ctx[2]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sensorsettingsview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sensorsettingsview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sensorsettingsview_changes = {};
    			if (dirty & /*sensors, selectedSensorIdx*/ 5) sensorsettingsview_changes.sensor = /*sensors*/ ctx[0][/*selectedSensorIdx*/ ctx[2]];
    			sensorsettingsview.$set(sensorsettingsview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sensorsettingsview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sensorsettingsview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sensorsettingsview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(94:43) ",
    		ctx
    	});

    	return block;
    }

    // (93:8) {#if sensorsSelected}
    function create_if_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(93:8) {#if sensorsSelected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div7;
    	let nav;
    	let div0;
    	let hamburger;
    	let updating_value;
    	let t0;
    	let t1;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let span0;
    	let t4;
    	let div2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t5;
    	let div6;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let span1;
    	let t8;
    	let div4;
    	let img2;
    	let img2_src_value;
    	let t9;
    	let span2;
    	let t11;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t12;
    	let span3;
    	let t14;
    	let button;
    	let span4;
    	let t16;
    	let img4;
    	let img4_src_value;
    	let button_disabled_value;
    	let t17;
    	let main;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let mounted;
    	let dispose;

    	function hamburger_value_binding(value) {
    		/*hamburger_value_binding*/ ctx[10](value);
    	}

    	let hamburger_props = {};

    	if (/*navExpanded*/ ctx[7] !== void 0) {
    		hamburger_props.value = /*navExpanded*/ ctx[7];
    	}

    	hamburger = new Hamburger({ props: hamburger_props, $$inline: true });
    	binding_callbacks.push(() => bind(hamburger, 'value', hamburger_value_binding));
    	let if_block0 = /*navExpanded*/ ctx[7] && create_if_block_5(ctx);
    	let each_value = /*sensors*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*sensor*/ ctx[17].name;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const if_block_creators = [
    		create_if_block$2,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*sensorsSelected*/ ctx[6]) return 0;
    		if (/*selectedSensorIdx*/ ctx[2] !== -1) return 1;
    		if (/*settingsSelected*/ ctx[3]) return 2;
    		if (/*wifiSettingsSelected*/ ctx[4]) return 3;
    		if (/*aboutSelected*/ ctx[5]) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			nav = element("nav");
    			div0 = element("div");
    			create_component(hamburger.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = `${strings$1.sensors}`;
    			t4 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div6 = element("div");
    			div3 = element("div");
    			img1 = element("img");
    			t6 = space();
    			span1 = element("span");
    			span1.textContent = `${strings$1.experimentSettings}`;
    			t8 = space();
    			div4 = element("div");
    			img2 = element("img");
    			t9 = space();
    			span2 = element("span");
    			span2.textContent = `${strings$1.wifiSettings}`;
    			t11 = space();
    			div5 = element("div");
    			img3 = element("img");
    			t12 = space();
    			span3 = element("span");
    			span3.textContent = `${strings$1.about}`;
    			t14 = space();
    			button = element("button");
    			span4 = element("span");
    			span4.textContent = `${strings$1.start}`;
    			t16 = space();
    			img4 = element("img");
    			t17 = space();
    			main = element("main");
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "svelte-tsebii");
    			toggle_class(div0, "burger", /*navExpanded*/ ctx[7]);
    			add_location(div0, file$7, 38, 8, 1269);
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Compass.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-tsebii");
    			add_location(img0, file$7, 48, 12, 1595);
    			attr_dev(span0, "class", "svelte-tsebii");
    			add_location(span0, file$7, 49, 12, 1636);
    			attr_dev(div1, "class", "menu-item large svelte-tsebii");
    			toggle_class(div1, "selected", /*sensorsSelected*/ ctx[6]);
    			add_location(div1, file$7, 45, 8, 1438);
    			attr_dev(div2, "class", "column sensors-list svelte-tsebii");
    			add_location(div2, file$7, 51, 8, 1690);
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Gear.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-tsebii");
    			add_location(img1, file$7, 66, 16, 2324);
    			attr_dev(span1, "class", "svelte-tsebii");
    			add_location(span1, file$7, 67, 16, 2366);
    			attr_dev(div3, "class", "menu-item large svelte-tsebii");
    			toggle_class(div3, "selected", /*settingsSelected*/ ctx[3]);
    			add_location(div3, file$7, 63, 12, 2153);
    			if (!src_url_equal(img2.src, img2_src_value = "/img/Gear.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-tsebii");
    			add_location(img2, file$7, 73, 16, 2613);
    			attr_dev(span2, "class", "svelte-tsebii");
    			add_location(span2, file$7, 74, 16, 2655);
    			attr_dev(div4, "class", "menu-item svelte-tsebii");
    			toggle_class(div4, "selected", /*wifiSettingsSelected*/ ctx[4]);
    			add_location(div4, file$7, 70, 12, 2440);
    			if (!src_url_equal(img3.src, img3_src_value = "/img/Info.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-tsebii");
    			add_location(img3, file$7, 80, 16, 2882);
    			attr_dev(span3, "class", "svelte-tsebii");
    			add_location(span3, file$7, 81, 16, 2924);
    			attr_dev(div5, "class", "menu-item svelte-tsebii");
    			toggle_class(div5, "selected", /*aboutSelected*/ ctx[5]);
    			add_location(div5, file$7, 77, 12, 2723);
    			attr_dev(div6, "class", "settings-menu svelte-tsebii");
    			add_location(div6, file$7, 61, 8, 2112);
    			attr_dev(span4, "class", "svelte-tsebii");
    			add_location(span4, file$7, 86, 12, 3102);
    			if (!src_url_equal(img4.src, img4_src_value = "/img/ico_start.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-tsebii");
    			add_location(img4, file$7, 87, 12, 3143);
    			attr_dev(button, "class", "start-button svelte-tsebii");
    			button.disabled = button_disabled_value = !/*canGoToDashboard*/ ctx[1];
    			add_location(button, file$7, 85, 8, 2996);
    			attr_dev(nav, "class", "column svelte-tsebii");
    			toggle_class(nav, "hidden", !/*navExpanded*/ ctx[7]);
    			add_location(nav, file$7, 37, 4, 1212);
    			attr_dev(main, "class", "svelte-tsebii");
    			add_location(main, file$7, 91, 4, 3209);
    			attr_dev(div7, "class", "row full");
    			add_location(div7, file$7, 36, 0, 1185);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, nav);
    			append_dev(nav, div0);
    			mount_component(hamburger, div0, null);
    			append_dev(nav, t0);
    			if (if_block0) if_block0.m(nav, null);
    			append_dev(nav, t1);
    			append_dev(nav, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t2);
    			append_dev(div1, span0);
    			append_dev(nav, t4);
    			append_dev(nav, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(nav, t5);
    			append_dev(nav, div6);
    			append_dev(div6, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t6);
    			append_dev(div3, span1);
    			append_dev(div6, t8);
    			append_dev(div6, div4);
    			append_dev(div4, img2);
    			append_dev(div4, t9);
    			append_dev(div4, span2);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t12);
    			append_dev(div5, span3);
    			append_dev(nav, t14);
    			append_dev(nav, button);
    			append_dev(button, span4);
    			append_dev(button, t16);
    			append_dev(button, img4);
    			append_dev(div7, t17);
    			append_dev(div7, main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(div3, "click", /*click_handler_2*/ ctx[13], false, false, false),
    					listen_dev(div4, "click", /*click_handler_3*/ ctx[14], false, false, false),
    					listen_dev(div5, "click", /*click_handler_4*/ ctx[15], false, false, false),
    					listen_dev(button, "click", /*click_handler_5*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const hamburger_changes = {};

    			if (!updating_value && dirty & /*navExpanded*/ 128) {
    				updating_value = true;
    				hamburger_changes.value = /*navExpanded*/ ctx[7];
    				add_flush_callback(() => updating_value = false);
    			}

    			hamburger.$set(hamburger_changes);

    			if (dirty & /*navExpanded*/ 128) {
    				toggle_class(div0, "burger", /*navExpanded*/ ctx[7]);
    			}

    			if (/*navExpanded*/ ctx[7]) {
    				if (if_block0) {
    					if (dirty & /*navExpanded*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(nav, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*sensorsSelected*/ 64) {
    				toggle_class(div1, "selected", /*sensorsSelected*/ ctx[6]);
    			}

    			if (dirty & /*selectedSensorIdx, sensors, resetSelection*/ 517) {
    				each_value = /*sensors*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, destroy_block, create_each_block$1, null, get_each_context$1);
    			}

    			if (dirty & /*settingsSelected*/ 8) {
    				toggle_class(div3, "selected", /*settingsSelected*/ ctx[3]);
    			}

    			if (dirty & /*wifiSettingsSelected*/ 16) {
    				toggle_class(div4, "selected", /*wifiSettingsSelected*/ ctx[4]);
    			}

    			if (dirty & /*aboutSelected*/ 32) {
    				toggle_class(div5, "selected", /*aboutSelected*/ ctx[5]);
    			}

    			if (!current || dirty & /*canGoToDashboard*/ 2 && button_disabled_value !== (button_disabled_value = !/*canGoToDashboard*/ ctx[1])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (dirty & /*navExpanded*/ 128) {
    				toggle_class(nav, "hidden", !/*navExpanded*/ ctx[7]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(main, null);
    				} else {
    					if_block1 = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburger.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburger.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(hamburger);
    			if (if_block0) if_block0.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainView', slots, []);
    	let { sensors = [] } = $$props;
    	let { canGoToDashboard = false } = $$props;

    	// Inner
    	const dispatch = createEventDispatcher();

    	let selectedSensorIdx = -1;
    	let settingsSelected = false;
    	let wifiSettingsSelected = false;
    	let aboutSelected = false;
    	let sensorsSelected = false;
    	let navExpanded = self.innerWidth > 800;

    	function resetSelection() {
    		$$invalidate(2, selectedSensorIdx = -1);
    		$$invalidate(3, settingsSelected = false);
    		$$invalidate(5, aboutSelected = false);
    		$$invalidate(6, sensorsSelected = false);
    		$$invalidate(4, wifiSettingsSelected = false);
    	}

    	onMount(() => {
    		self.addEventListener("resize", () => {
    			$$invalidate(7, navExpanded = self.innerWidth > 800);
    		});
    	});

    	const writable_props = ['sensors', 'canGoToDashboard'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainView> was created with unknown prop '${key}'`);
    	});

    	function hamburger_value_binding(value) {
    		navExpanded = value;
    		$$invalidate(7, navExpanded);
    	}

    	const click_handler = () => {
    		resetSelection();
    		$$invalidate(6, sensorsSelected = true);
    	};

    	const click_handler_1 = i => {
    		resetSelection();
    		$$invalidate(2, selectedSensorIdx = i);
    	};

    	const click_handler_2 = () => {
    		resetSelection();
    		$$invalidate(3, settingsSelected = true);
    	};

    	const click_handler_3 = () => {
    		resetSelection();
    		$$invalidate(4, wifiSettingsSelected = true);
    	};

    	const click_handler_4 = () => {
    		resetSelection();
    		$$invalidate(5, aboutSelected = true);
    	};

    	const click_handler_5 = () => dispatch('start');

    	$$self.$$set = $$props => {
    		if ('sensors' in $$props) $$invalidate(0, sensors = $$props.sensors);
    		if ('canGoToDashboard' in $$props) $$invalidate(1, canGoToDashboard = $$props.canGoToDashboard);
    	};

    	$$self.$capture_state = () => ({
    		Logo,
    		strings: strings$1,
    		AboutView,
    		SensorSettingsView,
    		createEventDispatcher,
    		onMount,
    		SettingsView,
    		WifiSettingsView,
    		Hamburger,
    		sensors,
    		canGoToDashboard,
    		dispatch,
    		selectedSensorIdx,
    		settingsSelected,
    		wifiSettingsSelected,
    		aboutSelected,
    		sensorsSelected,
    		navExpanded,
    		resetSelection
    	});

    	$$self.$inject_state = $$props => {
    		if ('sensors' in $$props) $$invalidate(0, sensors = $$props.sensors);
    		if ('canGoToDashboard' in $$props) $$invalidate(1, canGoToDashboard = $$props.canGoToDashboard);
    		if ('selectedSensorIdx' in $$props) $$invalidate(2, selectedSensorIdx = $$props.selectedSensorIdx);
    		if ('settingsSelected' in $$props) $$invalidate(3, settingsSelected = $$props.settingsSelected);
    		if ('wifiSettingsSelected' in $$props) $$invalidate(4, wifiSettingsSelected = $$props.wifiSettingsSelected);
    		if ('aboutSelected' in $$props) $$invalidate(5, aboutSelected = $$props.aboutSelected);
    		if ('sensorsSelected' in $$props) $$invalidate(6, sensorsSelected = $$props.sensorsSelected);
    		if ('navExpanded' in $$props) $$invalidate(7, navExpanded = $$props.navExpanded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sensors,
    		canGoToDashboard,
    		selectedSensorIdx,
    		settingsSelected,
    		wifiSettingsSelected,
    		aboutSelected,
    		sensorsSelected,
    		navExpanded,
    		dispatch,
    		resetSelection,
    		hamburger_value_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class MainView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { sensors: 0, canGoToDashboard: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainView",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get sensors() {
    		throw new Error("<MainView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sensors(value) {
    		throw new Error("<MainView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canGoToDashboard() {
    		throw new Error("<MainView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canGoToDashboard(value) {
    		throw new Error("<MainView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class BioLab extends Lab {
        constructor(repository) {
            super(repository);
            this.availableSensors = [
                SensorType.TempSensor,
                SensorType.PhSensor,
                SensorType.HumiditySensor,
                SensorType.LightSensor,
                SensorType.TempOutsideSensor,
            ];
        }
        get labType() {
            return LabType.Bio;
        }
        ;
    }

    class EcoLab extends Lab {
        constructor(repository) {
            super(repository);
            this.availableSensors = [];
            this.valuesTemp = new Map();
        }
        get labType() { return LabType.Eco; }
        ;
    }

    class ChemLab extends Lab {
        constructor(repository) {
            super(repository);
            this.availableSensors = [
                SensorType.TempSensor,
                SensorType.PhSensor,
                SensorType.ElectricalConductivitySensor,
            ];
            this.valuesTemp = new Map();
        }
        get labType() { return LabType.Chem; }
        ;
        updateModes(rawValues) {
            this.conductometerMode = rawValues.conductometerMode;
        }
        setMode(sensorType, modeIdx) {
            // TODO: implement set conductivity mode
        }
        getMode(sensorType) {
            switch (sensorType) {
                case (SensorType.ElectricalConductivitySensor):
                    return this.conductometerMode;
            }
            return undefined;
        }
    }

    class PhysicsLab extends Lab {
        constructor(repository) {
            super(repository);
            this.availableSensors = [
                SensorType.TempSensor,
                SensorType.AbsolutePressureSensor,
                SensorType.TeslameterSensor,
                SensorType.VoltmeterSensor,
                SensorType.AmpermetrSensor,
                SensorType.AccelerometerXSensor,
                SensorType.AccelerometerYSensor,
                SensorType.AccelerometerZSensor,
            ];
            this.valuesTemp = new Map();
        }
        get labType() { return LabType.Eco; }
        ;
        updateModes(rawValues) {
            this.accelerometerMode = rawValues.accelerometerMode;
        }
        setMode(sensorType, modeIdx) {
            // TODO: implement accelerometer mode
        }
        getMode(sensorType) {
            switch (sensorType) {
                case (SensorType.AccelerometerXSensor):
                case (SensorType.AccelerometerYSensor):
                case (SensorType.AccelerometerZSensor):
                    return this.accelerometerMode;
            }
        }
    }

    class LabFactory {
        static async create(labRepository) {
            try {
                const labType = await labRepository.getLabType();
                switch (labType) {
                    case (LabType.Phys):
                        return await new PhysicsLab(labRepository).init();
                    case (LabType.Chem):
                        return await new ChemLab(labRepository).init();
                    case (LabType.Eco):
                        return await new EcoLab(labRepository).init();
                    case (LabType.Bio):
                        return await new BioLab(labRepository).init();
                    default: throw new RangeError();
                }
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
    }

    /* src\components\SidebarSensor.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\components\\SidebarSensor.svelte";

    function create_fragment$8(ctx) {
    	let t0;
    	let div4;
    	let img;
    	let img_src_value;
    	let t1;
    	let label0;
    	let t2;
    	let t3;
    	let div3;
    	let div0;
    	let span0;
    	let t4;
    	let t5;
    	let span1;
    	let t6;
    	let t7;
    	let button0;
    	let t8;
    	let hr;
    	let t9;
    	let form;
    	let div1;
    	let label1;
    	let t11;
    	let input0;
    	let t12;
    	let div2;
    	let label2;
    	let t14;
    	let input1;
    	let t15;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = space();
    			div4 = element("div");
    			img = element("img");
    			t1 = space();
    			label0 = element("label");
    			t2 = text(/*label*/ ctx[7]);
    			t3 = space();
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t4 = text(/*value*/ ctx[4]);
    			t5 = space();
    			span1 = element("span");
    			t6 = text(/*unit*/ ctx[5]);
    			t7 = space();
    			button0 = element("button");
    			t8 = space();
    			hr = element("hr");
    			t9 = space();
    			form = element("form");
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = `${strings$1.maxY}`;
    			t11 = space();
    			input0 = element("input");
    			t12 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = `${strings$1.maxX}`;
    			t14 = space();
    			input1 = element("input");
    			t15 = space();
    			button1 = element("button");
    			button1.textContent = `${strings$1.apply}`;
    			if (!src_url_equal(img.src, img_src_value = /*icon*/ ctx[6])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "icon svelte-13z7ss7");
    			add_location(img, file$6, 27, 4, 840);
    			attr_dev(label0, "class", "sensor-label svelte-13z7ss7");
    			add_location(label0, file$6, 28, 4, 876);
    			attr_dev(span0, "class", "value svelte-13z7ss7");
    			add_location(span0, file$6, 33, 12, 1030);
    			attr_dev(span1, "class", "unit");
    			add_location(span1, file$6, 34, 12, 1077);
    			attr_dev(button0, "class", "expander-button svelte-13z7ss7");
    			add_location(button0, file$6, 35, 12, 1122);
    			attr_dev(div0, "class", "expander-header svelte-13z7ss7");
    			add_location(div0, file$6, 32, 8, 988);
    			attr_dev(hr, "class", "expander-hr svelte-13z7ss7");
    			add_location(hr, file$6, 38, 8, 1245);
    			add_location(label1, file$6, 42, 16, 1405);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", /*minValue*/ ctx[1]);
    			attr_dev(input0, "max", /*max*/ ctx[9]);
    			attr_dev(input0, "class", "svelte-13z7ss7");
    			add_location(input0, file$6, 43, 16, 1451);
    			attr_dev(div1, "class", "row min-max svelte-13z7ss7");
    			add_location(div1, file$6, 41, 12, 1363);
    			add_location(label2, file$6, 46, 16, 1593);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", /*min*/ ctx[8]);
    			attr_dev(input1, "max", /*maxValue*/ ctx[2]);
    			attr_dev(input1, "class", "svelte-13z7ss7");
    			add_location(input1, file$6, 47, 16, 1639);
    			attr_dev(div2, "class", "row min-max svelte-13z7ss7");
    			add_location(div2, file$6, 45, 12, 1551);
    			attr_dev(button1, "class", "apply-button svelte-13z7ss7");
    			add_location(button1, file$6, 49, 12, 1739);
    			attr_dev(form, "class", "expander-body svelte-13z7ss7");
    			add_location(form, file$6, 40, 8, 1279);
    			attr_dev(div3, "class", "expander svelte-13z7ss7");
    			toggle_class(div3, "expander_open", /*expanded*/ ctx[0]);
    			add_location(div3, file$6, 30, 4, 925);
    			attr_dev(div4, "class", "content-wrapper svelte-13z7ss7");
    			toggle_class(div4, "selected", /*selected*/ ctx[3]);
    			add_location(div4, file$6, 26, 0, 771);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, img);
    			append_dev(div4, t1);
    			append_dev(div4, label0);
    			append_dev(label0, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, span1);
    			append_dev(span1, t6);
    			append_dev(div0, t7);
    			append_dev(div0, button0);
    			append_dev(div3, t8);
    			append_dev(div3, hr);
    			append_dev(div3, t9);
    			append_dev(div3, form);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t11);
    			append_dev(div1, input0);
    			set_input_value(input0, /*maxValue*/ ctx[2]);
    			append_dev(form, t12);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t14);
    			append_dev(div2, input1);
    			set_input_value(input1, /*minValue*/ ctx[1]);
    			append_dev(form, t15);
    			append_dev(form, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", stop_propagation(/*click_handler_1*/ ctx[12]), false, false, true),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(button1, "click", /*emitApplyMinMax*/ ctx[10], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*emitApplyMinMax*/ ctx[10]), false, true, false),
    					listen_dev(div4, "click", /*click_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 64 && !src_url_equal(img.src, img_src_value = /*icon*/ ctx[6])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*label*/ 128) set_data_dev(t2, /*label*/ ctx[7]);
    			if (dirty & /*value*/ 16) set_data_dev(t4, /*value*/ ctx[4]);
    			if (dirty & /*unit*/ 32) set_data_dev(t6, /*unit*/ ctx[5]);

    			if (dirty & /*minValue*/ 2) {
    				attr_dev(input0, "min", /*minValue*/ ctx[1]);
    			}

    			if (dirty & /*maxValue*/ 4 && to_number(input0.value) !== /*maxValue*/ ctx[2]) {
    				set_input_value(input0, /*maxValue*/ ctx[2]);
    			}

    			if (dirty & /*maxValue*/ 4) {
    				attr_dev(input1, "max", /*maxValue*/ ctx[2]);
    			}

    			if (dirty & /*minValue*/ 2 && to_number(input1.value) !== /*minValue*/ ctx[1]) {
    				set_input_value(input1, /*minValue*/ ctx[1]);
    			}

    			if (dirty & /*expanded*/ 1) {
    				toggle_class(div3, "expander_open", /*expanded*/ ctx[0]);
    			}

    			if (dirty & /*selected*/ 8) {
    				toggle_class(div4, "selected", /*selected*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SidebarSensor', slots, []);
    	let { expanded = false } = $$props;
    	let { selected = false } = $$props;
    	let { value = 0 } = $$props;
    	let { unit = "у.е." } = $$props;
    	let { minValue = 0 } = $$props;
    	let { maxValue = 0 } = $$props;
    	let { icon = "/sensors/Amper.png" } = $$props;
    	let { label = "Датчик" } = $$props;
    	const min = minValue;
    	const max = maxValue;
    	const eventDispatcher = createEventDispatcher();

    	function emitApplyMinMax() {
    		if (minValue < min) $$invalidate(1, minValue = min);
    		if (maxValue > max) $$invalidate(2, maxValue = max);
    		if (minValue > maxValue) $$invalidate(1, minValue = maxValue);
    		eventDispatcher('applyMinMax', { min: minValue, max: maxValue });
    	}

    	const writable_props = [
    		'expanded',
    		'selected',
    		'value',
    		'unit',
    		'minValue',
    		'maxValue',
    		'icon',
    		'label'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SidebarSensor> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => {
    		$$invalidate(0, expanded = !expanded);
    	};

    	function input0_input_handler() {
    		maxValue = to_number(this.value);
    		$$invalidate(2, maxValue);
    	}

    	function input1_input_handler() {
    		minValue = to_number(this.value);
    		$$invalidate(1, minValue);
    	}

    	$$self.$$set = $$props => {
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('unit' in $$props) $$invalidate(5, unit = $$props.unit);
    		if ('minValue' in $$props) $$invalidate(1, minValue = $$props.minValue);
    		if ('maxValue' in $$props) $$invalidate(2, maxValue = $$props.maxValue);
    		if ('icon' in $$props) $$invalidate(6, icon = $$props.icon);
    		if ('label' in $$props) $$invalidate(7, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({
    		strings: strings$1,
    		createEventDispatcher,
    		expanded,
    		selected,
    		value,
    		unit,
    		minValue,
    		maxValue,
    		icon,
    		label,
    		min,
    		max,
    		eventDispatcher,
    		emitApplyMinMax
    	});

    	$$self.$inject_state = $$props => {
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('unit' in $$props) $$invalidate(5, unit = $$props.unit);
    		if ('minValue' in $$props) $$invalidate(1, minValue = $$props.minValue);
    		if ('maxValue' in $$props) $$invalidate(2, maxValue = $$props.maxValue);
    		if ('icon' in $$props) $$invalidate(6, icon = $$props.icon);
    		if ('label' in $$props) $$invalidate(7, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		expanded,
    		minValue,
    		maxValue,
    		selected,
    		value,
    		unit,
    		icon,
    		label,
    		min,
    		max,
    		emitApplyMinMax,
    		click_handler,
    		click_handler_1,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class SidebarSensor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			expanded: 0,
    			selected: 3,
    			value: 4,
    			unit: 5,
    			minValue: 1,
    			maxValue: 2,
    			icon: 6,
    			label: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SidebarSensor",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get expanded() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minValue() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minValue(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxValue() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxValue(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<SidebarSensor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<SidebarSensor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SensorChart.svelte generated by Svelte v3.48.0 */

    const { Error: Error_1, Object: Object_1 } = globals;
    const file$5 = "src\\components\\SensorChart.svelte";

    function create_fragment$7(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let span0;
    	let t0_value = strings$1.chartCrosshairValue + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let br;
    	let t4;
    	let span1;
    	let t5_value = strings$1.chartCrosshairTime + "";
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9_value = strings$1.timeFormat + "";
    	let t9;
    	let t10;
    	let div0_hidden_value;
    	let style_top = `${/*crosshairLabelOffsetY*/ ctx[4]}px`;
    	let t11;
    	let div2;
    	let t13;
    	let div3;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(/*crosshairCurrentValue*/ ctx[2]);
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			span1 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(/*crosshairCurrentTime*/ ctx[3]);
    			t8 = text(" [");
    			t9 = text(t9_value);
    			t10 = text("]");
    			t11 = space();
    			div2 = element("div");
    			div2.textContent = `${/*labelY*/ ctx[9]}`;
    			t13 = space();
    			div3 = element("div");
    			div3.textContent = `${/*labelX*/ ctx[8]}`;
    			add_location(span0, file$5, 160, 12, 5263);
    			add_location(br, file$5, 160, 79, 5330);
    			add_location(span1, file$5, 161, 12, 5347);
    			attr_dev(div0, "class", "crosshair-label");
    			div0.hidden = div0_hidden_value = !/*crosshairLabelVisible*/ ctx[5];
    			set_style(div0, "top", style_top, false);
    			set_style(div0, "left", /*crosshairLeftOffset*/ ctx[7], false);
    			set_style(div0, "right", /*crosshairRightOffset*/ ctx[6], false);
    			add_location(div0, file$5, 158, 8, 5070);
    			attr_dev(div1, "class", "chart");
    			add_location(div1, file$5, 157, 4, 5017);
    			attr_dev(div2, "class", "chart-label chart-label-y");
    			add_location(div2, file$5, 164, 4, 5465);
    			attr_dev(div3, "class", "chart-label chart-label-x");
    			add_location(div3, file$5, 165, 4, 5523);
    			attr_dev(div4, "class", "chart-wrapper");
    			toggle_class(div4, "hidden", !/*isVisible*/ ctx[0]);
    			add_location(div4, file$5, 156, 0, 4959);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, br);
    			append_dev(div0, t4);
    			append_dev(div0, span1);
    			append_dev(span1, t5);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    			append_dev(span1, t8);
    			append_dev(span1, t9);
    			append_dev(span1, t10);
    			/*div1_binding*/ ctx[22](div1);
    			append_dev(div4, t11);
    			append_dev(div4, div2);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*crosshairCurrentValue*/ 4) set_data_dev(t2, /*crosshairCurrentValue*/ ctx[2]);
    			if (dirty[0] & /*crosshairCurrentTime*/ 8) set_data_dev(t7, /*crosshairCurrentTime*/ ctx[3]);

    			if (dirty[0] & /*crosshairLabelVisible*/ 32 && div0_hidden_value !== (div0_hidden_value = !/*crosshairLabelVisible*/ ctx[5])) {
    				prop_dev(div0, "hidden", div0_hidden_value);
    			}

    			if (dirty[0] & /*crosshairLabelOffsetY*/ 16 && style_top !== (style_top = `${/*crosshairLabelOffsetY*/ ctx[4]}px`)) {
    				set_style(div0, "top", style_top, false);
    			}

    			if (dirty[0] & /*crosshairLeftOffset*/ 128) {
    				set_style(div0, "left", /*crosshairLeftOffset*/ ctx[7], false);
    			}

    			if (dirty[0] & /*crosshairRightOffset*/ 64) {
    				set_style(div0, "right", /*crosshairRightOffset*/ ctx[6], false);
    			}

    			if (dirty[0] & /*isVisible*/ 1) {
    				toggle_class(div4, "hidden", !/*isVisible*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			/*div1_binding*/ ctx[22](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let crosshairLabelRight;
    	let crosshairLeftOffset;
    	let crosshairRightOffset;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SensorChart', slots, []);
    	let { isVisible = true } = $$props;
    	let { numberOfVisiblePoints = 100 } = $$props;
    	let { sensor } = $$props;
    	if (sensor === undefined) throw Error('SensorChart: Sensor must be specified');

    	// Internal
    	let minValue = sensor.mode.minValue;

    	let maxValue = sensor.mode.maxValue;
    	const labelX = strings$1.time;
    	const unit = sensor.mode.unit;
    	const labelY = `${sensor.name} [${sensor.mode.unit}]`;
    	const lineColor = sensor.lineColor;
    	const markerColor = sensor.markerColor;
    	const lineSize = sensor.lineSize;
    	const markerSize = sensor.markerSize;
    	const data = [];
    	let chartElement;
    	let timeScale = undefined;
    	let chart;
    	let lineSeries;
    	let isPaused = false;
    	let crosshairCurrentValue = "";
    	let crosshairCurrentTime = "";
    	let crosshairLabelOffsetX = 0;
    	let crosshairLabelOffsetY = 0;
    	let crosshairLabelVisible = false;

    	onMount(() => {
    		chart = Ls(chartElement, {
    			crosshair: { vertLine: { labelVisible: false } },
    			rightPriceScale: {
    				scaleMargins: { top: 0.01, bottom: 0.01 }
    			}
    		});

    		timeScale = chart.timeScale();

    		timeScale.applyOptions({
    			timeVisible: true,
    			secondsVisible: true,
    			tickMarkFormatter: msToString
    		});

    		timeScale.setVisibleLogicalRange({
    			from: -(numberOfVisiblePoints / 2),
    			to: numberOfVisiblePoints / 2
    		});

    		lineSeries = chart.addLineSeries({
    			lastValueVisible: true,
    			color: lineColor,
    			lineWidth: lineSize
    		});

    		chart.subscribeCrosshairMove(event => {
    			$$invalidate(5, crosshairLabelVisible = event.time && event.seriesPrices.size > 0);
    			if (!crosshairLabelVisible) return;
    			const value = event.seriesPrices.get(lineSeries);
    			$$invalidate(2, crosshairCurrentValue = value + unit);
    			$$invalidate(3, crosshairCurrentTime = msToString(event.time));
    			$$invalidate(20, crosshairLabelOffsetX = event.point.x);
    			$$invalidate(4, crosshairLabelOffsetY = event.point.y);
    		});

    		update();

    		const onResize = () => {
    			chart.resize(chartElement.clientWidth, chartElement.clientHeight, true);
    		};

    		window.addEventListener('resize', onResize);
    		applyMinMax(minValue, maxValue);

    		return () => {
    			chart.remove();
    			window.removeEventListener('resize', onResize);
    		};
    	});

    	const defaultMarker = {
    		time: 0,
    		position: 'inBar',
    		color: markerColor,
    		shape: 'circle',
    		size: markerSize
    	};

    	function update() {
    		lineSeries === null || lineSeries === void 0
    		? void 0
    		: lineSeries.setData(data);

    		lineSeries === null || lineSeries === void 0
    		? void 0
    		: lineSeries.setMarkers(data.map(d => getMarker(d.time)));
    	}

    	function getMarker(time) {
    		const copy = Object.assign({}, defaultMarker);
    		copy.time = time;
    		return copy;
    	}

    	function addData(newValue) {
    		data.push(newValue);
    		if (!isPaused && isVisible) update(); // optimization
    	}

    	function zoomIn() {
    		const range = timeScale.getVisibleLogicalRange();
    		const step = range.to / 10;
    		range.to -= step;
    		range.from += step;
    		if (range.to < range.from) return;
    		timeScale.setVisibleLogicalRange(range);
    	}

    	function zoomOut() {
    		const range = timeScale.getVisibleLogicalRange();
    		const step = range.to / 10;
    		range.to += step;
    		range.from -= step;
    		timeScale.setVisibleLogicalRange(range);
    	}

    	function resetZoom() {
    		const pivot = data.length;

    		timeScale.setVisibleLogicalRange({
    			from: pivot - numberOfVisiblePoints / 2,
    			to: pivot + numberOfVisiblePoints / 2
    		});
    	}

    	function pause() {
    		$$invalidate(19, isPaused = true);
    		update();
    	}

    	function start() {
    		$$invalidate(19, isPaused = false);
    		update();
    	}

    	function applyMinMax(min, max) {
    		lineSeries.applyOptions({
    			autoscaleInfoProvider: () => ({
    				priceRange: { minValue: min, maxValue: max },
    				margins: { above: 0.1, below: 0.1 }
    			})
    		});
    	}

    	const writable_props = ['isVisible', 'numberOfVisiblePoints', 'sensor'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SensorChart> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chartElement = $$value;
    			$$invalidate(1, chartElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isVisible' in $$props) $$invalidate(0, isVisible = $$props.isVisible);
    		if ('numberOfVisiblePoints' in $$props) $$invalidate(10, numberOfVisiblePoints = $$props.numberOfVisiblePoints);
    		if ('sensor' in $$props) $$invalidate(11, sensor = $$props.sensor);
    	};

    	$$self.$capture_state = () => ({
    		createChart: Ls,
    		onMount,
    		msToString,
    		strings: strings$1,
    		isVisible,
    		numberOfVisiblePoints,
    		sensor,
    		minValue,
    		maxValue,
    		labelX,
    		unit,
    		labelY,
    		lineColor,
    		markerColor,
    		lineSize,
    		markerSize,
    		data,
    		chartElement,
    		timeScale,
    		chart,
    		lineSeries,
    		isPaused,
    		crosshairCurrentValue,
    		crosshairCurrentTime,
    		crosshairLabelOffsetX,
    		crosshairLabelOffsetY,
    		crosshairLabelVisible,
    		defaultMarker,
    		update,
    		getMarker,
    		addData,
    		zoomIn,
    		zoomOut,
    		resetZoom,
    		pause,
    		start,
    		applyMinMax,
    		crosshairLabelRight,
    		crosshairRightOffset,
    		crosshairLeftOffset
    	});

    	$$self.$inject_state = $$props => {
    		if ('isVisible' in $$props) $$invalidate(0, isVisible = $$props.isVisible);
    		if ('numberOfVisiblePoints' in $$props) $$invalidate(10, numberOfVisiblePoints = $$props.numberOfVisiblePoints);
    		if ('sensor' in $$props) $$invalidate(11, sensor = $$props.sensor);
    		if ('minValue' in $$props) minValue = $$props.minValue;
    		if ('maxValue' in $$props) maxValue = $$props.maxValue;
    		if ('chartElement' in $$props) $$invalidate(1, chartElement = $$props.chartElement);
    		if ('timeScale' in $$props) timeScale = $$props.timeScale;
    		if ('chart' in $$props) chart = $$props.chart;
    		if ('lineSeries' in $$props) lineSeries = $$props.lineSeries;
    		if ('isPaused' in $$props) $$invalidate(19, isPaused = $$props.isPaused);
    		if ('crosshairCurrentValue' in $$props) $$invalidate(2, crosshairCurrentValue = $$props.crosshairCurrentValue);
    		if ('crosshairCurrentTime' in $$props) $$invalidate(3, crosshairCurrentTime = $$props.crosshairCurrentTime);
    		if ('crosshairLabelOffsetX' in $$props) $$invalidate(20, crosshairLabelOffsetX = $$props.crosshairLabelOffsetX);
    		if ('crosshairLabelOffsetY' in $$props) $$invalidate(4, crosshairLabelOffsetY = $$props.crosshairLabelOffsetY);
    		if ('crosshairLabelVisible' in $$props) $$invalidate(5, crosshairLabelVisible = $$props.crosshairLabelVisible);
    		if ('crosshairLabelRight' in $$props) $$invalidate(21, crosshairLabelRight = $$props.crosshairLabelRight);
    		if ('crosshairRightOffset' in $$props) $$invalidate(6, crosshairRightOffset = $$props.crosshairRightOffset);
    		if ('crosshairLeftOffset' in $$props) $$invalidate(7, crosshairLeftOffset = $$props.crosshairLeftOffset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*crosshairLabelOffsetX, chartElement*/ 1048578) {
    			$$invalidate(21, crosshairLabelRight = crosshairLabelOffsetX < (chartElement === null || chartElement === void 0
    			? void 0
    			: chartElement.clientWidth) / 2);
    		}

    		if ($$self.$$.dirty[0] & /*crosshairLabelRight, crosshairLabelOffsetX*/ 3145728) {
    			$$invalidate(7, crosshairLeftOffset = crosshairLabelRight ? crosshairLabelOffsetX + 'px' : '');
    		}

    		if ($$self.$$.dirty[0] & /*crosshairLabelRight, chartElement, crosshairLabelOffsetX*/ 3145730) {
    			$$invalidate(6, crosshairRightOffset = crosshairLabelRight
    			? ''
    			: (chartElement === null || chartElement === void 0
    				? void 0
    				: chartElement.clientWidth) - crosshairLabelOffsetX + "px");
    		}

    		if ($$self.$$.dirty[0] & /*isVisible, isPaused*/ 524289) {
    			// External
    			// Subscribe to visible changed
    			isVisible && !isPaused && update();
    		}
    	};

    	return [
    		isVisible,
    		chartElement,
    		crosshairCurrentValue,
    		crosshairCurrentTime,
    		crosshairLabelOffsetY,
    		crosshairLabelVisible,
    		crosshairRightOffset,
    		crosshairLeftOffset,
    		labelX,
    		labelY,
    		numberOfVisiblePoints,
    		sensor,
    		addData,
    		zoomIn,
    		zoomOut,
    		resetZoom,
    		pause,
    		start,
    		applyMinMax,
    		isPaused,
    		crosshairLabelOffsetX,
    		crosshairLabelRight,
    		div1_binding
    	];
    }

    class SensorChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				isVisible: 0,
    				numberOfVisiblePoints: 10,
    				sensor: 11,
    				addData: 12,
    				zoomIn: 13,
    				zoomOut: 14,
    				resetZoom: 15,
    				pause: 16,
    				start: 17,
    				applyMinMax: 18
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SensorChart",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sensor*/ ctx[11] === undefined && !('sensor' in props)) {
    			console.warn("<SensorChart> was created without expected prop 'sensor'");
    		}
    	}

    	get isVisible() {
    		throw new Error_1("<SensorChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVisible(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfVisiblePoints() {
    		throw new Error_1("<SensorChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfVisiblePoints(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sensor() {
    		throw new Error_1("<SensorChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sensor(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addData() {
    		return this.$$.ctx[12];
    	}

    	set addData(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zoomIn() {
    		return this.$$.ctx[13];
    	}

    	set zoomIn(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zoomOut() {
    		return this.$$.ctx[14];
    	}

    	set zoomOut(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetZoom() {
    		return this.$$.ctx[15];
    	}

    	set resetZoom(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pause() {
    		return this.$$.ctx[16];
    	}

    	set pause(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		return this.$$.ctx[17];
    	}

    	set start(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get applyMinMax() {
    		return this.$$.ctx[18];
    	}

    	set applyMinMax(value) {
    		throw new Error_1("<SensorChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CustomEvent;
    (function (CustomEvent) {
        CustomEvent["Back"] = "back";
    })(CustomEvent || (CustomEvent = {}));

    /* src\components\Modal.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\components\\Modal.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let button;
    	let span;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "×";
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-1pr0otm");
    			add_location(span, file$4, 26, 12, 565);
    			attr_dev(button, "class", "close-button svelte-1pr0otm");
    			add_location(button, file$4, 25, 8, 504);
    			attr_dev(div0, "class", "modal svelte-1pr0otm");
    			add_location(div0, file$4, 24, 4, 456);
    			attr_dev(div1, "class", "modal-wrapper svelte-1pr0otm");
    			add_location(div1, file$4, 23, 0, 424);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, span);
    			append_dev(div0, t1);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[4](div0);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClose*/ ctx[0])) /*onClose*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);

    	let { onClose = () => {
    		
    	} } = $$props;

    	// Internal
    	let content;

    	let portal;

    	onMount(() => {
    		portal = document.createElement('div');
    		portal.className = 'portal';
    		document.body.appendChild(portal);
    		portal.appendChild(content);
    	});

    	onDestroy(() => {
    		document.body.removeChild(portal);
    	});

    	const writable_props = ['onClose'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			content = $$value;
    			$$invalidate(1, content);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('onClose' in $$props) $$invalidate(0, onClose = $$props.onClose);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		onClose,
    		content,
    		portal
    	});

    	$$self.$inject_state = $$props => {
    		if ('onClose' in $$props) $$invalidate(0, onClose = $$props.onClose);
    		if ('content' in $$props) $$invalidate(1, content = $$props.content);
    		if ('portal' in $$props) portal = $$props.portal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClose, content, $$scope, slots, div0_binding];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { onClose: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get onClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ModalDashboardConfirm.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\components\\ModalDashboardConfirm.svelte";

    // (10:0) <Modal onClose={() => onClose(false)}>
    function create_default_slot$3(ctx) {
    	let div1;
    	let span0;
    	let raw0_value = strings$1.exitFromDashboardTitle + "";
    	let t0;
    	let span1;
    	let raw1_value = strings$1.exitFromDashboardText + "";
    	let t1;
    	let div0;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = `${strings$1.yes}`;
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = `${strings$1.no}`;
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = `${strings$1.reject}`;
    			attr_dev(span0, "class", "header");
    			add_location(span0, file$3, 11, 8, 326);
    			attr_dev(span1, "class", "text");
    			add_location(span1, file$3, 15, 8, 424);
    			add_location(button0, file$3, 18, 12, 535);
    			add_location(button1, file$3, 19, 12, 609);
    			add_location(button2, file$3, 20, 12, 683);
    			attr_dev(div0, "class", "row buttons");
    			add_location(div0, file$3, 17, 8, 497);
    			attr_dev(div1, "class", "modal-content column");
    			add_location(div1, file$3, 10, 4, 283);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			span0.innerHTML = raw0_value;
    			append_dev(div1, t0);
    			append_dev(div1, span1);
    			span1.innerHTML = raw1_value;
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(div0, t5);
    			append_dev(div0, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(10:0) <Modal onClose={() => onClose(false)}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				onClose: /*func*/ ctx[4],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*onClose*/ 1) modal_changes.onClose = /*func*/ ctx[4];

    			if (dirty & /*$$scope, onClose*/ 33) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const id = "dashboardExitConfirm";

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalDashboardConfirm', slots, []);

    	let { onClose = result => {
    		
    	} } = $$props;

    	const writable_props = ['onClose'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalDashboardConfirm> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => onClose(true);
    	const click_handler_1 = () => onClose(false);
    	const click_handler_2 = () => onClose(false);
    	const func = () => onClose(false);

    	$$self.$$set = $$props => {
    		if ('onClose' in $$props) $$invalidate(0, onClose = $$props.onClose);
    	};

    	$$self.$capture_state = () => ({ id, Modal, strings: strings$1, onClose });

    	$$self.$inject_state = $$props => {
    		if ('onClose' in $$props) $$invalidate(0, onClose = $$props.onClose);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClose, click_handler, click_handler_1, click_handler_2, func];
    }

    class ModalDashboardConfirm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { onClose: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalDashboardConfirm",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get onClose() {
    		throw new Error("<ModalDashboardConfirm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<ModalDashboardConfirm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ModalOpenSavedArchive.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\components\\ModalOpenSavedArchive.svelte";

    // (15:0) <Modal onClose={onClose}>
    function create_default_slot$2(ctx) {
    	let div2;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let div1;
    	let a;
    	let t4_value = strings$1.link + "";
    	let t4;
    	let t5;
    	let div0;
    	let button0;
    	let t7;
    	let button1;
    	let t9;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			span0 = element("span");
    			span0.textContent = `${strings$1.archiveSavedTitle}`;
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = `${strings$1.archiveSavedDescription}`;
    			t3 = space();
    			div1 = element("div");
    			a = element("a");
    			t4 = text(t4_value);
    			t5 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = `${strings$1.copy}`;
    			t7 = space();
    			button1 = element("button");
    			button1.textContent = `${strings$1.open}`;
    			t9 = space();
    			button2 = element("button");
    			button2.textContent = `${strings$1.close}`;
    			attr_dev(span0, "class", "header");
    			add_location(span0, file$2, 16, 8, 405);
    			attr_dev(span1, "class", "text");
    			add_location(span1, file$2, 17, 8, 469);
    			attr_dev(a, "href", /*link*/ ctx[0]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-cj89gl");
    			add_location(a, file$2, 19, 12, 596);
    			add_location(button0, file$2, 21, 16, 696);
    			add_location(button1, file$2, 22, 16, 779);
    			add_location(button2, file$2, 23, 16, 859);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$2, 20, 12, 658);
    			attr_dev(div1, "class", "row justify-between align-center");
    			add_location(div1, file$2, 18, 8, 537);
    			attr_dev(div2, "class", "modal-content svelte-cj89gl");
    			add_location(div2, file$2, 15, 4, 369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span0);
    			append_dev(div2, t1);
    			append_dev(div2, span1);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(a, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t7);
    			append_dev(div0, button1);
    			append_dev(div0, t9);
    			append_dev(div0, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*link*/ 1) {
    				attr_dev(a, "href", /*link*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(15:0) <Modal onClose={onClose}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				onClose: /*onClose*/ ctx[1],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};
    			if (dirty & /*onClose*/ 2) modal_changes.onClose = /*onClose*/ ctx[1];

    			if (dirty & /*$$scope, onClose, link*/ 131) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalOpenSavedArchive', slots, []);
    	let { link } = $$props;

    	let { onClose = () => {
    		
    	} } = $$props;

    	// Internal
    	function copyToClipboard() {
    		self.navigator.clipboard.writeText(link);
    	}

    	function openInNewTab() {
    		self.open(link, '_blank', 'noopener');
    	}

    	const writable_props = ['link', 'onClose'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalOpenSavedArchive> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => copyToClipboard();
    	const click_handler_1 = () => openInNewTab();
    	const click_handler_2 = () => onClose();

    	$$self.$$set = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    		if ('onClose' in $$props) $$invalidate(1, onClose = $$props.onClose);
    	};

    	$$self.$capture_state = () => ({
    		Modal,
    		strings: strings$1,
    		link,
    		onClose,
    		copyToClipboard,
    		openInNewTab
    	});

    	$$self.$inject_state = $$props => {
    		if ('link' in $$props) $$invalidate(0, link = $$props.link);
    		if ('onClose' in $$props) $$invalidate(1, onClose = $$props.onClose);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		link,
    		onClose,
    		copyToClipboard,
    		openInNewTab,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class ModalOpenSavedArchive extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { link: 0, onClose: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalOpenSavedArchive",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[0] === undefined && !('link' in props)) {
    			console.warn("<ModalOpenSavedArchive> was created without expected prop 'link'");
    		}
    	}

    	get link() {
    		throw new Error("<ModalOpenSavedArchive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<ModalOpenSavedArchive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClose() {
    		throw new Error("<ModalOpenSavedArchive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<ModalOpenSavedArchive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\DashboardView.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\views\\DashboardView.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[33] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    // (110:4) {#if (showExitConfirm)}
    function create_if_block$1(ctx) {
    	let modaldashboardconfirm;
    	let current;

    	modaldashboardconfirm = new ModalDashboardConfirm({
    			props: { onClose: /*func*/ ctx[24] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modaldashboardconfirm.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modaldashboardconfirm, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modaldashboardconfirm_changes = {};
    			if (dirty[0] & /*showExitConfirm*/ 1024) modaldashboardconfirm_changes.onClose = /*func*/ ctx[24];
    			modaldashboardconfirm.$set(modaldashboardconfirm_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modaldashboardconfirm.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modaldashboardconfirm.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modaldashboardconfirm, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(110:4) {#if (showExitConfirm)}",
    		ctx
    	});

    	return block;
    }

    // (116:12) {#each sensors as sensor, i}
    function create_each_block_1(ctx) {
    	let sidebarsensor;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[25](/*i*/ ctx[34]);
    	}

    	function applyMinMax_handler(...args) {
    		return /*applyMinMax_handler*/ ctx[26](/*i*/ ctx[34], ...args);
    	}

    	sidebarsensor = new SidebarSensor({
    			props: {
    				value: /*values*/ ctx[8][/*i*/ ctx[34]] ?? strings$1.noData,
    				selected: /*selectedIdx*/ ctx[3] === /*i*/ ctx[34],
    				maxValue: /*sensor*/ ctx[32].mode.maxValue,
    				minValue: /*sensor*/ ctx[32].mode.minValue,
    				label: /*sensor*/ ctx[32].name,
    				icon: /*sensor*/ ctx[32].ico,
    				unit: /*sensor*/ ctx[32].mode.unit
    			},
    			$$inline: true
    		});

    	sidebarsensor.$on("click", click_handler);
    	sidebarsensor.$on("applyMinMax", applyMinMax_handler);

    	const block = {
    		c: function create() {
    			create_component(sidebarsensor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebarsensor, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const sidebarsensor_changes = {};
    			if (dirty[0] & /*values*/ 256) sidebarsensor_changes.value = /*values*/ ctx[8][/*i*/ ctx[34]] ?? strings$1.noData;
    			if (dirty[0] & /*selectedIdx*/ 8) sidebarsensor_changes.selected = /*selectedIdx*/ ctx[3] === /*i*/ ctx[34];
    			if (dirty[0] & /*sensors*/ 1) sidebarsensor_changes.maxValue = /*sensor*/ ctx[32].mode.maxValue;
    			if (dirty[0] & /*sensors*/ 1) sidebarsensor_changes.minValue = /*sensor*/ ctx[32].mode.minValue;
    			if (dirty[0] & /*sensors*/ 1) sidebarsensor_changes.label = /*sensor*/ ctx[32].name;
    			if (dirty[0] & /*sensors*/ 1) sidebarsensor_changes.icon = /*sensor*/ ctx[32].ico;
    			if (dirty[0] & /*sensors*/ 1) sidebarsensor_changes.unit = /*sensor*/ ctx[32].mode.unit;
    			sidebarsensor.$set(sidebarsensor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebarsensor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebarsensor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebarsensor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(116:12) {#each sensors as sensor, i}",
    		ctx
    	});

    	return block;
    }

    // (162:12) {#each sensors as sensor, i}
    function create_each_block(ctx) {
    	let sensorchart;
    	let i = /*i*/ ctx[34];
    	let current;
    	const assign_sensorchart = () => /*sensorchart_binding*/ ctx[29](sensorchart, i);
    	const unassign_sensorchart = () => /*sensorchart_binding*/ ctx[29](null, i);

    	let sensorchart_props = {
    		isVisible: /*i*/ ctx[34] === /*selectedIdx*/ ctx[3] && /*dataDisplay*/ ctx[2] === DataDisplay.Graphics,
    		sensor: /*sensor*/ ctx[32],
    		numberOfVisiblePoints: /*numberOfVisiblePoints*/ ctx[12]
    	};

    	sensorchart = new SensorChart({ props: sensorchart_props, $$inline: true });
    	assign_sensorchart();

    	const block = {
    		c: function create() {
    			create_component(sensorchart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sensorchart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (i !== /*i*/ ctx[34]) {
    				unassign_sensorchart();
    				i = /*i*/ ctx[34];
    				assign_sensorchart();
    			}

    			const sensorchart_changes = {};
    			if (dirty[0] & /*selectedIdx, dataDisplay*/ 12) sensorchart_changes.isVisible = /*i*/ ctx[34] === /*selectedIdx*/ ctx[3] && /*dataDisplay*/ ctx[2] === DataDisplay.Graphics;
    			if (dirty[0] & /*sensors*/ 1) sensorchart_changes.sensor = /*sensor*/ ctx[32];
    			if (dirty[0] & /*numberOfVisiblePoints*/ 4096) sensorchart_changes.numberOfVisiblePoints = /*numberOfVisiblePoints*/ ctx[12];
    			sensorchart.$set(sensorchart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sensorchart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sensorchart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			unassign_sensorchart();
    			destroy_component(sensorchart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(162:12) {#each sensors as sensor, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t0;
    	let main;
    	let t1;
    	let div1;
    	let logo;
    	let t2;
    	let div0;
    	let t3;
    	let div6;
    	let div4;
    	let div2;
    	let backbutton;
    	let t4;
    	let h1;

    	let t5_value = (/*dataDisplay*/ ctx[2] === DataDisplay.Measures
    	? strings$1.measuresTitle
    	: strings$1.graphicsTitle) + "";

    	let t5;
    	let t6;
    	let div3;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let button0_disabled_value;
    	let t7;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let t8;
    	let button2;
    	let img2;
    	let img2_src_value;
    	let t9;
    	let button3;
    	let img3;
    	let img3_src_value;
    	let button3_disabled_value;
    	let t10;
    	let button4;
    	let img4;
    	let img4_src_value;
    	let button4_disabled_value;
    	let t11;
    	let button5;
    	let img5;
    	let img5_src_value;
    	let button5_disabled_value;
    	let t12;
    	let div5;
    	let t13;
    	let sensorstable;
    	let updating_rows;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*showExitConfirm*/ ctx[10] && create_if_block$1(ctx);
    	logo = new Logo({ $$inline: true });
    	let each_value_1 = /*sensors*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	backbutton = new BackButton({ $$inline: true });
    	backbutton.$on("click", /*goBack*/ ctx[18]);
    	let each_value = /*sensors*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function sensorstable_rows_binding(value) {
    		/*sensorstable_rows_binding*/ ctx[31](value);
    	}

    	let sensorstable_props = { headers: /*tableHeader*/ ctx[11] };

    	if (/*tableRows*/ ctx[9] !== void 0) {
    		sensorstable_props.rows = /*tableRows*/ ctx[9];
    	}

    	sensorstable = new DataTable({
    			props: sensorstable_props,
    			$$inline: true
    		});

    	/*sensorstable_binding*/ ctx[30](sensorstable);
    	binding_callbacks.push(() => bind(sensorstable, 'rows', sensorstable_rows_binding));

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			create_component(logo.$$.fragment);
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			create_component(backbutton.$$.fragment);
    			t4 = space();
    			h1 = element("h1");
    			t5 = text(t5_value);
    			t6 = space();
    			div3 = element("div");
    			button0 = element("button");
    			img0 = element("img");
    			t7 = space();
    			button1 = element("button");
    			img1 = element("img");
    			t8 = space();
    			button2 = element("button");
    			img2 = element("img");
    			t9 = space();
    			button3 = element("button");
    			img3 = element("img");
    			t10 = space();
    			button4 = element("button");
    			img4 = element("img");
    			t11 = space();
    			button5 = element("button");
    			img5 = element("img");
    			t12 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			create_component(sensorstable.$$.fragment);
    			attr_dev(div0, "class", "sidebar-sensor-list svelte-176y4vc");
    			add_location(div0, file$1, 114, 8, 3784);
    			attr_dev(div1, "class", "column sidebar svelte-176y4vc");
    			add_location(div1, file$1, 112, 4, 3731);
    			attr_dev(div2, "class", "header__back-button svelte-176y4vc");
    			add_location(div2, file$1, 129, 12, 4442);
    			attr_dev(h1, "class", "header__title svelte-176y4vc");
    			add_location(h1, file$1, 134, 12, 4557);
    			if (!src_url_equal(img0.src, img0_src_value = "/img/ico_download.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$1, 140, 20, 4849);
    			button0.disabled = button0_disabled_value = !/*saveData*/ ctx[1];
    			add_location(button0, file$1, 139, 16, 4768);

    			if (!src_url_equal(img1.src, img1_src_value = /*paused*/ ctx[4]
    			? "/img/ico_start.png"
    			: "/img/ico_pause.png")) attr_dev(img1, "src", img1_src_value);

    			add_location(img1, file$1, 143, 20, 5029);
    			attr_dev(button1, "class", "play-pause");
    			button1.disabled = /*stopped*/ ctx[5];
    			add_location(button1, file$1, 142, 16, 4927);

    			if (!src_url_equal(img2.src, img2_src_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures
    			? "/img/ico_measure.png"
    			: "/img/ico_graphics.png")) attr_dev(img2, "src", img2_src_value);

    			add_location(img2, file$1, 146, 20, 5223);
    			attr_dev(button2, "class", "measure-graphics");
    			add_location(button2, file$1, 145, 16, 5136);
    			if (!src_url_equal(img3.src, img3_src_value = "/img/ico_zoom.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "zoom");
    			add_location(img3, file$1, 149, 20, 5483);
    			button3.disabled = button3_disabled_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures;
    			add_location(button3, file$1, 148, 16, 5365);
    			if (!src_url_equal(img4.src, img4_src_value = "/img/ico_zoom_out.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "zoom_out");
    			add_location(img4, file$1, 152, 20, 5682);
    			button4.disabled = button4_disabled_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures;
    			add_location(button4, file$1, 151, 16, 5566);
    			if (!src_url_equal(img5.src, img5_src_value = "/img/ico_zoom_in.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "zoom_in");
    			add_location(img5, file$1, 155, 20, 5888);
    			button5.disabled = button5_disabled_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures;
    			add_location(button5, file$1, 154, 16, 5773);
    			attr_dev(div3, "class", "row control-buttons");
    			add_location(div3, file$1, 138, 12, 4718);
    			attr_dev(div4, "class", "header svelte-176y4vc");
    			add_location(div4, file$1, 128, 8, 4409);
    			attr_dev(div5, "class", "charts-wrapper svelte-176y4vc");
    			add_location(div5, file$1, 160, 8, 6004);
    			attr_dev(div6, "class", "column work-screen svelte-176y4vc");
    			add_location(div6, file$1, 126, 4, 4367);
    			attr_dev(main, "class", "full row");
    			add_location(main, file$1, 108, 0, 3540);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t1);
    			append_dev(main, div1);
    			mount_component(logo, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(main, t3);
    			append_dev(main, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div2);
    			mount_component(backbutton, div2, null);
    			append_dev(div4, t4);
    			append_dev(div4, h1);
    			append_dev(h1, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, button0);
    			append_dev(button0, img0);
    			append_dev(div3, t7);
    			append_dev(div3, button1);
    			append_dev(button1, img1);
    			append_dev(div3, t8);
    			append_dev(div3, button2);
    			append_dev(button2, img2);
    			append_dev(div3, t9);
    			append_dev(div3, button3);
    			append_dev(button3, img3);
    			append_dev(div3, t10);
    			append_dev(div3, button4);
    			append_dev(button4, img4);
    			append_dev(div3, t11);
    			append_dev(div3, button5);
    			append_dev(button5, img5);
    			append_dev(div6, t12);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			append_dev(div5, t13);
    			mount_component(sensorstable, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[27], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[28], false, false, false),
    					listen_dev(button2, "click", /*toggleMeasureGraphics*/ ctx[15], false, false, false),
    					listen_dev(
    						button3,
    						"click",
    						function () {
    							if (is_function(/*charts*/ ctx[6][/*selectedIdx*/ ctx[3]].resetZoom)) /*charts*/ ctx[6][/*selectedIdx*/ ctx[3]].resetZoom.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button4,
    						"click",
    						function () {
    							if (is_function(/*charts*/ ctx[6][/*selectedIdx*/ ctx[3]].zoomOut)) /*charts*/ ctx[6][/*selectedIdx*/ ctx[3]].zoomOut.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button5,
    						"click",
    						function () {
    							if (is_function(/*charts*/ ctx[6][/*selectedIdx*/ ctx[3]].zoomIn)) /*charts*/ ctx[6][/*selectedIdx*/ ctx[3]].zoomIn.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*showExitConfirm*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*showExitConfirm*/ 1024) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*values, selectedIdx, sensors, selectSensor, charts*/ 65865) {
    				each_value_1 = /*sensors*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if ((!current || dirty[0] & /*dataDisplay*/ 4) && t5_value !== (t5_value = (/*dataDisplay*/ ctx[2] === DataDisplay.Measures
    			? strings$1.measuresTitle
    			: strings$1.graphicsTitle) + "")) set_data_dev(t5, t5_value);

    			if (!current || dirty[0] & /*saveData*/ 2 && button0_disabled_value !== (button0_disabled_value = !/*saveData*/ ctx[1])) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (!current || dirty[0] & /*paused*/ 16 && !src_url_equal(img1.src, img1_src_value = /*paused*/ ctx[4]
    			? "/img/ico_start.png"
    			: "/img/ico_pause.png")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (!current || dirty[0] & /*stopped*/ 32) {
    				prop_dev(button1, "disabled", /*stopped*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*dataDisplay*/ 4 && !src_url_equal(img2.src, img2_src_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures
    			? "/img/ico_measure.png"
    			: "/img/ico_graphics.png")) {
    				attr_dev(img2, "src", img2_src_value);
    			}

    			if (!current || dirty[0] & /*dataDisplay*/ 4 && button3_disabled_value !== (button3_disabled_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}

    			if (!current || dirty[0] & /*dataDisplay*/ 4 && button4_disabled_value !== (button4_disabled_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures)) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}

    			if (!current || dirty[0] & /*dataDisplay*/ 4 && button5_disabled_value !== (button5_disabled_value = /*dataDisplay*/ ctx[2] === DataDisplay.Measures)) {
    				prop_dev(button5, "disabled", button5_disabled_value);
    			}

    			if (dirty[0] & /*selectedIdx, dataDisplay, sensors, numberOfVisiblePoints, charts*/ 4173) {
    				each_value = /*sensors*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div5, t13);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			const sensorstable_changes = {};
    			if (dirty[0] & /*tableHeader*/ 2048) sensorstable_changes.headers = /*tableHeader*/ ctx[11];

    			if (!updating_rows && dirty[0] & /*tableRows*/ 512) {
    				updating_rows = true;
    				sensorstable_changes.rows = /*tableRows*/ ctx[9];
    				add_flush_callback(() => updating_rows = false);
    			}

    			sensorstable.$set(sensorstable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(logo.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			transition_in(backbutton.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(sensorstable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(logo.$$.fragment, local);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			transition_out(backbutton.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(sensorstable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_component(logo);
    			destroy_each(each_blocks_1, detaching);
    			destroy_component(backbutton);
    			destroy_each(each_blocks, detaching);
    			/*sensorstable_binding*/ ctx[30](null);
    			destroy_component(sensorstable);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let numberOfVisiblePoints;
    	let tableHeader;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DashboardView', slots, []);
    	let { sensors = [] } = $$props;
    	let { intervalMs = 250 } = $$props;
    	let { experimentTimeSeconds = 60 } = $$props;
    	let { saveData = undefined } = $$props;
    	const dispatch = createEventDispatcher();
    	let dataDisplay = DataDisplay.Measures;
    	let selectedIdx = 0;
    	let paused = true;
    	let stopped = false;
    	let charts = [];
    	let table = undefined;
    	const values = [];
    	let tableRows = [];
    	let showExitConfirm = false;

    	onMount(() => {
    		let startTime = Date.now();

    		const timeout = setTimeout(
    			() => {
    				pause();
    				alert(strings$1.experimentIsDone);
    			},
    			experimentTimeSeconds * 1000
    		);

    		self.onbeforeunload = () => {
    			return strings$1.exitFromDashboardTitle;
    		};

    		setPause(true);

    		const interval = setInterval(
    			() => {
    				const time = Date.now() - startTime;

    				for (let i = 0; i < sensors.length; i++) {
    					const newValue = sensors[i].getLastValue();
    					$$invalidate(8, values[i] = newValue, values);
    					charts[i].addData({ time, value: newValue });
    				}

    				$$invalidate(9, tableRows = [[time, ...values], ...tableRows]);
    			},
    			intervalMs,
    			true
    		);

    		return () => {
    			clearInterval(interval);
    			clearTimeout(timeout);
    			self.onbeforeunload = null;
    		};
    	});

    	function setPause(isPaused) {
    		if (stopped && !isPaused) return;
    		$$invalidate(4, paused = isPaused);

    		if (paused) {
    			charts.forEach(c => c.pause());
    			table.pause();
    		} else {
    			charts.forEach(c => c.start());
    			table.start();
    		}
    	}

    	function toggleMeasureGraphics() {
    		$$invalidate(2, dataDisplay = dataDisplay === DataDisplay.Measures
    		? DataDisplay.Graphics
    		: DataDisplay.Measures);
    	}

    	function selectSensor(idx) {
    		$$invalidate(3, selectedIdx = idx);
    		$$invalidate(2, dataDisplay = DataDisplay.Graphics);
    	}

    	function sentToCloud() {
    		const rows = table.getRowsSnapshot();
    		const columns = rowsToColumns(rows).map(col => col.reverse());

    		const data = {
    			time: columns[0],
    			sensorsArchiveValues: sensors.map((s, i) => ({
    				unit: s.mode.unit,
    				sensorType: s.sensorType,
    				values: columns[i + 1]
    			}))
    		};

    		saveData(data);
    	}

    	function goBack() {
    		$$invalidate(10, showExitConfirm = true);
    	}

    	const pause = () => setPause(true);
    	const start = () => setPause(false);

    	function stop() {
    		setPause(true);
    		$$invalidate(5, stopped = true);
    	}

    	const writable_props = ['sensors', 'intervalMs', 'experimentTimeSeconds', 'saveData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DashboardView> was created with unknown prop '${key}'`);
    	});

    	const func = sureExit => sureExit && dispatch(CustomEvent.Back) || $$invalidate(10, showExitConfirm = false);
    	const click_handler = i => selectSensor(i);
    	const applyMinMax_handler = (i, { detail: { min, max } }) => charts[i].applyMinMax(min, max);
    	const click_handler_1 = () => sentToCloud();
    	const click_handler_2 = () => setPause(!paused);

    	function sensorchart_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			charts[i] = $$value;
    			$$invalidate(6, charts);
    		});
    	}

    	function sensorstable_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			table = $$value;
    			$$invalidate(7, table);
    		});
    	}

    	function sensorstable_rows_binding(value) {
    		tableRows = value;
    		$$invalidate(9, tableRows);
    	}

    	$$self.$$set = $$props => {
    		if ('sensors' in $$props) $$invalidate(0, sensors = $$props.sensors);
    		if ('intervalMs' in $$props) $$invalidate(19, intervalMs = $$props.intervalMs);
    		if ('experimentTimeSeconds' in $$props) $$invalidate(20, experimentTimeSeconds = $$props.experimentTimeSeconds);
    		if ('saveData' in $$props) $$invalidate(1, saveData = $$props.saveData);
    	};

    	$$self.$capture_state = () => ({
    		strings: strings$1,
    		SidebarSensor,
    		createEventDispatcher,
    		onMount,
    		SensorsTable: DataTable,
    		SensorChart,
    		BackButton,
    		DataDisplay,
    		Logo,
    		CustomEvent,
    		ModalDashboardConfirm,
    		rowsToColumns,
    		sensors,
    		intervalMs,
    		experimentTimeSeconds,
    		saveData,
    		dispatch,
    		dataDisplay,
    		selectedIdx,
    		paused,
    		stopped,
    		charts,
    		table,
    		values,
    		tableRows,
    		showExitConfirm,
    		setPause,
    		toggleMeasureGraphics,
    		selectSensor,
    		sentToCloud,
    		goBack,
    		pause,
    		start,
    		stop,
    		tableHeader,
    		numberOfVisiblePoints
    	});

    	$$self.$inject_state = $$props => {
    		if ('sensors' in $$props) $$invalidate(0, sensors = $$props.sensors);
    		if ('intervalMs' in $$props) $$invalidate(19, intervalMs = $$props.intervalMs);
    		if ('experimentTimeSeconds' in $$props) $$invalidate(20, experimentTimeSeconds = $$props.experimentTimeSeconds);
    		if ('saveData' in $$props) $$invalidate(1, saveData = $$props.saveData);
    		if ('dataDisplay' in $$props) $$invalidate(2, dataDisplay = $$props.dataDisplay);
    		if ('selectedIdx' in $$props) $$invalidate(3, selectedIdx = $$props.selectedIdx);
    		if ('paused' in $$props) $$invalidate(4, paused = $$props.paused);
    		if ('stopped' in $$props) $$invalidate(5, stopped = $$props.stopped);
    		if ('charts' in $$props) $$invalidate(6, charts = $$props.charts);
    		if ('table' in $$props) $$invalidate(7, table = $$props.table);
    		if ('tableRows' in $$props) $$invalidate(9, tableRows = $$props.tableRows);
    		if ('showExitConfirm' in $$props) $$invalidate(10, showExitConfirm = $$props.showExitConfirm);
    		if ('tableHeader' in $$props) $$invalidate(11, tableHeader = $$props.tableHeader);
    		if ('numberOfVisiblePoints' in $$props) $$invalidate(12, numberOfVisiblePoints = $$props.numberOfVisiblePoints);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*intervalMs, experimentTimeSeconds*/ 1572864) {
    			// Internal
    			$$invalidate(12, numberOfVisiblePoints = 1000 / intervalMs * experimentTimeSeconds);
    		}

    		if ($$self.$$.dirty[0] & /*sensors*/ 1) {
    			$$invalidate(11, tableHeader = [
    				`${strings$1.time} [${strings$1.timeFormat}]`,
    				...sensors.map(s => `${s.name} [${s.mode.unit}]`)
    			]);
    		}
    	};

    	return [
    		sensors,
    		saveData,
    		dataDisplay,
    		selectedIdx,
    		paused,
    		stopped,
    		charts,
    		table,
    		values,
    		tableRows,
    		showExitConfirm,
    		tableHeader,
    		numberOfVisiblePoints,
    		dispatch,
    		setPause,
    		toggleMeasureGraphics,
    		selectSensor,
    		sentToCloud,
    		goBack,
    		intervalMs,
    		experimentTimeSeconds,
    		pause,
    		start,
    		stop,
    		func,
    		click_handler,
    		applyMinMax_handler,
    		click_handler_1,
    		click_handler_2,
    		sensorchart_binding,
    		sensorstable_binding,
    		sensorstable_rows_binding
    	];
    }

    class DashboardView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				sensors: 0,
    				intervalMs: 19,
    				experimentTimeSeconds: 20,
    				saveData: 1,
    				pause: 21,
    				start: 22,
    				stop: 23
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashboardView",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get sensors() {
    		throw new Error("<DashboardView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sensors(value) {
    		throw new Error("<DashboardView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get intervalMs() {
    		throw new Error("<DashboardView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set intervalMs(value) {
    		throw new Error("<DashboardView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get experimentTimeSeconds() {
    		throw new Error("<DashboardView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set experimentTimeSeconds(value) {
    		throw new Error("<DashboardView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get saveData() {
    		throw new Error("<DashboardView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set saveData(value) {
    		throw new Error("<DashboardView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pause() {
    		return this.$$.ctx[21];
    	}

    	set pause(value) {
    		throw new Error("<DashboardView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		return this.$$.ctx[22];
    	}

    	set start(value) {
    		throw new Error("<DashboardView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stop() {
    		return this.$$.ctx[23];
    	}

    	set stop(value) {
    		throw new Error("<DashboardView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\screens\DashboardScreen.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;

    // (51:0) {#if (showSavedWindow)}
    function create_if_block(ctx) {
    	let modalopensavedarchive;
    	let current;

    	modalopensavedarchive = new ModalOpenSavedArchive({
    			props: {
    				link: /*viewLink*/ ctx[2],
    				onClose: /*func*/ ctx[9]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalopensavedarchive.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalopensavedarchive, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalopensavedarchive_changes = {};
    			if (dirty & /*viewLink*/ 4) modalopensavedarchive_changes.link = /*viewLink*/ ctx[2];
    			if (dirty & /*showSavedWindow*/ 2) modalopensavedarchive_changes.onClose = /*func*/ ctx[9];
    			modalopensavedarchive.$set(modalopensavedarchive_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalopensavedarchive.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalopensavedarchive.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalopensavedarchive, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(51:0) {#if (showSavedWindow)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t;
    	let dashboardview;
    	let current;
    	let if_block = /*showSavedWindow*/ ctx[1] && create_if_block(ctx);

    	let dashboardview_props = {
    		sensors: /*sensors*/ ctx[3],
    		experimentTimeSeconds: Settings.experimentTime,
    		saveData: /*saveData*/ ctx[5],
    		intervalMs: 250
    	};

    	dashboardview = new DashboardView({
    			props: dashboardview_props,
    			$$inline: true
    		});

    	/*dashboardview_binding*/ ctx[10](dashboardview);
    	dashboardview.$on("back", /*back_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(dashboardview.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dashboardview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showSavedWindow*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showSavedWindow*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const dashboardview_changes = {};
    			if (dirty & /*sensors*/ 8) dashboardview_changes.sensors = /*sensors*/ ctx[3];
    			dashboardview.$set(dashboardview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(dashboardview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(dashboardview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			/*dashboardview_binding*/ ctx[10](null);
    			destroy_component(dashboardview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let sensors;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DashboardScreen', slots, []);
    	var _a;
    	let { lab } = $$props;
    	let { labRepository } = $$props;

    	// Internal
    	let dashboard;

    	const navigate = useNavigate();
    	let showSavedWindow = false;
    	let viewLink = undefined;

    	useEffect(
    		() => {
    			if (!lab || !dashboard) return;
    			lab.start();
    			dashboard.start();

    			lab.onError.addEventListener(message => {
    				dashboard.stop();
    			});

    			return () => {
    				lab.stop();
    				dashboard.stop();
    				console.debug('dashboard stopped');
    			};
    		},
    		() => [lab, dashboard]
    	);

    	function goBack() {
    		navigate(-1);
    	}

    	function saveData(data) {
    		console.log(data);

    		labRepository.saveArchiveValues(data).then(id => {
    			if (!id) {
    				alert(strings$1.loadFailed);
    				return;
    			}

    			$$invalidate(2, viewLink = `${window.location.origin}${RoutePath.SavedData}/${id}`);
    			$$invalidate(1, showSavedWindow = true);
    		});
    	}

    	const writable_props = ['lab', 'labRepository'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<DashboardScreen> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, showSavedWindow = false);

    	function dashboardview_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dashboard = $$value;
    			$$invalidate(0, dashboard);
    		});
    	}

    	const back_handler = () => goBack();

    	$$self.$$set = $$props => {
    		if ('lab' in $$props) $$invalidate(6, lab = $$props.lab);
    		if ('labRepository' in $$props) $$invalidate(7, labRepository = $$props.labRepository);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		strings: strings$1,
    		DashboardView,
    		useNavigate,
    		Settings,
    		useEffect,
    		RoutePath,
    		ModalOpenSavedArchive,
    		lab,
    		labRepository,
    		dashboard,
    		navigate,
    		showSavedWindow,
    		viewLink,
    		goBack,
    		saveData,
    		sensors
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) $$invalidate(8, _a = $$props._a);
    		if ('lab' in $$props) $$invalidate(6, lab = $$props.lab);
    		if ('labRepository' in $$props) $$invalidate(7, labRepository = $$props.labRepository);
    		if ('dashboard' in $$props) $$invalidate(0, dashboard = $$props.dashboard);
    		if ('showSavedWindow' in $$props) $$invalidate(1, showSavedWindow = $$props.showSavedWindow);
    		if ('viewLink' in $$props) $$invalidate(2, viewLink = $$props.viewLink);
    		if ('sensors' in $$props) $$invalidate(3, sensors = $$props.sensors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lab, _a*/ 320) {
    			$$invalidate(3, sensors = $$invalidate(8, _a = lab === null || lab === void 0
    			? void 0
    			: lab.getSensors()) !== null && _a !== void 0
    			? _a
    			: []);
    		}
    	};

    	return [
    		dashboard,
    		showSavedWindow,
    		viewLink,
    		sensors,
    		goBack,
    		saveData,
    		lab,
    		labRepository,
    		_a,
    		func,
    		dashboardview_binding,
    		back_handler
    	];
    }

    class DashboardScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { lab: 6, labRepository: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DashboardScreen",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lab*/ ctx[6] === undefined && !('lab' in props)) {
    			console_1$1.warn("<DashboardScreen> was created without expected prop 'lab'");
    		}

    		if (/*labRepository*/ ctx[7] === undefined && !('labRepository' in props)) {
    			console_1$1.warn("<DashboardScreen> was created without expected prop 'labRepository'");
    		}
    	}

    	get lab() {
    		throw new Error("<DashboardScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lab(value) {
    		throw new Error("<DashboardScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labRepository() {
    		throw new Error("<DashboardScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labRepository(value) {
    		throw new Error("<DashboardScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\screens\MainScreen.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;

    // (37:4) <Route>
    function create_default_slot_2$1(ctx) {
    	let mainview;
    	let current;

    	mainview = new MainView({
    			props: {
    				sensors: /*sensors*/ ctx[2],
    				canGoToDashboard: /*canGoToDashboard*/ ctx[3]
    			},
    			$$inline: true
    		});

    	mainview.$on("start", /*start_handler*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(mainview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mainview_changes = {};
    			if (dirty & /*sensors*/ 4) mainview_changes.sensors = /*sensors*/ ctx[2];
    			if (dirty & /*canGoToDashboard*/ 8) mainview_changes.canGoToDashboard = /*canGoToDashboard*/ ctx[3];
    			mainview.$set(mainview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(37:4) <Route>",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Route path={RoutePath.Dashboard}>
    function create_default_slot_1$1(ctx) {
    	let dashboardscreen;
    	let current;

    	dashboardscreen = new DashboardScreen({
    			props: {
    				lab: /*lab*/ ctx[1],
    				labRepository: /*labRepository*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dashboardscreen.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboardscreen, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dashboardscreen_changes = {};
    			if (dirty & /*lab*/ 2) dashboardscreen_changes.lab = /*lab*/ ctx[1];
    			if (dirty & /*labRepository*/ 1) dashboardscreen_changes.labRepository = /*labRepository*/ ctx[0];
    			dashboardscreen.$set(dashboardscreen_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboardscreen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboardscreen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboardscreen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(40:4) <Route path={RoutePath.Dashboard}>",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Router>
    function create_default_slot$1(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route$1({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: RoutePath.Dashboard,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope, sensors, canGoToDashboard*/ 140) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, lab, labRepository*/ 131) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(36:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, lab, labRepository, sensors, canGoToDashboard*/ 143) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let sensors;
    	let canGoToDashboard;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainScreen', slots, []);
    	var _a;
    	let { labRepository } = $$props;
    	let lab;

    	onMount(async () => {
    		try {
    			$$invalidate(1, lab = await LabFactory.create(labRepository));

    			lab.onError.addEventListener(message => {
    				alert(message);
    			});
    		} catch(e) {
    			console.debug(e);
    			alert(strings$1.fatalError);
    		}

    		return () => {
    			lab.stop();
    		};
    	});

    	const navigate = useNavigate();

    	lab === null || lab === void 0
    	? void 0
    	: lab.onError.addEventListener(() => {
    			$$invalidate(3, canGoToDashboard = false);
    		});

    	const writable_props = ['labRepository'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MainScreen> was created with unknown prop '${key}'`);
    	});

    	const start_handler = () => navigate(RoutePath.Dashboard);

    	$$self.$$set = $$props => {
    		if ('labRepository' in $$props) $$invalidate(0, labRepository = $$props.labRepository);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		Route: Route$1,
    		Router: Router$1,
    		useNavigate,
    		MainView,
    		RoutePath,
    		LabFactory,
    		onMount,
    		strings: strings$1,
    		DashboardScreen,
    		labRepository,
    		lab,
    		navigate,
    		canGoToDashboard,
    		sensors
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) $$invalidate(5, _a = $$props._a);
    		if ('labRepository' in $$props) $$invalidate(0, labRepository = $$props.labRepository);
    		if ('lab' in $$props) $$invalidate(1, lab = $$props.lab);
    		if ('canGoToDashboard' in $$props) $$invalidate(3, canGoToDashboard = $$props.canGoToDashboard);
    		if ('sensors' in $$props) $$invalidate(2, sensors = $$props.sensors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lab, _a*/ 34) {
    			// Internal
    			$$invalidate(2, sensors = $$invalidate(5, _a = lab === null || lab === void 0
    			? void 0
    			: lab.getSensors()) !== null && _a !== void 0
    			? _a
    			: []);
    		}

    		if ($$self.$$.dirty & /*sensors*/ 4) {
    			$$invalidate(3, canGoToDashboard = sensors.length > 0);
    		}
    	};

    	return [labRepository, lab, sensors, canGoToDashboard, navigate, _a, start_handler];
    }

    class MainScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { labRepository: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainScreen",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*labRepository*/ ctx[0] === undefined && !('labRepository' in props)) {
    			console_1.warn("<MainScreen> was created without expected prop 'labRepository'");
    		}
    	}

    	get labRepository() {
    		throw new Error("<MainScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labRepository(value) {
    		throw new Error("<MainScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (13:8) <Route path={RoutePath.Main + '/*'}>
    function create_default_slot_2(ctx) {
    	let mainscreen;
    	let current;

    	mainscreen = new MainScreen({
    			props: { labRepository: /*labRepository*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainscreen.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainscreen, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainscreen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainscreen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainscreen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(13:8) <Route path={RoutePath.Main + '/*'}>",
    		ctx
    	});

    	return block;
    }

    // (16:8) <Route path={RoutePath.SavedData + '/:id'} let:params>
    function create_default_slot_1(ctx) {
    	let saveddatascreen;
    	let current;

    	saveddatascreen = new SavedDataScreen({
    			props: {
    				repository: /*labRepository*/ ctx[0],
    				id: /*params*/ ctx[3].id
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(saveddatascreen.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(saveddatascreen, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const saveddatascreen_changes = {};
    			if (dirty & /*params*/ 8) saveddatascreen_changes.id = /*params*/ ctx[3].id;
    			saveddatascreen.$set(saveddatascreen_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(saveddatascreen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(saveddatascreen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(saveddatascreen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(16:8) <Route path={RoutePath.SavedData + '/:id'} let:params>",
    		ctx
    	});

    	return block;
    }

    // (12:4) <Router>
    function create_default_slot(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: RoutePath.Main + '/*',
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: RoutePath.SavedData + '/:id',
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ params }) => ({ 3: params }),
    						({ params }) => params ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, params*/ 24) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(12:4) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(div, "class", "content-wrapper svelte-1uaw983");
    			add_location(div, file, 10, 0, 473);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(router, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const url = new URL(location.href);
    	const serial = url.searchParams.get('serial-number');
    	const labRepository = new WebSocketLabRepository(serial);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		WebSocketLabRepository,
    		SavedDataScreen,
    		Route: Route$1,
    		Router: Router$1,
    		RoutePath,
    		MainScreen,
    		url,
    		serial,
    		labRepository
    	});

    	return [labRepository];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
