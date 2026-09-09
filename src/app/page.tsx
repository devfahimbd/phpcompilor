'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { Header } from '../components/Header';
import { FileTabs } from '../components/FileTabs';
import { OutputPanel } from '../components/OutputPanel';
import { StatusBar } from '../components/StatusBar';
import { NewFileModal } from '../components/NewFileModal';
import { STARTER_TEMPLATES } from '../lib/templates';
import { PhpEngine } from '../lib/phpEngine';
import { VirtualFile, ExecutionResult } from '../types';
import { Code, Eye } from 'lucide-react';

// Dynamically import CodeEditor to prevent SSR issues with Monaco Editor
const CodeEditor = dynamic(
  () => import('../components/CodeEditor').then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '14px',
          background: '#ffffff',
        }}
      >
        Initializing Monaco PHP Editor...
      </div>
    ),
  }
);

export default function CompilerPage() {
  const [files, setFiles] = useState<VirtualFile[]>(() => {
    const tmpl = STARTER_TEMPLATES[0];
    return tmpl.files.map((f, i) => ({
      ...f,
      id: `file-${i + 1}`,
    }));
  });

  const [activeFileId, setActiveFileId] = useState<string>('file-1');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  const editorRef = useRef<any>(null);
  const phpEngineRef = useRef<PhpEngine | null>(null);

  // Active file object
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Helper file: find style.css if present
  const cssFile = files.find((f) => f.name.toLowerCase() === 'style.css');

  // Handle running PHP compilation
  const handleRun = useCallback(async () => {
    setIsRunning(true);

    try {
      if (!phpEngineRef.current) {
        phpEngineRef.current = new PhpEngine(files);
      } else {
        phpEngineRef.current.setFiles(files);
      }

      // Find entry file (e.g. index.php or active file if php)
      const entryFile =
        files.find((f) => f.name.toLowerCase() === 'index.php') ||
        (activeFile.language === 'php' ? activeFile : files[0]);

      const res = await phpEngineRef.current.run(entryFile.content);
      setExecutionResult(res);

      // Trigger celebratory micro-confetti on successful run
      if (res.success && res.output.length > 0) {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.1, x: 0.9 },
          colors: ['#2563eb', '#3b82f6', '#10b981', '#f59e0b'],
        });
      }

      // On mobile, auto-switch to preview on run so the user sees the output immediately
      if (window.innerWidth <= 900) {
        setMobileView('preview');
      }
    } catch (err: any) {
      setExecutionResult({
        success: false,
        output: '',
        rawOutput: `Fatal Error: ${err.message || String(err)}`,
        error: err.message,
        executionTimeMs: 0,
        exitCode: 1,
        logs: [
          {
            type: 'error',
            message: err.message || 'Execution failed',
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      });
    } finally {
      setIsRunning(false);
    }
  }, [files, activeFile]);

  // Run automatically on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRun();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Update file content
  const handleContentChange = (newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newContent } : f))
    );
  };

  // Close a file tab
  const handleCloseFile = (id: string) => {
    if (files.length <= 1) return;
    const remaining = files.filter((f) => f.id !== id);
    setFiles(remaining);
    if (activeFileId === id) {
      setActiveFileId(remaining[0].id);
    }
  };

  // Rename a file tab
  const handleRenameFile = (id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const ext = newName.split('.').pop()?.toLowerCase();
          let lang = f.language;
          if (ext === 'php') lang = 'php';
          else if (ext === 'css') lang = 'css';
          else if (ext === 'js') lang = 'javascript';
          else if (ext === 'html') lang = 'html';
          else if (ext === 'json') lang = 'json';
          return { ...f, name: newName, language: lang };
        }
        return f;
      })
    );
  };

  // Download individual file
  const handleDownloadFile = (file: VirtualFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download all files as ZIP
  const handleDownloadZip = async () => {
    const zip = new JSZip();
    files.forEach((f) => {
      zip.file(f.name, f.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phpcompilor-project-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format code in Monaco editor
  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Reset to default files
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all files to default?')) {
      const tmpl = STARTER_TEMPLATES[0];
      const newFiles = tmpl.files.map((f, i) => ({
        ...f,
        id: `file-${Date.now()}-${i}`,
      }));
      setFiles(newFiles);
      setActiveFileId(newFiles[0].id);
      setTimeout(() => handleRun(), 100);
    }
  };

  // Create new file from modal
  const handleCreateNewFile = (fileName: string, language: VirtualFile['language']) => {
    const newFile: VirtualFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      language,
      content:
        language === 'php'
          ? `<?php\n// ${fileName}\n\n`
          : language === 'css'
          ? `/* ${fileName} */\n`
          : language === 'javascript'
          ? `// ${fileName}\n`
          : '',
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        onRun={handleRun}
        onReset={handleReset}
        onFormat={handleFormat}
        onDownloadZip={handleDownloadZip}
        isRunning={isRunning}
      />

      {/* Main Split Workspace */}
      <main className="workspace">
        {/* Left Side: Editor Pane */}
        <section
          className={`editor-pane ${
            mobileView === 'preview' ? 'hide-on-mobile' : ''
          }`}
        >
          {/* File Tabs Bar */}
          <FileTabs
            files={files}
            activeFileId={activeFileId}
            onSelectFile={(id) => setActiveFileId(id)}
            onCloseFile={handleCloseFile}
            onDownloadFile={handleDownloadFile}
            onOpenNewFileModal={() => setIsNewFileModalOpen(true)}
            onRenameFile={handleRenameFile}
          />

          {/* Monaco Editor */}
          <CodeEditor
            file={activeFile}
            onChange={handleContentChange}
            onRun={handleRun}
            editorRef={editorRef}
          />
        </section>

        {/* Right Side: Output & Live Preview Pane */}
        <section
          className={`output-pane ${
            mobileView === 'editor' ? 'hide-on-mobile' : ''
          }`}
        >
          <OutputPanel
            result={executionResult}
            isRunning={isRunning}
            onClear={() => setExecutionResult(null)}
            cssContent={cssFile?.content}
          />
        </section>
      </main>

      {/* Mobile View Toggle Bar */}
      <div className="mobile-view-toggle">
        <button
          className={`mobile-toggle-btn ${
            mobileView === 'editor' ? 'active' : ''
          }`}
          onClick={() => setMobileView('editor')}
          id="mobile-view-editor-btn"
        >
          <Code size={16} />
          <span>Code Editor</span>
        </button>
        <button
          className={`mobile-toggle-btn ${
            mobileView === 'preview' ? 'active' : ''
          }`}
          onClick={() => setMobileView('preview')}
          id="mobile-view-preview-btn"
        >
          <Eye size={16} />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Status Bar */}
      <StatusBar
        activeFile={activeFile}
        result={executionResult}
        isRunning={isRunning}
      />

      {/* New File Modal */}
      <NewFileModal
        isOpen={isNewFileModalOpen}
        onClose={() => setIsNewFileModalOpen(false)}
        onCreate={handleCreateNewFile}
        existingNames={files.map((f) => f.name)}
      />
    </div>
  );
}
