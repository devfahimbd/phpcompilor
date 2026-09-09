'use client';

import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  FileSpreadsheet,
  Plus,
  Download,
  X,
  FileCheck,
} from 'lucide-react';
import { VirtualFile } from '../types';

interface FileTabsProps {
  files: VirtualFile[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onCloseFile: (id: string) => void;
  onDownloadFile: (file: VirtualFile) => void;
  onOpenNewFileModal: () => void;
  onRenameFile: (id: string, newName: string) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCloseFile,
  onDownloadFile,
  onOpenNewFileModal,
  onRenameFile,
}) => {
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'php':
        return (
          <svg width="16" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="5" fill="#777BB4" />
            <text x="16" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="900" letterSpacing="-0.5">PHP</text>
          </svg>
        );
      case 'html':
      case 'htm':
        return (
          <svg width="16" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
            <path d="M5 28L2 3h28l-3 25-11 3z" fill="#E44D26"/>
            <path d="M16 28.6l8.8-2.4 2.5-21.2H16v23.6z" fill="#F16529"/>
            <path d="M16 12.3h4.9l-.3 3.8H16v3.7h4.6l-.4 5.3-4.2 1.1v3.9l7.7-2.1.8-10.2.2-1.7.3-3.8H16v3.9z" fill="#EBEBEB"/>
            <path d="M16 8.5H8.2l.3 3.8H16V8.5zm0 7.6h-7.5l.3 3.8H16v-3.8z" fill="#FFFFFF"/>
            <path d="M16 23.9l-4.2-1.1-.3-3H7.6l.5 6.2 7.9 2.2v-4.3z" fill="#FFFFFF"/>
          </svg>
        );
      case 'css':
        return (
          <svg width="16" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
            <path d="M5 28L2 3h28l-3 25-11 3z" fill="#1572B6"/>
            <path d="M16 28.6l8.8-2.4 2.5-21.2H16v23.6z" fill="#33A9DC"/>
            <path d="M16 12.3h4.9l-.3 3.8H16v3.7h4.6l-.4 5.3-4.2 1.1v3.9l7.7-2.1.8-10.2.2-1.7.3-3.8H16v3.9z" fill="#EBEBEB"/>
            <path d="M16 8.5H8.2l.3 3.8H16V8.5zm0 7.6h-7.5l.3 3.8H16v-3.8z" fill="#FFFFFF"/>
            <path d="M16 23.9l-4.2-1.1-.3-3H7.6l.5 6.2 7.9 2.2v-4.3z" fill="#FFFFFF"/>
          </svg>
        );
      case 'js':
      case 'javascript':
        return (
          <svg width="16" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="4" fill="#F7DF1E"/>
            <path d="M18.7 22.8c.8 1.3 1.9 2.2 3.6 2.2 1.5 0 2.5-.8 2.5-1.9 0-1.3-.9-1.8-2.5-2.5l-.9-.4c-2.5-1.1-4.2-2.5-4.2-5.4 0-2.7 2.1-4.8 5.4-4.8 2.4 0 4.1.8 5.2 2.8l-2.6 1.7c-.6-1-1.3-1.4-2.5-1.4-1.2 0-2 .7-2 1.6 0 1.1.7 1.6 2.3 2.3l.9.4c3 1.3 4.5 2.6 4.5 5.6 0 3.2-2.5 5-5.9 5-3.3 0-5.4-1.6-6.4-3.7l2.6-1.5zM10.2 10.3h3.5v11.9c0 2.4-1.4 3.5-3.6 3.5-1.9 0-3.1-.9-3.7-2.2l2.7-1.6c.4.7.8 1.1 1.4 1.1.7 0 1.1-.3 1.1-1.3V10.3h-1.4z" fill="#000000"/>
          </svg>
        );
      case 'json':
        return (
          <svg width="16" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="4" fill="#1E293B"/>
            <text x="16" y="21" textAnchor="middle" fill="#10B981" fontSize="14" fontFamily="monospace" fontWeight="900">{"{}"}</text>
          </svg>
        );
      case 'sql':
        return (
          <svg width="16" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="4" fill="#0284C7"/>
            <text x="16" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif" fontWeight="900">SQL</text>
          </svg>
        );
      default:
        return <FileCode size={16} color="#64748b" />;
    }
  };

  const startRename = (file: VirtualFile) => {
    setEditingFileId(file.id);
    setEditingName(file.name);
  };

  const commitRename = (id: string) => {
    if (editingName.trim()) {
      onRenameFile(id, editingName.trim());
    }
    setEditingFileId(null);
  };

  return (
    <div className="tabs-bar">
      <div className="tabs-list">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          const isEditing = file.id === editingFileId;

          return (
            <div
              key={file.id}
              className={`tab-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFile(file.id)}
              title={`${file.name} (Double-click to rename)`}
            >
              <span className="tab-icon">{getFileIcon(file.name)}</span>

              {isEditing ? (
                <input
                  type="text"
                  value={editingName}
                  autoFocus
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => commitRename(file.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename(file.id);
                    if (e.key === 'Escape') setEditingFileId(null);
                  }}
                  style={{
                    border: '1px solid #3b82f6',
                    borderRadius: '4px',
                    padding: '1px 4px',
                    fontSize: '12px',
                    outline: 'none',
                    width: '90px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    startRename(file);
                  }}
                >
                  {file.name}
                  {file.isEntry && (
                    <span style={{ fontSize: '10px', color: '#2563eb', marginLeft: '4px' }}>
                      ●
                    </span>
                  )}
                </span>
              )}

              {/* Individual File Download Button */}
              <button
                className="tab-action-btn download-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadFile(file);
                }}
                title={`Download ${file.name}`}
              >
                <Download size={13} />
              </button>

              {/* Close Tab Button (if more than 1 file) */}
              {files.length > 1 && (
                <button
                  className="tab-action-btn close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseFile(file.id);
                  }}
                  title="Close file"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          );
        })}

        <button
          className="new-tab-btn"
          onClick={onOpenNewFileModal}
          title="Create a new virtual file"
          id="new-file-tab-btn"
        >
          <Plus size={14} />
          <span>New File</span>
        </button>
      </div>
    </div>
  );
};
