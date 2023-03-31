import { useEffect, useRef, useState } from "react";
import createEditor from "./createEditor";
import { EditorView } from "codemirror";
import { CodeNode } from "./CodeNode";

export default function RunnableCode({ code }: { code: string }) {
  const editorEl = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView>();
  const codeNode = useRef<CodeNode | null>(null);
  const [result, setResult] = useState<any>();
  const [error, setError] = useState<any | undefined>(undefined);

  if (codeNode.current == null) {
    codeNode.current = new CodeNode();
    codeNode.current.on = (r: any, e?: any) => {
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
    <div>
      <div ref={editorEl}></div>
      <pre style={{ display: result !== undefined ? "block" : "none" }}>
        <code>
          {error !== undefined ? error?.message : JSON.stringify(result)}
        </code>
      </pre>
    </div>
  );
}
