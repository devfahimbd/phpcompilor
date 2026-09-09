'use client';

import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { setupMonacoPhp, TRUST_BLUE_THEME } from '../lib/monacoPhpConfig';
import { VirtualFile } from '../types';

interface CodeEditorProps {
  file: VirtualFile;
  onChange: (value: string) => void;
  onRun: () => void;
  editorRef: React.MutableRefObject<any>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  file,
  onChange,
  onRun,
  editorRef,
}) => {
  const monacoRef = useRef<Monaco | null>(null);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const handleEditorWillMount = (monaco: Monaco) => {
    monacoRef.current = monaco;
    setupMonacoPhp(monaco);
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Register Ctrl+Enter or Cmd+Enter to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current();
    });

    // Fix cursor misalignment: force Monaco to remeasure fonts once fonts are ready
    if (typeof document !== 'undefined' && (document as any).fonts) {
      (document as any).fonts.ready.then(() => {
        monaco.editor.remeasureFonts();
        editor.layout();
      });
    }

    // Secondary remeasure ticks to ensure character width grid is 100% accurate
    setTimeout(() => {
      monaco.editor.remeasureFonts();
      editor.layout();
    }, 150);

    setTimeout(() => {
      monaco.editor.remeasureFonts();
      editor.layout();
    }, 600);
  };

  const getLanguage = () => {
    switch (file.language) {
      case 'php':
        return 'php';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'javascript':
        return 'javascript';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="editor-container">
      <Editor
        height="100%"
        language={getLanguage()}
        value={file.content}
        theme={TRUST_BLUE_THEME}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        onChange={(val) => onChange(val || '')}
        options={{
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', 'Lucida Console', monospace",
          letterSpacing: 0,
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          cursorWidth: 2,
          cursorStyle: 'line',
          fontLigatures: false,
          smoothScrolling: true,
          renderLineHighlight: 'all',
          renderWhitespace: 'none',
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          guides: {
            indentation: true,
            bracketPairs: true,
            bracketPairsHorizontal: true,
            highlightActiveIndentation: true,
            highlightActiveBracketPair: true,
          },
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
};
