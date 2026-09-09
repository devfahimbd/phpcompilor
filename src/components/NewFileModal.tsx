'use client';

import React, { useState } from 'react';
import { X, FileCode2 } from 'lucide-react';
import { VirtualFile } from '../types';

interface NewFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (fileName: string, language: VirtualFile['language']) => void;
  existingNames: string[];
}

export const NewFileModal: React.FC<NewFileModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  existingNames,
}) => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const quickExtensions = ['.php', '.css', '.js', '.html', '.json'];

  const handleCreate = () => {
    let name = fileName.trim();
    if (!name) {
      setError('Please enter a file name.');
      return;
    }

    // Default to .php if no extension provided
    if (!name.includes('.')) {
      name += '.php';
    }

    if (existingNames.some((n) => n.toLowerCase() === name.toLowerCase())) {
      setError(`A file named "${name}" already exists.`);
      return;
    }

    const ext = name.split('.').pop()?.toLowerCase();
    let lang: VirtualFile['language'] = 'php';
    if (ext === 'css') lang = 'css';
    else if (ext === 'js') lang = 'javascript';
    else if (ext === 'html') lang = 'html';
    else if (ext === 'json') lang = 'json';

    onCreate(name, lang);
    setFileName('');
    setError('');
    onClose();
  };

  const appendExtension = (ext: string) => {
    const base = fileName.split('.')[0] || 'file';
    setFileName(base + ext);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
              }}
            >
              <FileCode2 size={18} />
            </div>
            <h3 className="modal-title">Create New File</h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            title="Close modal"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="modal-body">
          <label className="form-label">File Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. helper.php, header.php, style.css"
            value={fileName}
            autoFocus
            onChange={(e) => {
              setFileName(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') onClose();
            }}
            id="new-file-name-input"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Quick Extensions:</span>
            {quickExtensions.map((ext) => (
              <button
                key={ext}
                type="button"
                className="btn btn-outline"
                style={{ padding: '2px 8px', fontSize: '11px', height: '24px' }}
                onClick={() => appendExtension(ext)}
              >
                {ext}
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            id="submit-create-file-btn"
          >
            Create File
          </button>
        </div>
      </div>
    </div>
  );
};
