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

  const handleEditorWillMount = (monaco: Monaco) => {
    monacoRef.current = monaco;
    setupMonacoPhp(monaco);
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Register Ctrl+Enter or Cmd+Enter to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
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
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderLineHighlight: 'all',
          renderWhitespace: 'selection',
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
};
