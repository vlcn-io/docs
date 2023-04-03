import { useEffect, useRef, useState } from "react";
import createEditor from "./createEditor";
import { EditorView } from "codemirror";
import { CodeNode } from "./CodeNode";
// @ts-ignore
import { ObjectView } from "react-object-view";
import styles from "./RunnableCode.module.css";
import { PacmanLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { run } from "node:test";

// import dynamic from "next/dynamic";
// const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });
const palette = {
  base00: "#192830",
};

export default function RunnableCode({ code }: { code: string }) {
  const editorEl = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView>();
  const codeNode = useRef<CodeNode | null>(null);
  const [result, setResult] = useState<any>();
  const [error, setError] = useState<any | undefined>(undefined);
  const [waitingFor, setWaitingFor] = useState<string[] | null>([]);

  if (codeNode.current == null) {
    codeNode.current = new CodeNode();
    codeNode.current.on = (r: any, e?: any) => {
      setWaitingFor(null);
      if (e) {
        console.error(e);
        setError(e);
        setResult(undefined);
        return;
      }
      setError(undefined);
      setResult(r);
    };
  }

  const runCode = () => {
    if (editor.current == null) return true;

    const code = editor.current.state.doc.toString();
    codeNode.current?.eval(code);

    setWaitingFor(codeNode.current?.waitingFor() || null);
    return true;
  };

  useEffect(() => {
    if (editorEl.current == null) return;
    if (editor.current != null) return;

    editor.current = createEditor({
      parent: editorEl.current,
      doc: code,
      extraBinds: [{ key: "Shift-Enter", run: runCode }],
    });
    runCode();
  }, [editorEl.current]);

  return (
    <div className={styles.root}>
      <FontAwesomeIcon icon={faPlay} className={styles.run} onClick={runCode} />
      <div className={styles.editor} ref={editorEl}></div>
      <Result waitingFor={waitingFor} error={error} result={result} />
    </div>
  );
}

function Result({
  waitingFor,
  error,
  result,
}: {
  waitingFor: string[] | null;
  error: any;
  result: any;
}) {
  if (waitingFor != null) {
    // spinner
    return (
      <div className={styles.loading}>
        {waitingFor.length > 0 && (
          <div>Waiting for: {waitingFor.join(", ")}</div>
        )}
        <div className={styles.spinnerContainer}>
          <PacmanLoader color="#36d7b7" />
        </div>
      </div>
    );
  }
  return (
    <pre style={{ display: result !== undefined ? "block" : "none" }}>
      <code>
        {error !== undefined ? (
          error?.message
        ) : (
          <ObjectView data={{ "": result }} palette={palette} />
        )}
      </code>
    </pre>
  );
}
