import randomWords from '../../interactive/random-words.js';

const nanoid=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?"-":"_"),"");

const wordOptions = { exactly: 2, join: ' ' };
function startGset() {
  const tblA = document.getElementById("tbl-a");
  const tblB = document.getElementById("tbl-b");
  const tblMerge = document.getElementById("tbl-merge");
  const addARow = document.getElementById("add-a-row");
  const addBRow = document.getElementById("add-b-row");
  const merge = document.getElementById("merge");

  addARow.addEventListener("click", () => {
    aRows.push({ id: nanoid(10), content: randomWords(wordOptions), classname: "a-row" });
    redraw();
  });
  addBRow.addEventListener("click", () => {
    bRows.push({ id: nanoid(10), content: randomWords(wordOptions), classname: "b-row" });
    redraw();
  });
  merge.addEventListener("click", () => {
    merged = [];
    for (let i = 0; i < Math.max(aRows.length, bRows.length); i++) {
      if (i < aRows.length) {
        merged.push(aRows[i]);
      }
      if (i < bRows.length) {
        merged.push(bRows[i]);
      }
    }
    redraw();
  });

  const aRows = [];
  const bRows = [];
  let merged = [];

  for (let i = 0; i < 3; i++) {
    aRows.push({ id: nanoid(10), content: randomWords(wordOptions), classname: "a-row" });
    bRows.push({ id: nanoid(10), content: randomWords(wordOptions), classname: "b-row" });
  }

  function redraw() {
    Tbl(tblA, aRows);
    Tbl(tblB, bRows);
    Tbl(tblMerge, merged);
  }
  redraw();
}

// tbl component
function Tbl(root, rows) {
  root.innerHTML = `<table>
  <thead>
    <tr>
      <th>id</th>
      <th>content</th>
    </tr>
  </thead>
  <tbody>
    ${rows.map((row) => `<tr class="${row.classname}">
      <td>${row.id}</td>
      <td>${row.content}</td>
    </tr>`).join("")}
  </tbody>
  </table>`;
}

function startTieBreak() {
  const tblA = document.getElementById("tie-a");
  const tblB = document.getElementById("tie-b");
  const tblC = document.getElementById("tie-c");
  const radios = document.getElementsByName('tie-breaker');
  const resetBtn = document.getElementById("tie-reset");

  const initialState = {
    a: {
      node: 'a',
      id: 'x',
      content: 'z',
      time: '12:00:00',
      mergedWith: [],
      elem: tblA,
    },
    b: {
      node: 'b',
      id: 'x',
      content: 'b',
      time: '12:00:00',
      mergedWith: [],
      elem: tblB,
    },
    c: {
      node: 'c',
      id: 'x',
      content: 'a',
      time: '12:00:00',
      mergedWith: [],
      elem: tblC,
    }
  };

  let currentState;
  function reset() {
    currentState = {
      a: { ...initialState.a, mergedWith: [], },
      b: { ...initialState.b, mergedWith: [], },
      c: { ...initialState.c, mergedWith: [] }
    };

    redraw();
  }

  function updateMergeButtons(root, nodeState) {
    root.querySelectorAll('.merge-btn').forEach((el) => {
      if (nodeState.mergedWith.includes(el.dataset.node)) {
        el.disabled = true;
      } else {
        el.disabled = false;
      }
    });
  }

  function redraw() {
    Object.values(currentState).forEach((nodeState) => {
      TieTbl(nodeState.elem, nodeState);
      updateMergeButtons(nodeState.elem.parentElement, nodeState);
    });
  }

  function getMergeStrategy() {
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return radios[i].value;
      }
    }
  }

  function hookupMergeListeners(root, nodeName) {
    root.querySelectorAll('.merge-btn').forEach((el) => {
      el.addEventListener('click', () => {
        if (el.disabled) {
          return;
        }
        const nodeState = currentState[nodeName];
        const otherNode = currentState[el.dataset.node];

        nodeState.mergedWith.push(el.dataset.node);
        switch (getMergeStrategy()) {
          case 'value':
            if (nodeState.content < otherNode.content) {
              nodeState.content = otherNode.content;
            }
            break;
          case 'nodeId':
            if (nodeState.node < otherNode.node) {
              nodeState.content = otherNode.content;
            }
            break;
          case 'reject':
            break;
          case 'take':
            nodeState.content = otherNode.content;
            break;
        }

        redraw();
      });
    });
  }

  resetBtn.addEventListener('click', reset);

  // hook up event listeners
  Object.values(initialState).forEach((nodeState) => {
    hookupMergeListeners(nodeState.elem.parentElement, nodeState.node);
  });

  // radio listener to reset if they change selection
  radios.forEach((el) => {
    el.addEventListener('change', reset);
  });

  reset();
}

function TieTbl(root, row) {
  root.innerHTML = `
<table>
  <thead>
    <tr>
      <th>id</th>
      <th>content</th>
      <th>time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${row.id}</td>
      <td>${row.content}</td>
      <td>${row.time}</td>
    </tr>
  </tbody>
</table>`;
}

function startOverflowit() {
  const el = document.getElementById('overflowit');
  let num = BigInt(0);


  let lastTime = Date.now();
  function redraw() {
    let now = Date.now();
    let delta = now - lastTime;
    lastTime = now;
    // we tick 1k times per millisecond to give us 1mil ticks per second
    const ticks = delta * 1000;
    num += BigInt(ticks);
    el.innerHTML = num.toString();
    requestAnimationFrame(redraw);
  }

  requestAnimationFrame(redraw);
}

function startPush() {
  const aTbl = document.getElementById('push-a');
  const bTbl = document.getElementById('push-b');
  const cTbl = document.getElementById('push-c');

  const mbSince = document.getElementById('push-mb-since');
  const mcSince = document.getElementById('push-mc-since');
  const lbSince = document.getElementById('push-lb-since');
  const lcSince = document.getElementById('push-lc-since');
  const addRow = document.getElementById('push-addrow');
  const modifyRow = document.getElementById('push-modrow');

  const initialState = [
    {
      maxSeen: 0,
      rows: [],
      localTime: 0,
    },
    {
      maxSeen: 0,
      rows: [],
      localTime: 0,
    },
    {
      rows: [],
      localTime: 0,
    }
  ];

  const currentState = initialState.map((state) => ({ ...state, rows: [] }));

  addRow.addEventListener('click', () => {
    const time = ++currentState[2].localTime;
    currentState[2].rows.push({
      id: nanoid(10),
      content: randomWords(wordOptions),
      row_time: time,
      local_row_time: time,
    });
    redraw();
  });
  modifyRow.addEventListener('click', () => {
    const time = ++currentState[2].localTime;
    const idx = (Math.random() * currentState[2].rows.length) | 0;
    const row = currentState[2].rows[idx];
    row.content = randomWords(wordOptions);
    row.row_time = time;
    row.local_row_time = time;
    redraw();
  });

  function merge(to, from, since) {
    const fromRows = from.rows.filter((row) => {
      return row.local_row_time > since;
    });
    const toRowMap = new Map();
    to.rows.forEach((row) => {
      toRowMap.set(row.id, row);
    });
    let max = -1;
    fromRows.forEach((row) => {
      if (row.local_row_time > max) {
        max = row.local_row_time;
      }
      if (toRowMap.has(row.id)) {
        const toRow = toRowMap.get(row.id);
        if (toRow.row_time < row.row_time) {
          toRow.content = row.content;
          toRow.row_time = row.row_time;
          toRow.local_row_time = ++to.localTime;
        } else if (toRow.row_time == row.row_time) {
          if (toRow.content < row.content) {
            toRow.content = row.content;
            ++to.localTime;
          }
        }
      } else {
        to.rows.push({...row, local_row_time: ++to.localTime});
      }
    });
    max != -1 && (to.maxSeen = max);
  }

  mbSince.addEventListener('click', () => {
    merge(currentState[0], currentState[1], currentState[0].maxSeen);
    redraw();
  });
  mcSince.addEventListener('click', () => {
    merge(currentState[1], currentState[2], currentState[1].maxSeen);
    redraw();
  });

  function redraw() {
    PushTbl(aTbl, currentState[0].rows);
    PushTbl(bTbl, currentState[1].rows);
    PushTbl(cTbl, currentState[2].rows);

    // update since labels
    lbSince.innerHTML = currentState[0].maxSeen;
    lcSince.innerHTML = currentState[1].maxSeen;
  }

  redraw();
}

function PushTbl(root, rows) {
  root.innerHTML = `
<table>
  <thead>
    <tr>
      <th>id</th>
      <th>content</th>
      <th>row_time</th>
      <th>local_row_time</th>
    </tr>
  </thead>
  <tbody>
    ${rows.map((row) => {
      return `
    <tr>
      <td>${row.id}</td>
      <td>${row.content}</td>
      <td>${row.row_time}</td>
      <td>${row.local_row_time}</td>
    </tr>`;
    }).join('')}
  </tbody>
</table>`;
}

function start() {
  startGset();
  startTieBreak();
  startOverflowit();
  startPush();
}

window.onload = start;
