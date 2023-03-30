/**
 * @author renhongl
 * @email liangrenhong2017@gmail.com
 * @desc This lib is for render a pretty json data on browser
 */


const toString = Object.prototype.toString;

function isString(val) {
    return typeof val === 'string';
}

function isNumber(val) {
    return typeof val === 'number';
}

function isBoolean(val) {
    return typeof val === 'boolean';
}

function isUndefined(val) {
    return typeof val === 'undefined';
}

function isArray(val) {
    return toString.call(val) === '[object Array]';
}

function isObject(val) {
    return toString.call(val) === '[object Object]';
}

function isNull(val) {
    return toString.call(val) === '[object Null]';
}

function JsonViewer(options) {
  this.seen = new Set();
    const defaults = {
        theme: 'dark',
        container: null,
        data: {},
        expand: false,
    };
    this.options = Object.assign(defaults, options);
    if (isNull(options.container)) {
        throw new Error('Container: dom element is required');
    }
    this.render();
}

JsonViewer.prototype.renderRight = function(theme, right, val) {
    if (isNumber(val)) {
        right.setAttribute('class', theme + 'rightNumber');
    } else if (isBoolean(val)) {
        right.setAttribute('class', theme + 'rightBoolean');
    } else if (val === 'null') {
        right.setAttribute('class', theme + 'rightNull');
    } else {
        right.setAttribute('class', theme + 'rightString');
    }
    right.innerText = val;
}

JsonViewer.prototype.renderChildren = function(theme, key, val, right, indent, left) {
    let self = this;
    let folder = this.createElement('span');
    let rotate90 = this.options.expand ? 'rotate90' : '';
    let addHeight = this.options.expand ? 'add-height' : '';
    folder.setAttribute('class', theme + 'folder jv-sigil' + rotate90);
    folder.onclick = function (e) {
        // let nextSibling = e.target.parentNode.nextSibling;
        // self.toggleItem(nextSibling, e.target);
        self.toggleItem(folder.nextSibling, folder);
    }
    let len = 0;
    let isObj = false;
    if (isObject(val)) {
        len = Object.keys(val).length;
        isObj = true;
    } else {
        len = val.length;
    }
    left.innerHTML = isObj
      ? key + `: <span class="jv-folder-close-readout"><span class="jv-len">(${len})</span> {...}</span>`
      : key + `: <span class="jv-folder-close-readout"><span class="jv-len">(${
        len
      })</span> [${len > 0 ? '...' : ''}]</span><span class="jv-folder-open-readout">Array(${len})</span>`;
    left.prepend(folder);
    right.setAttribute('class', theme + 'rightObj ' + addHeight);
    self.parse(val, right, indent + 0, theme);
}
  
JsonViewer.prototype.parse = function(dataObj, parent, indent, theme) {
    const self = this;
    this.forEach(dataObj, function (val, key) {
        const { left, right } = self.createItem(indent, theme, parent, key, typeof val !== 'object');
        if (typeof val !== 'object') {
            self.renderRight(theme, right, val);
        } else {
            self.renderChildren(theme, key, val, right, indent, left);
        }
    });
}

JsonViewer.prototype.createItem = function(indent, theme, parent, key, basicType) {
    let self = this;
    let current = this.createElement('div');
    let left = this.createElement('div');
    let right = this.createElement('div');
    let wrap = this.createElement('div');

    current.style.marginLeft = indent * 2 + 'px';
    left.innerHTML = `${key}<span class="jv-${theme}-symbol">:&nbsp;</span>`;
    if (basicType) {
        current.appendChild(wrap);
        wrap.appendChild(left);
        wrap.appendChild(right);
        parent.appendChild(current);
        current.setAttribute('class', theme + 'current');
        wrap.setAttribute('class', 'jv-wrap');
        left.setAttribute('class', theme + 'left');
    } else {
        current.appendChild(left);
        current.appendChild(right);
        parent.appendChild(current);
        current.setAttribute('class', theme + 'current');
        left.setAttribute('class', theme + 'left jv-folder');
        left.onclick = function (e) {
            // let nextSibling = e.target.nextSibling;
            // self.toggleItem(nextSibling, e.target.querySelector('span'));
            self.toggleItem(left.nextSibling, left, e);
        }
    }
    
    return {
        left,
        right,
        current,
    };
}

JsonViewer.prototype.render = function () {
    let data = this.options.data;
    let theme = 'jv-' + this.options.theme + '-';
    let indent = 0;
    let parent = this.options.container;
    let key = 'object';
    let dataObj;
    
    parent.setAttribute('class', theme + 'con');
    try {
        dataObj = data;
    } catch (error) {
        throw new Error('It is not a json format');
    }
    if (dataObj === null) {
        key = 'null';
    }
    if (isArray(dataObj)) {
        key = 'array';
    }
    const expandall = document.createElement('div');
    expandall.innerText = "Expand All";
    expandall.setAttribute('class', 'jv-expandall');
    expandall.onclick = function (e) {
      const expand = expandall.innerText === 'Expand All';
      expandall.innerText = expand ? 'Collapse All' : 'Expand All';
      parent.querySelectorAll('.jv-folder').forEach(ele => {
        ele.onclick(expand);
      });
    };
    parent.appendChild(expandall);
    const { left, right } = this.createItem(indent, theme, parent, key);
    if (dataObj != null) {
      this.renderChildren(theme, key, dataObj, right, indent, left);
    }
}

JsonViewer.prototype.toggleItem = function (ele, target, forceState) {
  if (ele.nodeType === Node.TEXT_NODE) {
    return;
  }

  if (forceState === true) {
    ele.classList.add('add-height');
    target.classList.add('rotate90');
  } else if (forceState === false) {
    ele.classList.remove('add-height');
    target.classList.remove('rotate90');
  } else {
    ele.classList.toggle('add-height');
    target.classList.toggle('rotate90');
  }
}

JsonViewer.prototype.createElement = function (type) {
    return document.createElement(type);
}

JsonViewer.prototype.forEach = function (obj, fn) {
    if (isUndefined(obj) || isNull(obj) || this.seen.has(obj)) {
        return;
    }
    this.seen.add(obj);
    
    if (typeof obj === 'object' && isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key] ?? 'null', key, obj);
            }
        }
    }
}

export default JsonViewer;