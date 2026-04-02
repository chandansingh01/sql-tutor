"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { sql, SQLite } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { basicSetup } from "codemirror";

interface SqlEditorProps {
  initialValue?: string;
  onRun: (query: string) => void;
  disabled?: boolean;
}

export default function SqlEditor({ initialValue = "", onRun, disabled }: SqlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [mounted, setMounted] = useState(false);

  const handleRun = useCallback(() => {
    if (!viewRef.current || disabled) return;
    const query = viewRef.current.state.doc.toString().trim();
    if (query) onRun(query);
  }, [onRun, disabled]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !editorRef.current) return;

    const runKeymap = keymap.of([
      {
        key: "Mod-Enter",
        run: () => {
          handleRun();
          return true;
        },
      },
    ]);

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        sql({ dialect: SQLite }),
        oneDark,
        runKeymap,
        EditorView.theme({
          "&": { fontSize: "14px", maxHeight: "200px" },
          ".cm-scroller": { overflow: "auto" },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [mounted, initialValue, handleRun]);

  if (!mounted) {
    return (
      <div className="bg-[#282c34] rounded-lg p-4 min-h-[120px] text-gray-400 font-mono text-sm">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={editorRef} className="rounded-lg overflow-hidden border border-gray-700" />
      <div className="flex items-center gap-3">
        <button
          onClick={handleRun}
          disabled={disabled}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors"
        >
          Run Query
        </button>
        <span className="text-xs text-gray-500">or press Ctrl+Enter / Cmd+Enter</span>
      </div>
    </div>
  );
}
