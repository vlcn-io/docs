import React, { useEffect } from "react";

export default function Overflowit() {
  const [num, setNum] = React.useState(BigInt(0));
  useEffect(() => {
    let mounted = true;
    let lastTime = Date.now();
    function redraw() {
      if (!mounted) {
        return;
      }
      let now = Date.now();
      let delta = now - lastTime;
      lastTime = now;
      // we tick 1k times per millisecond to give us 1mil ticks per second
      const ticks = delta * 1000;
      setNum((num) => num + BigInt(ticks));
      requestAnimationFrame(redraw);
    }

    requestAnimationFrame(redraw);
    return () => {
      mounted = false;
    };
  }, []);
  return <span>{num.toString()}</span>;
}
