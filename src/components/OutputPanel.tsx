'use client';

import React, { useState } from 'react';
import {
  Eye,
  Terminal,
  Activity,
  RotateCw,
  ExternalLink,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { ExecutionResult } from '../types';

interface OutputPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onClear: () => void;
  cssContent?: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  isRunning,
  onClear,
  cssContent,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal' | 'logs'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.rawOutput || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    if (!result) return;
    const blob = new Blob([buildRenderedHtml()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Build the complete HTML to inject into the iframe, including any external virtual style.css
  const buildRenderedHtml = () => {
    if (!result) return '';
    let html = result.output || '';

    const hasHtmlStructure = /<\s*(html|body|div|p|h[1-6]|table|ul|ol|main|section)\b/i.test(html);
    const baseStyle = `
      <style>
        body {
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          color: #0f172a;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          ${!hasHtmlStructure ? 'white-space: pre-wrap; font-family: Consolas, "Courier New", monospace; font-size: 14px;' : ''}
        }
        ${cssContent || ''}
      </style>
    `;

    // Console interceptor script
    const consoleBridge = `
      <script>
        (function() {
          const send = (level, msg) => {
            try { window.parent.postMessage({ type: 'PHP_IFRAME_LOG', level: level, message: msg }, '*'); } catch(e) {}
          };
          const _log = console.log, _warn = console.warn, _error = console.error;
          console.log = function(...args) { _log.apply(console, args); send('info', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')); };
          console.warn = function(...args) { _warn.apply(console, args); send('warn', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')); };
          console.error = function(...args) { _error.apply(console, args); send('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')); };
          window.onerror = function(msg) { send('error', msg); };
        })();
      </script>
    `;

    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseStyle}${consoleBridge}`);
    } else {
      html = `${baseStyle}${consoleBridge}${html}`;
    }

    return html;
  };

  return (
    <div className="output-panel-container">
      <div className="output-header">
        <div className="output-nav">
          <button
            className={`nav-pill ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            id="tab-preview-btn"
          >
            <Eye size={15} />
            <span>Live Preview</span>
          </button>

          <button
            className={`nav-pill ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
            id="tab-terminal-btn"
          >
            <Terminal size={15} />
            <span>Raw Output / Console</span>
          </button>

          <button
            className={`nav-pill ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
            id="tab-logs-btn"
          >
            <Activity size={15} />
            <span>Logs ({result?.logs.length || 0})</span>
          </button>
        </div>

        <div className="output-action-group">
          {activeTab === 'preview' && (
            <button
              className="output-action-btn"
              onClick={handleOpenExternal}
              title="Open Live Preview in a new browser tab"
              id="open-new-window-btn"
            >
              <ExternalLink size={14} color="#2563eb" />
              <span className="output-btn-label">New Tab</span>
            </button>
          )}

          <button
            className={`output-action-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copy Raw Output to clipboard"
            id="copy-output-btn"
          >
            {copied ? (
              <>
                <Check size={14} color="#16a34a" />
                <span className="output-btn-label" style={{ color: '#16a34a' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="output-btn-label">Copy</span>
              </>
            )}
          </button>

          <button
            className="output-action-btn clear-btn"
            onClick={onClear}
            title="Clear console and reset output"
            id="clear-output-btn"
          >
            <Trash2 size={14} />
            <span className="output-btn-label">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'preview' ? (
        <div className="preview-container">
          {result ? (
            <iframe
              title="PHP Live Execution Preview"
              className="preview-iframe"
              srcDoc={buildRenderedHtml()}
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              id="live-preview-iframe"
            />
          ) : (
            <div className="terminal-placeholder">
              <Eye size={40} strokeWidth={1.2} />
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#334155' }}>
                {isRunning ? 'Compiling PHP Code...' : 'No Execution Output Yet'}
              </p>
              <p style={{ fontSize: '13px', maxWidth: '320px' }}>
                Click the <strong>Run Code</strong> button (or press <code>Ctrl+Enter</code>) to compile and render your PHP code live.
              </p>
            </div>
          )}
        </div>
      ) : activeTab === 'terminal' ? (
        <div className="terminal-view">
          {result ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  marginBottom: '12px',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '12px',
                  color: '#64748b',
                }}
              >
                <span>
                  Exit code: <strong>{result.exitCode}</strong> | Time: <strong>{result.executionTimeMs}ms</strong>
                </span>
                <span style={{ color: result.success ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {result.success ? '● Success' : '● Error'}
                </span>
              </div>
              <pre className="terminal-line" style={{ margin: 0 }}>
                {result.rawOutput || '(Process returned no output)'}
              </pre>
            </div>
          ) : (
            <div className="terminal-placeholder">
              <Terminal size={40} strokeWidth={1.2} />
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#334155' }}>
                {isRunning ? 'Running Process...' : 'Terminal is Empty'}
              </p>
              <p style={{ fontSize: '13px', maxWidth: '320px' }}>
                Standard output stream (stdout) and echo buffer will be printed here.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="terminal-view">
          {result?.logs && result.logs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.logs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    background:
                      log.type === 'error'
                        ? '#fef2f2'
                        : log.type === 'warn'
                        ? '#fffbeb'
                        : '#f0fdf4',
                    border: `1px solid ${
                      log.type === 'error'
                        ? '#fecaca'
                        : log.type === 'warn'
                        ? '#fde68a'
                        : '#bbf7d0'
                    }`,
                    color:
                      log.type === 'error'
                        ? '#b91c1c'
                        : log.type === 'warn'
                        ? '#b45309'
                        : '#15803d',
                  }}
                >
                  <span style={{ fontWeight: 700, marginRight: '6px' }}>
                    [{log.type.toUpperCase()}]
                  </span>
                  <span style={{ color: '#64748b', marginRight: '8px' }}>
                    {log.timestamp}:
                  </span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="terminal-placeholder">
              <Activity size={40} strokeWidth={1.2} />
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#334155' }}>
                No Execution Logs
              </p>
              <p style={{ fontSize: '13px' }}>
                Notices, warnings, and stream events will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
