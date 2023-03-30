import marked from '/blog-assets/marked.js';

function remove(a, x) {
  a.splice(a.indexOf(x), 1);
}

function identity(x) {
  return x;
}

function invariant(pass, msg) {
  if (pass) {
    return;
  }

  throw new Error(msg);
}

const temp_el = document.createElement('div');
function sanitize(value) {
  if (value) {
    if (typeof value === 'object' && value.__html__) {
      return value.__html__;
    }
    if (Array.isArray(value)) {
      return value.map(sanitize).join('');
    }
  }
  temp_el.textContent = value;
  return temp_el.innerHTML;
}

function atom(initial) {
  let state = initial;
  let listeners = [];

  function notify() {
    listeners.forEach((l) => l(state));
  }

  return {
    merge(next) {
      state = {
        ...initial,
        ...next,
      };
      notify();
    },

    set(next) {
      state = next;
      notify();
    },

    get() {
      return state;
    },

    bind(cb) {
      listeners.push(cb);
    },

    unbind(cb) {
      remove(listeners, cb);
    },

    dispose() {
      listeners = state = null;
    },
  };
}

function publisher(el) {
  function _render(content, atom, converter = identity) {
    if (typeof content === 'string') {
      invariant(atom == null, 'You cannot use an atom with raw string content');
      // render and append to doc
      return append(converter(content));
    }

    const p = append(converter(content(atom?.get())));
    if (atom != null) {
      // bind to the atom
      // re-render into el on atom updates
      atom.bind((s) => {
        p.innerHTML = converter(content(s));
      });
    }

    return p;
  }

  function md(content, atom) {
    _render(content, atom, marked);
  }

  function html(content, atom) {
    _render(content, atom);
  }

  function append(rendered_content) {
    const p = document.createElement('p');
    p.innerHTML = rendered_content;
    el.append(p);

    return p;
  }

  return {
    _render,
    atom,
    md,
    html,
  };
}

export { publisher, atom };
