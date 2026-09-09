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
        return <FileCode size={14} color="#2563eb" />;
      case 'css':
        return <FileText size={14} color="#0284c7" />;
      case 'js':
      case 'javascript':
        return <FileSpreadsheet size={14} color="#d97706" />;
      case 'html':
        return <FileCode size={14} color="#ea580c" />;
      case 'json':
        return <FileText size={14} color="#16a34a" />;
      default:
        return <FileCheck size={14} color="#64748b" />;
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
