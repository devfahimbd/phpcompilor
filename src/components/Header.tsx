'use client';

import React from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Github,
  Code2,
  Layers,
} from 'lucide-react';
import { STARTER_TEMPLATES } from '../lib/templates';

interface HeaderProps {
  onRun: () => void;
  onReset: () => void;
  onFormat: () => void;
  onDownloadZip: () => void;
  onSelectTemplate: (templateId: string) => void;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRun,
  onReset,
  onFormat,
  onDownloadZip,
  onSelectTemplate,
  isRunning,
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <a href="https://github.com/devfahimbd/phpcompilor" target="_blank" rel="noopener noreferrer" className="brand-badge">
          <div className="brand-icon">
            <Code2 size={20} strokeWidth={2.4} />
          </div>
          <div className="brand-title">
            <span>PHP Compiler</span>
            <span className="version-tag">PHP 8.3</span>
          </div>
        </a>
      </div>

      <div className="header-center">
        <button
          className="btn btn-primary"
          onClick={onRun}
          disabled={isRunning}
          title="Compile & Run (Ctrl + Enter)"
          id="run-code-btn"
        >
          <Play size={16} fill="currentColor" />
          <span className="header-btn-text">
            {isRunning ? 'Compiling...' : 'Run Code'}
          </span>
          <span style={{ fontSize: '11px', opacity: 0.8, background: 'rgba(255,255,255,0.2)', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px' }}>
            Ctrl+↵
          </span>
        </button>

        <button
          className="btn btn-outline"
          onClick={onFormat}
          title="Format Code"
          id="format-code-btn"
        >
          <Sparkles size={15} color="#2563eb" />
          <span className="header-btn-text">Format</span>
        </button>

        <button
          className="btn btn-outline"
          onClick={onReset}
          title="Reset to Template Defaults"
          id="reset-code-btn"
        >
          <RotateCcw size={15} />
          <span className="header-btn-text">Reset</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
          <select
            className="form-select"
            style={{ padding: '6px 10px', fontSize: '12.5px', height: '34px', cursor: 'pointer' }}
            onChange={(e) => onSelectTemplate(e.target.value)}
            defaultValue="fullstack-demo"
            id="template-select"
            title="Choose a Project Template"
          >
            {STARTER_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                📁 {tmpl.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="header-right">
        <button
          className="btn btn-outline"
          onClick={onDownloadZip}
          title="Download All Files as ZIP"
          id="download-zip-btn"
        >
          <Download size={15} color="#2563eb" />
          <span className="header-btn-text">Download All</span>
        </button>

        {/* GitHub link with direct icon in top-right as requested */}
        <a
          href="https://github.com/devfahimbd/phpcompilor"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-github"
          title="View source on GitHub: devfahimbd/phpcompilor"
          id="github-repo-link"
        >
          <Github size={17} />
          <span className="header-btn-text">GitHub</span>
          <span className="github-badge">Repo</span>
        </a>
      </div>
    </header>
  );
};
