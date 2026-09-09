'use client';

import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, FileCode, Clock } from 'lucide-react';
import { VirtualFile, ExecutionResult } from '../types';

interface StatusBarProps {
  activeFile: VirtualFile;
  result: ExecutionResult | null;
  isRunning: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeFile,
  result,
  isRunning,
}) => {
  return (
    <footer className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <span
            className={`status-dot ${
              isRunning ? 'idle' : result?.success === false ? 'error' : ''
            }`}
          />
          <span>
            {isRunning
              ? 'Compiling...'
              : result
              ? result.success
                ? 'Compiled successfully'
                : 'Compilation error'
              : 'Ready to compile'}
          </span>
        </div>

        <div className="status-item hide-mobile">
          <Cpu size={14} color="#2563eb" />
          <span>PHP 8.3.4 (Browser Engine)</span>
        </div>

        <div className="status-item">
          <FileCode size={14} />
          <span>
            {activeFile.name} ({activeFile.language.toUpperCase()})
          </span>
        </div>
      </div>

      <div className="status-right">
        {result && (
          <div className="status-item">
            <Clock size={13} />
            <span>{result.executionTimeMs}ms</span>
          </div>
        )}

        <div className="status-item hide-mobile" style={{ color: '#2563eb', fontWeight: 500 }}>
          <span>Eternity Global Innovation</span>
        </div>
      </div>
    </footer>
  );
};
