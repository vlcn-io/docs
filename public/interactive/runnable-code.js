import createEditor from './editor.bundle.js';
import './jsbeautify.js';
import jsonViewer from './json-viewer.js';

export default async function runify() {
  const runnables = document.querySelectorAll('.runnable-code');
  for (const runnable of runnables) {
    const firstRunResult = makeComponent(runnable);
    if (isPromise(firstRunResult)) {
      try {
        await firstRunResult;
      } catch (e) {
        console.error(e);
      }
    }
  }
}

function makeComponent(runnable) {
  const setResult = (r) => {
    codeTag.innerHTML = '';
    if (typeof r === 'object') {
      new jsonViewer({
        container: codeTag,
        data: r
      });
    } else {
      codeTag.innerText = r;
    }
    if (r === undefined) {
      preTag.classList = 'display-none';
    }
  };
  const runCode = () => {
    const code = getCode();
    try {
      const result = eval(code);
      if (result === undefined) {
        preTag.classList = 'display-none'
      } else {
        preTag.classList = '';
        if (isPromise(result)) {
          result.then(setResult);
          result.catch(e => {
            codeTag.innerHTML = '';
            codeTag.innerText = e.message;
            throw e;
          });
          return result;
        } else {
          setResult(result);
          return result;
        }
      }
    } catch (e) {
      codeTag.innerText = e.message;
    }

    return true;
  };

  const editor = createEditor({
    parent: runnable,
    doc: js_beautify(runnable.querySelector('div').innerText.trim(), {
      "indent_size": "2",
      "indent_char": " ",
    }),
    extraBinds: [{key: "Shift-Enter", run: runCode }]
  });
  const getCode = () => {
    return '(async () => { ' + editor.state.doc.toString() + ' })();';
  };
  
  const codeTag = document.createElement('code');
  const preTag = document.createElement('pre');
  preTag.append(codeTag);
  runnable.append(preTag);

  return runCode();
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}