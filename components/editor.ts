import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { indentWithTab } from "@codemirror/commands";

export default function createEditor(props: any) {
  const extraBinds = props.extraBinds || [];
  return new EditorView({
    extensions: [
      basicSetup,
      javascript(),
      keymap.of([indentWithTab, ...extraBinds]),
    ],
    ...props,
  });
}
