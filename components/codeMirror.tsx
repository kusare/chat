import { useEffect, useRef } from "react";
import { closeBrackets } from "@codemirror/closebrackets";
import { indentWithTab } from "@codemirror/commands";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/gutter";
import { EditorState } from "@codemirror/state";
import { highlightActiveLine, EditorView, keymap } from "@codemirror/view";

export const AsciiDocEditor = ({ defaultValue }: { defaultValue: string }) => {
  const editorParentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorParentRef.current === null) return;

    const editorView = new EditorView({
      state: EditorState.create({
        doc: defaultValue,
        extensions: [
          // closeBrackets(),
          // lineNumbers(),
          highlightActiveLine(),
          // highlightActiveLineGutter(),
          keymap.of([indentWithTab]),
        ],
      }),
      parent: editorParentRef.current,
    });

    return () => {
      editorView.destroy();
    };
  }, [defaultValue, editorParentRef]);

  return <div ref={editorParentRef} />;
};
