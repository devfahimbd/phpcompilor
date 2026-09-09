export interface VirtualFile {
  id: string;
  name: string;
  content: string;
  language: 'php' | 'html' | 'css' | 'javascript' | 'json' | 'sql' | 'text';
  isEntry?: boolean;
  isReadonly?: boolean;
}

export interface ExecutionLog {
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  rawOutput: string;
  error?: string;
  executionTimeMs: number;
  exitCode: number;
  logs: ExecutionLog[];
}

export interface PresetTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  files: Array<{
    name: string;
    content: string;
    language: VirtualFile['language'];
    isEntry?: boolean;
  }>;
}
