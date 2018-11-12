function generatePatches(state, basepath, patches, inversePatches, baseValue, resultValue) {
    if (patches) if (Array.isArray(baseValue)) generateArrayPatches(state, basepath, patches, inversePatches, baseValue, resultValue);else generateObjectPatches(state, basepath, patches, inversePatches, baseValue, resultValue);
}

function generateArrayPatches(state, basepath, patches, inversePatches, baseValue, resultValue) {
    var shared = Math.min(baseValue.length, resultValue.length);
    for (var i = 0; i < shared; i++) {
        if (state.assigned[i] && baseValue[i] !== resultValue[i]) {
            var path = basepath.concat(i);
            patches.push({ op: "replace", path: path, value: resultValue[i] });
            inversePatches.push({ op: "replace", path: path, value: baseValue[i] });
        }
    }
    if (shared < resultValue.length) {
        // stuff was added
        for (var _i = shared; _i < resultValue.length; _i++) {
            var _path = basepath.concat(_i);
            patches.push({ op: "add", path: _path, value: resultValue[_i] });
        }
        inversePatches.push({
            op: "replace",
            path: basepath.concat("length"),
            value: baseValue.length
        });
    } else if (shared < baseValue.length) {
        // stuff was removed
        patches.push({
            op: "replace",
            path: basepath.concat("length"),
            value: resultValue.length
        });
        for (var _i2 = shared; _i2 < baseValue.length; _i2++) {
            var _path2 = basepath.concat(_i2);
            inversePatches.push({ op: "add", path: _path2, value: baseValue[_i2] });
        }
    }
}

function generateObjectPatches(state, basepath, patches, inversePatches, baseValue, resultValue) {
    each(state.assigned, function (key, assignedValue) {
        var origValue = baseValue[key];
        var value = resultValue[key];
        var op = !assignedValue ? "remove" : key in baseValue ? "replace" : "add";
        if (origValue === baseValue && op === "replace") return;
        var path = basepath.concat(key);
        patches.push(op === "remove" ? { op: op, path: path } : { op: op, path: path, value: value });
        inversePatches.push(op === "add" ? { op: "remove", path: path } : op === "remove" ? { op: "add", path: path, value: origValue } : { op: "replace", path: path, value: origValue });
    });
}

function applyPatches(draft, patches) {
    var _loop = function _loop(i) {
        var patch = patches[i];
        if (patch.path.length === 0 && patch.op === "replace") {
            draft = patch.value;
        } else {
            var path = patch.path.slice();
            var key = path.pop();
            var base = path.reduce(function (current, part) {
                if (!current) throw new Error("Cannot apply patch, path doesn't resolve: " + patch.path.join("/"));
                return current[part];
            }, draft);
            if (!base) throw new Error("Cannot apply patch, path doesn't resolve: " + patch.path.join("/"));
            switch (patch.op) {
                case "replace":
                case "add":
                    // TODO: add support is not extensive, it does not support insertion or `-` atm!
                    base[key] = patch.value;
                    break;
                case "remove":
                    if (Array.isArray(base)) {
                        if (key === base.length - 1) base.length -= 1;else throw new Error("Remove can only remove the last key of an array, index: " + key + ", length: " + base.length);
                    } else delete base[key];
                    break;
                default:
                    throw new Error("Unsupported patch operation: " + patch.op);
            }
        }
    };

    for (var i = 0; i < patches.length; i++) {
        _loop(i);
    }
    return draft;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : defineProperty({}, "immer-nothing", true);

var PROXY_STATE = typeof Symbol !== "undefined" ? Symbol("immer-proxy-state") : "__$immer_state";

var RETURNED_AND_MODIFIED_ERROR = "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.";

function verifyMinified() {}

var inProduction = typeof process !== "undefined" && process.env.NODE_ENV === "production" || verifyMinified.name !== "verifyMinified";

var autoFreeze = !inProduction;
var useProxies = typeof Proxy !== "undefined";

/**
 * Automatically freezes any state trees generated by immer.
 * This protects against accidental modifications of the state tree outside of an immer function.
 * This comes with a performance impact, so it is recommended to disable this option in production.
 * It is by default enabled.
 *
 * @returns {void}
 */
function setAutoFreeze(enableAutoFreeze) {
    autoFreeze = enableAutoFreeze;
}

function setUseProxies(value) {
    useProxies = value;
}

function getUseProxies() {
    return useProxies;
}

function isProxy(value) {
    return !!value && !!value[PROXY_STATE];
}

function isProxyable(value) {
    if (!value) return false;
    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") return false;
    if (Array.isArray(value)) return true;
    var proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
}

function freeze(value) {
    if (autoFreeze) {
        Object.freeze(value);
    }
    return value;
}

function original(value) {
    if (value && value[PROXY_STATE]) {
        return value[PROXY_STATE].base;
    }
    // otherwise return undefined
}

var assign = Object.assign || function assign(target, value) {
    for (var key in value) {
        if (has(value, key)) {
            target[key] = value[key];
        }
    }
    return target;
};

function shallowCopy(value) {
    if (Array.isArray(value)) return value.slice();
    var target = value.__proto__ === undefined ? Object.create(null) : {};
    return assign(target, value);
}

function each(value, cb) {
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            cb(i, value[i]);
        }
    } else {
        for (var key in value) {
            cb(key, value[key]);
        }
    }
}

function has(thing, prop) {
    return Object.prototype.hasOwnProperty.call(thing, prop);
}

// given a base object, returns it if unmodified, or return the changed cloned if modified
function finalize(base, path, patches, inversePatches) {
    if (isProxy(base)) {
        var state = base[PROXY_STATE];
        if (state.modified === true) {
            if (state.finalized === true) return state.copy;
            state.finalized = true;
            var result = finalizeObject(useProxies ? state.copy : state.copy = shallowCopy(base), state, path, patches, inversePatches);
            generatePatches(state, path, patches, inversePatches, state.base, result);
            return result;
        } else {
            return state.base;
        }
    }
    finalizeNonProxiedObject(base);
    return base;
}

function finalizeObject(copy, state, path, patches, inversePatches) {
    var base = state.base;
    each(copy, function (prop, value) {
        if (value !== base[prop]) {
            // if there was an assignment on this property, we don't need to generate
            // patches for the subtree
            var _generatePatches = patches && !has(state.assigned, prop);
            copy[prop] = finalize(value, _generatePatches && path.concat(prop), _generatePatches && patches, inversePatches);
        }
    });
    return freeze(copy);
}

function finalizeNonProxiedObject(parent) {
    // If finalize is called on an object that was not a proxy, it means that it is an object that was not there in the original
    // tree and it could contain proxies at arbitrarily places. Let's find and finalize them as well
    if (!isProxyable(parent)) return;
    if (Object.isFrozen(parent)) return;
    each(parent, function (i, child) {
        if (isProxy(child)) {
            parent[i] = finalize(child);
        } else finalizeNonProxiedObject(child);
    });
    // always freeze completely new data
    freeze(parent);
}



function is(x, y) {
    // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

// @ts-check

var proxies = null;

var objectTraps = {
    get: get$1,
    has: function has$$1(target, prop) {
        return prop in source(target);
    },
    ownKeys: function ownKeys(target) {
        return Reflect.ownKeys(source(target));
    },

    set: set$1,
    deleteProperty: deleteProperty,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor,
    defineProperty: defineProperty$1,
    setPrototypeOf: function setPrototypeOf() {
        throw new Error("Immer does not support `setPrototypeOf()`.");
    }
};

var arrayTraps = {};
each(objectTraps, function (key, fn) {
    arrayTraps[key] = function () {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
    };
});
arrayTraps.deleteProperty = function (state, prop) {
    if (isNaN(parseInt(prop))) throw new Error("Immer does not support deleting properties from arrays: " + prop);
    return objectTraps.deleteProperty.call(this, state[0], prop);
};
arrayTraps.set = function (state, prop, value) {
    if (prop !== "length" && isNaN(parseInt(prop))) throw new Error("Immer does not support setting non-numeric properties on arrays: " + prop);
    return objectTraps.set.call(this, state[0], prop, value);
};

function createState(parent, base) {
    return {
        modified: false, // this tree is modified (either this object or one of it's children)
        assigned: {}, // true: value was assigned to these props, false: was removed
        finalized: false,
        parent: parent,
        base: base,
        copy: undefined,
        proxies: {}
    };
}

function source(state) {
    return state.modified === true ? state.copy : state.base;
}

function get$1(state, prop) {
    if (prop === PROXY_STATE) return state;
    if (state.modified) {
        var value = state.copy[prop];
        if (value === state.base[prop] && isProxyable(value))
            // only create proxy if it is not yet a proxy, and not a new object
            // (new objects don't need proxying, they will be processed in finalize anyway)
            return state.copy[prop] = createProxy(state, value);
        return value;
    } else {
        if (has(state.proxies, prop)) return state.proxies[prop];
        var _value = state.base[prop];
        if (!isProxy(_value) && isProxyable(_value)) return state.proxies[prop] = createProxy(state, _value);
        return _value;
    }
}

function set$1(state, prop, value) {
    // TODO: optimize
    state.assigned[prop] = true;
    if (!state.modified) {
        if (prop in state.base && is(state.base[prop], value) || has(state.proxies, prop) && state.proxies[prop] === value) return true;
        markChanged(state);
    }
    state.copy[prop] = value;
    return true;
}

function deleteProperty(state, prop) {
    state.assigned[prop] = false;
    markChanged(state);
    delete state.copy[prop];
    return true;
}

function getOwnPropertyDescriptor(state, prop) {
    var owner = state.modified ? state.copy : has(state.proxies, prop) ? state.proxies : state.base;
    var descriptor = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (descriptor && !(Array.isArray(owner) && prop === "length")) descriptor.configurable = true;
    return descriptor;
}

function defineProperty$1() {
    throw new Error("Immer does not support defining properties on draft objects.");
}

function markChanged(state) {
    if (!state.modified) {
        state.modified = true;
        state.copy = shallowCopy(state.base);
        // copy the proxies over the base-copy
        Object.assign(state.copy, state.proxies); // yup that works for arrays as well
        if (state.parent) markChanged(state.parent);
    }
}

// creates a proxy for plain objects / arrays
function createProxy(parentState, base, key) {
    if (isProxy(base)) throw new Error("Immer bug. Plz report.");
    var state = createState(parentState, base, key);
    var proxy = Array.isArray(base) ? Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps);
    proxies.push(proxy);
    return proxy.proxy;
}

function produceProxy(baseState, producer, patchListener) {
    if (isProxy(baseState)) {
        // See #100, don't nest producers
        var returnValue = producer.call(baseState, baseState);
        return returnValue === undefined ? baseState : returnValue;
    }
    var previousProxies = proxies;
    proxies = [];
    var patches = patchListener && [];
    var inversePatches = patchListener && [];
    try {
        // create proxy for root
        var rootProxy = createProxy(undefined, baseState);
        // execute the thunk
        var _returnValue = producer.call(rootProxy, rootProxy);
        // and finalize the modified proxy
        var result = void 0;
        // check whether the draft was modified and/or a value was returned
        if (_returnValue !== undefined && _returnValue !== rootProxy) {
            // something was returned, and it wasn't the proxy itself
            if (rootProxy[PROXY_STATE].modified) throw new Error(RETURNED_AND_MODIFIED_ERROR);

            // See #117
            // Should we just throw when returning a proxy which is not the root, but a subset of the original state?
            // Looks like a wrongly modeled reducer
            result = finalize(_returnValue);
            if (patches) {
                patches.push({ op: "replace", path: [], value: result });
                inversePatches.push({ op: "replace", path: [], value: baseState });
            }
        } else {
            result = finalize(rootProxy, [], patches, inversePatches);
        }
        // revoke all proxies
        each(proxies, function (_, p) {
            return p.revoke();
        });
        patchListener && patchListener(patches, inversePatches);
        return result;
    } finally {
        proxies = previousProxies;
    }
}

// @ts-check

var descriptors = {};
var states = null;

function createState$1(parent, proxy, base) {
    return {
        modified: false,
        assigned: {}, // true: value was assigned to these props, false: was removed
        hasCopy: false,
        parent: parent,
        base: base,
        proxy: proxy,
        copy: undefined,
        finished: false,
        finalizing: false,
        finalized: false
    };
}

function source$1(state) {
    return state.hasCopy ? state.copy : state.base;
}

function _get(state, prop) {
    assertUnfinished(state);
    var value = source$1(state)[prop];
    if (!state.finalizing && value === state.base[prop] && isProxyable(value)) {
        // only create a proxy if the value is proxyable, and the value was in the base state
        // if it wasn't in the base state, the object is already modified and we will process it in finalize
        prepareCopy(state);
        return state.copy[prop] = createProxy$1(state, value);
    }
    return value;
}

function _set(state, prop, value) {
    assertUnfinished(state);
    state.assigned[prop] = true; // optimization; skip this if there is no listener
    if (!state.modified) {
        if (is(source$1(state)[prop], value)) return;
        markChanged$1(state);
        prepareCopy(state);
    }
    state.copy[prop] = value;
}

function markChanged$1(state) {
    if (!state.modified) {
        state.modified = true;
        if (state.parent) markChanged$1(state.parent);
    }
}

function prepareCopy(state) {
    if (state.hasCopy) return;
    state.hasCopy = true;
    state.copy = shallowCopy(state.base);
}

// creates a proxy for plain objects / arrays
function createProxy$1(parent, base) {
    var proxy = shallowCopy(base);
    each(base, function (i) {
        Object.defineProperty(proxy, "" + i, createPropertyProxy("" + i));
    });
    var state = createState$1(parent, proxy, base);
    createHiddenProperty(proxy, PROXY_STATE, state);
    states.push(state);
    return proxy;
}

function createPropertyProxy(prop) {
    return descriptors[prop] || (descriptors[prop] = {
        configurable: true,
        enumerable: true,
        get: function get$$1() {
            return _get(this[PROXY_STATE], prop);
        },
        set: function set$$1(value) {
            _set(this[PROXY_STATE], prop, value);
        }
    });
}

function assertUnfinished(state) {
    if (state.finished === true) throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(state.copy || state.base));
}

// this sounds very expensive, but actually it is not that expensive in practice
// as it will only visit proxies, and only do key-based change detection for objects for
// which it is not already know that they are changed (that is, only object for which no known key was changed)
function markChangesSweep() {
    // intentionally we process the proxies in reverse order;
    // ideally we start by processing leafs in the tree, because if a child has changed, we don't have to check the parent anymore
    // reverse order of proxy creation approximates this
    for (var i = states.length - 1; i >= 0; i--) {
        var state = states[i];
        if (state.modified === false) {
            if (Array.isArray(state.base)) {
                if (hasArrayChanges(state)) markChanged$1(state);
            } else if (hasObjectChanges(state)) markChanged$1(state);
        }
    }
}

function markChangesRecursively(object) {
    if (!object || (typeof object === "undefined" ? "undefined" : _typeof(object)) !== "object") return;
    var state = object[PROXY_STATE];
    if (!state) return;
    var proxy = state.proxy,
        base = state.base;

    if (Array.isArray(object)) {
        if (hasArrayChanges(state)) {
            markChanged$1(state);
            state.assigned.length = true;
            if (proxy.length < base.length) for (var i = proxy.length; i < base.length; i++) {
                state.assigned[i] = false;
            } else for (var _i = base.length; _i < proxy.length; _i++) {
                state.assigned[_i] = true;
            }each(proxy, function (index, child) {
                if (!state.assigned[index]) markChangesRecursively(child);
            });
        }
    } else {
        var _diffKeys = diffKeys(base, proxy),
            added = _diffKeys.added,
            removed = _diffKeys.removed;

        if (added.length > 0 || removed.length > 0) markChanged$1(state);
        each(added, function (_, key) {
            state.assigned[key] = true;
        });
        each(removed, function (_, key) {
            state.assigned[key] = false;
        });
        each(proxy, function (key, child) {
            if (!state.assigned[key]) markChangesRecursively(child);
        });
    }
}

function diffKeys(from, to) {
    // TODO: optimize
    var a = Object.keys(from);
    var b = Object.keys(to);
    return {
        added: b.filter(function (key) {
            return a.indexOf(key) === -1;
        }),
        removed: a.filter(function (key) {
            return b.indexOf(key) === -1;
        })
    };
}

function hasObjectChanges(state) {
    var baseKeys = Object.keys(state.base);
    var keys = Object.keys(state.proxy);
    return !shallowEqual(baseKeys, keys);
}

function hasArrayChanges(state) {
    var proxy = state.proxy;

    if (proxy.length !== state.base.length) return true;
    // See #116
    // If we first shorten the length, our array interceptors will be removed.
    // If after that new items are added, result in the same original length,
    // those last items will have no intercepting property.
    // So if there is no own descriptor on the last position, we know that items were removed and added
    // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
    // the last one
    var descriptor = Object.getOwnPropertyDescriptor(proxy, proxy.length - 1);
    // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)
    if (descriptor && !descriptor.get) return true;
    // For all other cases, we don't have to compare, as they would have been picked up by the index setters
    return false;
}

function produceEs5(baseState, producer, patchListener) {
    if (isProxy(baseState)) {
        // See #100, don't nest producers
        var returnValue = producer.call(baseState, baseState);
        return returnValue === undefined ? baseState : returnValue;
    }
    var prevStates = states;
    states = [];
    var patches = patchListener && [];
    var inversePatches = patchListener && [];
    try {
        // create proxy for root
        var rootProxy = createProxy$1(undefined, baseState);
        // execute the thunk
        var _returnValue = producer.call(rootProxy, rootProxy);
        // and finalize the modified proxy
        each(states, function (_, state) {
            state.finalizing = true;
        });
        var result = void 0;
        // check whether the draft was modified and/or a value was returned
        if (_returnValue !== undefined && _returnValue !== rootProxy) {
            // something was returned, and it wasn't the proxy itself
            if (rootProxy[PROXY_STATE].modified) throw new Error(RETURNED_AND_MODIFIED_ERROR);
            result = finalize(_returnValue);
            if (patches) {
                patches.push({ op: "replace", path: [], value: result });
                inversePatches.push({ op: "replace", path: [], value: baseState });
            }
        } else {
            if (patchListener) markChangesRecursively(rootProxy);
            markChangesSweep(); // this one is more efficient if we don't need to know which attributes have changed
            result = finalize(rootProxy, [], patches, inversePatches);
        }
        // make sure all proxies become unusable
        each(states, function (_, state) {
            state.finished = true;
        });
        patchListener && patchListener(patches, inversePatches);
        return result;
    } finally {
        states = prevStates;
    }
}

function shallowEqual(objA, objB) {
    //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (is(objA, objB)) return true;
    if ((typeof objA === "undefined" ? "undefined" : _typeof(objA)) !== "object" || objA === null || (typeof objB === "undefined" ? "undefined" : _typeof(objB)) !== "object" || objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}

function createHiddenProperty(target, prop, value) {
    Object.defineProperty(target, prop, {
        value: value,
        enumerable: false,
        writable: true
    });
}

/**
 * produce takes a state, and runs a function against it.
 * That function can freely mutate the state, as it will create copies-on-write.
 * This means that the original state will stay unchanged, and once the function finishes, the modified state is returned
 *
 * @export
 * @param {any} baseState - the state to start with
 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
 * @param {Function} patchListener - optional function that will be called with all the patches produced here
 * @returns {any} a new state, or the base state if nothing was modified
 */
function produce(baseState, producer, patchListener) {
    // prettier-ignore
    if (arguments.length < 1 || arguments.length > 3) throw new Error("produce expects 1 to 3 arguments, got " + arguments.length);

    // curried invocation
    if (typeof baseState === "function") {
        // prettier-ignore
        if (typeof producer === "function") throw new Error("if first argument is a function (curried invocation), the second argument to produce cannot be a function");

        var initialState = producer;
        var recipe = baseState;

        return function () {
            var args = arguments;

            var currentState = args[0] === undefined && initialState !== undefined ? initialState : args[0];

            return produce(currentState, function (draft) {
                args[0] = draft; // blegh!
                return recipe.apply(draft, args);
            });
        };
    }

    // prettier-ignore
    {
        if (typeof producer !== "function") throw new Error("if first argument is not a function, the second argument to produce should be a function");
        if (patchListener !== undefined && typeof patchListener !== "function") throw new Error("the third argument of a producer should not be set or a function");
    }

    // if state is a primitive, don't bother proxying at all
    if ((typeof baseState === "undefined" ? "undefined" : _typeof(baseState)) !== "object" || baseState === null) {
        var returnValue = producer(baseState);
        return returnValue === undefined ? baseState : normalizeResult(returnValue);
    }

    if (!isProxyable(baseState)) throw new Error("the first argument to an immer producer should be a primitive, plain object or array, got " + (typeof baseState === "undefined" ? "undefined" : _typeof(baseState)) + ": \"" + baseState + "\"");
    return normalizeResult(getUseProxies() ? produceProxy(baseState, producer, patchListener) : produceEs5(baseState, producer, patchListener));
}

function normalizeResult(result) {
    return result === NOTHING ? undefined : result;
}

var applyPatches$1 = produce(applyPatches);

var nothing = NOTHING;

export { produce, applyPatches$1 as applyPatches, nothing, setAutoFreeze, setUseProxies, original };
export default produce;
//# sourceMappingURL=immer.module.js.map
