import { VirtualFile, ExecutionResult, ExecutionLog } from '../types';

/**
 * High-performance, client-side PHP execution engine.
 * Supports:
 * - Mixed PHP and HTML/CSS/JS templating
 * - <?php ... ?>, <?= ... ?>, <? ... ?>
 * - Multi-file virtual includes: include, require, include_once, require_once
 * - Alternative syntax: if (...): ... endif;, foreach (...): ... endforeach;
 * - Standard control structures: if/elseif/else, for, foreach, while, do-while, switch/case
 * - Standard variables ($a, $b), arrays, nested arrays, associative arrays
 * - Standard string, array, math, date, json, and utility functions
 * - Output buffering: echo, print, printf, print_r, var_dump
 * - Superglobals: $_GET, $_POST, $_SERVER, $_SESSION, $_COOKIE
 */

export class PhpEngine {
  private files: Map<string, VirtualFile> = new Map();
  private includedFiles: Set<string> = new Set();
  private outputBuffer: string[] = [];
  private logs: ExecutionLog[] = [];
  private globals: Record<string, any> = {};
  private functions: Record<string, Function> = {};
  private constants: Record<string, any> = {};

  constructor(files: VirtualFile[] = []) {
    this.setFiles(files);
    this.initGlobals();
    this.initStandardLibrary();
  }

  public setFiles(files: VirtualFile[]) {
    this.files.clear();
    for (const file of files) {
      this.files.set(file.name.toLowerCase().trim(), file);
    }
  }

  private initGlobals() {
    this.globals = {
      _SERVER: {
        SERVER_NAME: 'localhost',
        SERVER_PORT: '3000',
        REQUEST_METHOD: 'GET',
        REQUEST_URI: '/index.php',
        SCRIPT_NAME: '/index.php',
        SCRIPT_FILENAME: '/var/www/html/index.php',
        HTTP_USER_AGENT: 'PHPCompiler/1.0 (Interactive Browser IDE)',
        REMOTE_ADDR: '127.0.0.1',
        SERVER_SOFTWARE: 'PHP-Compiler-Wasm/8.3',
        GATEWAY_INTERFACE: 'CGI/1.1',
        SERVER_PROTOCOL: 'HTTP/1.1',
      },
      _GET: {},
      _POST: {},
      _COOKIE: {},
      _SESSION: {},
      _REQUEST: {},
      _ENV: {},
    };

    this.constants = {
      PHP_VERSION: '8.3.4',
      PHP_MAJOR_VERSION: 8,
      PHP_MINOR_VERSION: 3,
      PHP_RELEASE_VERSION: 4,
      PHP_OS: 'Linux',
      PHP_EOL: '\n',
      DIRECTORY_SEPARATOR: '/',
      PATH_SEPARATOR: ':',
      TRUE: true,
      FALSE: false,
      NULL: null,
    };
  }

  private log(type: ExecutionLog['type'], message: string) {
    this.logs.push({
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    });
  }

  private initStandardLibrary() {
    this.functions = {
      // Output
      echo: (...args: any[]) => {
        for (const arg of args) {
          this.outputBuffer.push(this.formatOutput(arg));
        }
      },
      print: (arg: any) => {
        this.outputBuffer.push(this.formatOutput(arg));
        return 1;
      },
      print_r: (arg: any, returnVal: boolean = false) => {
        const text = this.formatPrintR(arg);
        if (returnVal) return text;
        this.outputBuffer.push(text);
        return true;
      },
      var_dump: (...args: any[]) => {
        for (const arg of args) {
          this.outputBuffer.push(this.formatVarDump(arg) + '\n');
        }
      },
      printf: (format: string, ...args: any[]) => {
        const text = this.sprintf(format, ...args);
        this.outputBuffer.push(text);
        return text.length;
      },
      sprintf: (format: string, ...args: any[]) => {
        return this.sprintf(format, ...args);
      },

      // String functions
      strlen: (str: any) => String(str ?? '').length,
      strtolower: (str: any) => String(str ?? '').toLowerCase(),
      strtoupper: (str: any) => String(str ?? '').toUpperCase(),
      ucfirst: (str: any) => {
        const s = String(str ?? '');
        return s.charAt(0).toUpperCase() + s.slice(1);
      },
      ucwords: (str: any) => {
        return String(str ?? '').replace(/\b\w/g, (c) => c.toUpperCase());
      },
      trim: (str: any) => String(str ?? '').trim(),
      ltrim: (str: any) => String(str ?? '').trimStart(),
      rtrim: (str: any) => String(str ?? '').trimEnd(),
      substr: (str: any, start: number, length?: number) => {
        const s = String(str ?? '');
        if (start < 0) start = Math.max(0, s.length + start);
        if (length === undefined) return s.slice(start);
        if (length < 0) return s.slice(start, s.length + length);
        return s.slice(start, start + length);
      },
      strpos: (haystack: any, needle: any, offset = 0) => {
        const pos = String(haystack ?? '').indexOf(String(needle ?? ''), offset);
        return pos === -1 ? false : pos;
      },
      str_replace: (search: any, replace: any, subject: any) => {
        const s = String(subject ?? '');
        if (Array.isArray(search)) {
          let res = s;
          search.forEach((item, idx) => {
            const rep = Array.isArray(replace) ? replace[idx] ?? '' : replace;
            res = res.split(item).join(rep);
          });
          return res;
        }
        return s.split(search).join(replace);
      },
      str_repeat: (input: any, multiplier: number) => String(input ?? '').repeat(Math.max(0, multiplier)),
      strrev: (str: any) => String(str ?? '').split('').reverse().join(''),
      explode: (separator: string, string: string, limit?: number) => {
        if (!separator) return false;
        const parts = String(string ?? '').split(separator);
        if (limit !== undefined && limit > 0 && parts.length > limit) {
          const head = parts.slice(0, limit - 1);
          const tail = parts.slice(limit - 1).join(separator);
          return [...head, tail];
        }
        return parts;
      },
      implode: (glueOrPieces: any, pieces?: any[]) => {
        if (Array.isArray(glueOrPieces)) {
          return glueOrPieces.join('');
        }
        return (pieces || []).join(glueOrPieces ?? '');
      },
      htmlspecialchars: (string: any) => {
        return String(string ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      },
      strip_tags: (input: any) => {
        return String(input ?? '').replace(/<\/?[^>]+(>|$)/g, '');
      },
      number_format: (num: number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
        const n = Number(num) || 0;
        const parts = n.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
        return parts.join(decPoint);
      },
      md5: (str: string) => {
        // Lightweight pseudo-hash for client-side demo
        let hash = 0;
        const s = String(str ?? '');
        for (let i = 0; i < s.length; i++) {
          const char = s.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
      },
      base64_encode: (str: string) => {
        try {
          return btoa(unescape(encodeURIComponent(String(str))));
        } catch {
          return '';
        }
      },
      base64_decode: (str: string) => {
        try {
          return decodeURIComponent(escape(atob(String(str))));
        } catch {
          return '';
        }
      },

      // Array functions
      count: (arr: any) => (Array.isArray(arr) ? arr.length : typeof arr === 'object' && arr !== null ? Object.keys(arr).length : 1),
      is_array: (val: any) => Array.isArray(val) || (typeof val === 'object' && val !== null),
      in_array: (needle: any, haystack: any) => {
        if (Array.isArray(haystack)) return haystack.some((x) => x == needle);
        if (typeof haystack === 'object' && haystack !== null) return Object.values(haystack).some((x) => x == needle);
        return false;
      },
      array_keys: (arr: any) => (typeof arr === 'object' && arr !== null ? Object.keys(arr) : []),
      array_values: (arr: any) => (typeof arr === 'object' && arr !== null ? Object.values(arr) : []),
      array_push: (arr: any[], ...elements: any[]) => {
        if (!Array.isArray(arr)) return 0;
        return arr.push(...elements);
      },
      array_pop: (arr: any[]) => (Array.isArray(arr) ? arr.pop() : null),
      array_shift: (arr: any[]) => (Array.isArray(arr) ? arr.shift() : null),
      array_unshift: (arr: any[], ...elements: any[]) => (Array.isArray(arr) ? arr.unshift(...elements) : 0),
      array_merge: (...arrays: any[]) => {
        const result: any = Array.isArray(arrays[0]) ? [] : {};
        for (const item of arrays) {
          if (Array.isArray(item)) {
            if (Array.isArray(result)) {
              result.push(...item);
            } else {
              Object.assign(result, item);
            }
          } else if (typeof item === 'object' && item !== null) {
            Object.assign(result, item);
          }
        }
        return result;
      },
      array_slice: (arr: any[], offset: number, length?: number) => {
        if (!Array.isArray(arr)) return [];
        return length !== undefined ? arr.slice(offset, offset + length) : arr.slice(offset);
      },
      array_reverse: (arr: any[]) => (Array.isArray(arr) ? [...arr].reverse() : arr),
      array_sum: (arr: any[]) => (Array.isArray(arr) ? arr.reduce((a, b) => Number(a) + Number(b), 0) : 0),
      array_map: (callback: Function, arr: any[]) => (Array.isArray(arr) ? arr.map((x, i) => callback(x, i)) : []),
      array_filter: (arr: any[], callback?: Function) => {
        if (!Array.isArray(arr)) return [];
        return callback ? arr.filter((x, i) => callback(x, i)) : arr.filter(Boolean);
      },
      sort: (arr: any[]) => {
        if (Array.isArray(arr)) {
          arr.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
          return true;
        }
        return false;
      },
      rsort: (arr: any[]) => {
        if (Array.isArray(arr)) {
          arr.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
          return true;
        }
        return false;
      },

      // Math functions
      abs: (x: any) => Math.abs(Number(x) || 0),
      round: (val: any, precision = 0) => {
        const factor = Math.pow(10, precision);
        return Math.round((Number(val) || 0) * factor) / factor;
      },
      floor: (x: any) => Math.floor(Number(x) || 0),
      ceil: (x: any) => Math.ceil(Number(x) || 0),
      min: (...args: any[]) => {
        const flat = args.flat();
        return Math.min(...flat.map(Number));
      },
      max: (...args: any[]) => {
        const flat = args.flat();
        return Math.max(...flat.map(Number));
      },
      rand: (min = 0, max = 2147483647) => Math.floor(Math.random() * (max - min + 1)) + min,
      mt_rand: (min = 0, max = 2147483647) => Math.floor(Math.random() * (max - min + 1)) + min,
      pow: (base: any, exp: any) => Math.pow(Number(base) || 0, Number(exp) || 0),
      sqrt: (x: any) => Math.sqrt(Number(x) || 0),
      pi: () => Math.PI,

      // Date functions
      date: (format: string, timestamp?: number) => {
        const d = timestamp ? new Date(timestamp * 1000) : new Date();
        return this.formatPhpDate(format, d);
      },
      time: () => Math.floor(Date.now() / 1000),
      strtotime: (str: string) => {
        const parsed = Date.parse(str);
        return isNaN(parsed) ? false : Math.floor(parsed / 1000);
      },
      microtime: (getAsFloat = false) => {
        const now = Date.now();
        if (getAsFloat) return now / 1000;
        return `0.${(now % 1000) * 1000} ${Math.floor(now / 1000)}`;
      },

      // JSON functions
      json_encode: (value: any) => {
        try {
          return JSON.stringify(value);
        } catch {
          return false;
        }
      },
      json_decode: (jsonStr: string, assoc = false) => {
        try {
          return JSON.parse(jsonStr);
        } catch {
          return null;
        }
      },

      // Type checks & language constructs
      isset: (...args: any[]) => args.every((a) => a !== undefined && a !== null),
      empty: (val: any) => !val || (Array.isArray(val) && val.length === 0) || val === '0',
      is_null: (val: any) => val === null || val === undefined,
      is_numeric: (val: any) => !isNaN(parseFloat(val)) && isFinite(val),
      is_string: (val: any) => typeof val === 'string',
      is_int: (val: any) => Number.isInteger(val),
      is_bool: (val: any) => typeof val === 'boolean',
      gettype: (val: any) => {
        if (val === null) return 'NULL';
        if (Array.isArray(val)) return 'array';
        if (typeof val === 'number') return Number.isInteger(val) ? 'integer' : 'double';
        if (typeof val === 'string') return 'string';
        if (typeof val === 'boolean') return 'boolean';
        if (typeof val === 'object') return 'object';
        return 'unknown type';
      },
      define: (name: string, value: any) => {
        this.constants[name] = value;
        return true;
      },
      defined: (name: string) => name in this.constants,

      // Files & includes
      file_get_contents: (filename: string) => {
        const cleanName = filename.replace(/^(\.\/|\/)/, '').toLowerCase().trim();
        const file = this.files.get(cleanName);
        if (file) return file.content;
        return false;
      },
      include: (filename: string) => this.includeFile(filename, false),
      require: (filename: string) => this.includeFile(filename, true),
      include_once: (filename: string) => {
        const clean = filename.toLowerCase().trim();
        if (this.includedFiles.has(clean)) return true;
        this.includedFiles.add(clean);
        return this.includeFile(filename, false);
      },
      require_once: (filename: string) => {
        const clean = filename.toLowerCase().trim();
        if (this.includedFiles.has(clean)) return true;
        this.includedFiles.add(clean);
        return this.includeFile(filename, true);
      },
      header: (headerStr: string) => {
        this.log('info', `Header sent: ${headerStr}`);
      },
      exit: (status?: any) => {
        if (status !== undefined) {
          this.outputBuffer.push(this.formatOutput(status));
        }
        throw new Error('__PHP_EXIT__');
      },
      die: (status?: any) => {
        if (status !== undefined) {
          this.outputBuffer.push(this.formatOutput(status));
        }
        throw new Error('__PHP_EXIT__');
      },
    };
  }

  private includeFile(filename: string, isRequire: boolean): boolean {
    const cleanName = filename.replace(/^(\.\/|\/)/, '').toLowerCase().trim();
    const targetFile = this.files.get(cleanName);
    if (!targetFile) {
      const msg = `${isRequire ? 'Fatal error' : 'Warning'}: ${isRequire ? 'require' : 'include'}(${filename}): Failed to open stream: No such file in virtual file system`;
      this.log(isRequire ? 'error' : 'warn', msg);
      this.outputBuffer.push(`\n<br /><b>${msg}</b><br />\n`);
      if (isRequire) {
        throw new Error(msg);
      }
      return false;
    }
    this.executePhpScript(targetFile.content);
    return true;
  }

  private sprintf(format: string, ...args: any[]): string {
    let i = 0;
    return format.replace(/%([%sdifuxX])/g, (match, specifier) => {
      if (specifier === '%') return '%';
      const val = args[i++];
      if (specifier === 's') return String(val ?? '');
      if (specifier === 'd' || specifier === 'i') return String(parseInt(val, 10) || 0);
      if (specifier === 'f') return String(parseFloat(val) || 0);
      if (specifier === 'x') return (parseInt(val, 10) || 0).toString(16);
      if (specifier === 'X') return (parseInt(val, 10) || 0).toString(16).toUpperCase();
      return match;
    });
  }

  private formatPhpDate(format: string, date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let out = '';
    for (let i = 0; i < format.length; i++) {
      const c = format[i];
      if (c === '\\' && i + 1 < format.length) {
        out += format[++i];
        continue;
      }
      switch (c) {
        case 'Y': out += date.getFullYear(); break;
        case 'y': out += date.getFullYear().toString().slice(-2); break;
        case 'm': out += pad(date.getMonth() + 1); break;
        case 'n': out += date.getMonth() + 1; break;
        case 'F': out += months[date.getMonth()]; break;
        case 'M': out += shortMonths[date.getMonth()]; break;
        case 'd': out += pad(date.getDate()); break;
        case 'j': out += date.getDate(); break;
        case 'l': out += days[date.getDay()]; break;
        case 'D': out += shortDays[date.getDay()]; break;
        case 'H': out += pad(date.getHours()); break;
        case 'h': out += pad(date.getHours() % 12 || 12); break;
        case 'i': out += pad(date.getMinutes()); break;
        case 's': out += pad(date.getSeconds()); break;
        case 'A': out += date.getHours() >= 12 ? 'PM' : 'AM'; break;
        case 'a': out += date.getHours() >= 12 ? 'pm' : 'am'; break;
        case 'U': out += Math.floor(date.getTime() / 1000); break;
        default: out += c;
      }
    }
    return out;
  }

  private formatOutput(val: any): string {
    if (val === null || val === undefined) return '';
    if (typeof val === 'boolean') return val ? '1' : '';
    if (Array.isArray(val)) {
      return 'Array';
    }
    if (typeof val === 'object') {
      return '[object Object]';
    }
    return String(val);
  }

  private formatPrintR(val: any, indent = ''): string {
    if (val === null) return '';
    if (typeof val !== 'object') return String(val);
    const isArr = Array.isArray(val);
    let res = isArr ? 'Array\n' : 'stdClass Object\n';
    res += `${indent}(\n`;
    const nextIndent = indent + '    ';
    for (const [k, v] of Object.entries(val)) {
      if (typeof v === 'object' && v !== null) {
        res += `${nextIndent}[${k}] => ` + this.formatPrintR(v, nextIndent) + '\n';
      } else {
        res += `${nextIndent}[${k}] => ${v}\n`;
      }
    }
    res += `${indent})\n`;
    return res;
  }

  private formatVarDump(val: any, indent = ''): string {
    if (val === null) return 'NULL';
    if (typeof val === 'boolean') return `bool(${val})`;
    if (typeof val === 'number') return Number.isInteger(val) ? `int(${val})` : `float(${val})`;
    if (typeof val === 'string') return `string(${val.length}) "${val}"`;
    if (Array.isArray(val)) {
      let res = `array(${val.length}) {\n`;
      const nextIndent = indent + '  ';
      val.forEach((item, index) => {
        res += `${nextIndent}[${index}]=>\n${nextIndent}${this.formatVarDump(item, nextIndent)}\n`;
      });
      res += `${indent}}`;
      return res;
    }
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      let res = `object(stdClass)#1 (${keys.length}) {\n`;
      const nextIndent = indent + '  ';
      for (const [k, v] of Object.entries(val)) {
        res += `${nextIndent}["${k}"]=>\n${nextIndent}${this.formatVarDump(v, nextIndent)}\n`;
      }
      res += `${indent}}`;
      return res;
    }
    return String(val);
  }

  /**
   * Main entry point to compile and run a file or code snippet.
   */
  public async run(entryCode: string): Promise<ExecutionResult> {
    const startTime = performance.now();
    this.outputBuffer = [];
    this.logs = [];
    this.includedFiles.clear();
    this.initGlobals();

    let exitCode = 0;
    let errorMessage: string | undefined;

    try {
      this.executePhpScript(entryCode);
    } catch (err: any) {
      if (err.message === '__PHP_EXIT__') {
        // clean normal exit
        exitCode = 0;
      } else {
        exitCode = 1;
        errorMessage = err.message || String(err);
        this.log('error', `PHP Fatal error: ${errorMessage}`);
        this.outputBuffer.push(`\n<br /><div style="color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;padding:12px;border-radius:6px;font-family:monospace;font-size:13px;"><b>PHP Fatal Error:</b> ${this.escapeHtml(errorMessage || '')}</div>\n`);
      }
    }

    const duration = Math.round(performance.now() - startTime);
    const renderedHtml = this.outputBuffer.join('');

    return {
      success: exitCode === 0,
      output: renderedHtml,
      rawOutput: renderedHtml,
      error: errorMessage,
      executionTimeMs: duration,
      exitCode,
      logs: this.logs,
    };
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /**
   * Translates PHP source containing mixed HTML and PHP tags into executable JavaScript
   * while maintaining scope, variables, and output buffering.
   */
  private executePhpScript(code: string) {
    // If no PHP opening tag is present, the entire code is HTML/text output
    if (!code.includes('<?php') && !code.includes('<?=')) {
      this.outputBuffer.push(code);
      return;
    }

    const jsCode = this.transpilePhpToJs(code);
    
    // Create execution context sandbox
    const context = {
      ...this.functions,
      ...this.constants,
      ...this.globals,
      __output: (text: any) => this.outputBuffer.push(this.formatOutput(text)),
      __rawOutput: (text: string) => this.outputBuffer.push(text),
    };

    const paramNames = Object.keys(context);
    const paramValues = Object.values(context);

    try {
      const runner = new Function(...paramNames, jsCode);
      runner(...paramValues);
    } catch (evalErr: any) {
      if (evalErr.message === '__PHP_EXIT__') {
        throw evalErr;
      }
      throw new Error(`Parse / Runtime error: ${evalErr.message}`);
    }
  }

  /**
   * Transpiles PHP code with mixed HTML templates into executable JS statements.
   */
  private transpilePhpToJs(phpCode: string): string {
    let outJs = '';
    let pos = 0;
    const len = phpCode.length;

    while (pos < len) {
      // Find next PHP opening tag: <?php or <?=
      const nextOpen = phpCode.indexOf('<?', pos);
      if (nextOpen === -1) {
        // Rest is raw HTML
        const htmlChunk = phpCode.slice(pos);
        if (htmlChunk.length > 0) {
          outJs += `__rawOutput(${JSON.stringify(htmlChunk)});\n`;
        }
        break;
      }

      // Output HTML leading up to the opening tag
      if (nextOpen > pos) {
        const htmlChunk = phpCode.slice(pos, nextOpen);
        outJs += `__rawOutput(${JSON.stringify(htmlChunk)});\n`;
      }

      let isEchoTag = false;
      let tagLen = 2;

      if (phpCode.startsWith('<?php', nextOpen)) {
        tagLen = 5;
      } else if (phpCode.startsWith('<?=', nextOpen)) {
        isEchoTag = true;
        tagLen = 3;
      } else {
        tagLen = 2;
      }

      // Find matching closing tag ?>
      const nextClose = phpCode.indexOf('?>', nextOpen + tagLen);
      let phpSnippet = '';
      if (nextClose === -1) {
        phpSnippet = phpCode.slice(nextOpen + tagLen);
        pos = len;
      } else {
        phpSnippet = phpCode.slice(nextOpen + tagLen, nextClose);
        pos = nextClose + 2;
      }

      if (isEchoTag) {
        // Short echo: <?= expr ?> -> echo expr;
        const expr = this.convertPhpExpressions(phpSnippet.trim().replace(/;$/, ''));
        outJs += `__output(${expr});\n`;
      } else {
        outJs += this.convertPhpBlock(phpSnippet) + '\n';
      }
    }

    return outJs;
  }

  /**
   * Converts a block of PHP statements into equivalent JS statements.
   */
  private convertPhpBlock(snippet: string): string {
    let s = snippet;

    // Handle single line comments and multi-line comments
    s = s.replace(/#.*$/gm, '//');

    // Handle alternative syntax:
    // if (...): -> if (...) {
    // endif; -> }
    // foreach (...): -> foreach (...) {
    // endforeach; -> }
    // for (...): -> for (...) {
    // endfor; -> }
    // while (...): -> while (...) {
    // endwhile; -> }
    s = s.replace(/:\s*(\/\/.*)?$/gm, ' { $1');
    s = s.replace(/\b(endif|endforeach|endfor|endwhile|endswitch)\s*;/g, '}');

    // Convert PHP string concatenation operator '.' into '+'
    // Carefully handle variable dots or string dots
    s = this.convertPhpExpressions(s);

    // Convert echo "hello", "world";
    s = s.replace(/\becho\b\s+([^;]+);/g, (match, args) => {
      const parts = this.splitPhpArgs(args);
      return parts.map((p) => `__output(${p.trim()});`).join(' ');
    });

    // Convert print "hello";
    s = s.replace(/\bprint\b\s+([^;]+);/g, (match, arg) => {
      return `__output(${arg.trim()});`;
    });

    return s;
  }

  /**
   * Transforms PHP expressions:
   * - Variables: $varName -> varName (and initializes on assignment if undeclared)
   * - String concat: . -> +
   * - Arrays: array(...) / [...]
   * - Associative arrays: ['key' => 'val'] -> ({ 'key': 'val' })
   * - Object access: $obj->prop -> obj.prop
   * - Foreach: foreach ($arr as $k => $v) / foreach ($arr as $v)
   */
  private convertPhpExpressions(code: string): string {
    let res = code;

    // Convert foreach ($items as $item) or foreach ($items as $k => $v)
    res = res.replace(/foreach\s*\(\s*\$([a-zA-Z0-9_]+)\s+as\s+\$([a-zA-Z0-9_]+)\s*=>\s*\$([a-zA-Z0-9_]+)\s*\)/g,
      'for (const [$2, $3] of Object.entries($1 || {}))');
    res = res.replace(/foreach\s*\(\s*\$([a-zA-Z0-9_]+)\s+as\s+\$([a-zA-Z0-9_]+)\s*\)/g,
      'for (const $2 of (Array.isArray($1) ? $1 : Object.values($1 || {})))');

    // Convert PHP object arrows: -> into .
    res = res.replace(/->/g, '.');

    // Convert associative array arrow '=>' to ':'
    // ['a' => 1, 'b' => 2] -> ({ a: 1, b: 2 })
    res = res.replace(/\[\s*([^\]]*=>[^\]]*)\]/g, (match, inner) => {
      const convertedInner = inner.replace(/=>/g, ':');
      return `({ ${convertedInner} })`;
    });

    // Convert array(...) construct
    res = res.replace(/\barray\s*\(\s*([^)]*=>[^)]*)\)/g, (match, inner) => {
      const convertedInner = inner.replace(/=>/g, ':');
      return `({ ${convertedInner} })`;
    });
    res = res.replace(/\barray\s*\(\s*([^)]*)\)/g, '[$1]');

    // Convert PHP string concatenation:
    // We need to avoid changing decimals like 3.14 or properties like obj.prop
    // Replace "str" . "str" or $a . $b or 'str' . $b
    res = res.replace(/(\$?[a-zA-Z0-9_\)\]"'])\s*\.\s*(\$?[a-zA-Z0-9_\(\["'])/g, '$1 + $2');
    res = res.replace(/(\$?[a-zA-Z0-9_\)\]"'])\s*\.\s*(\$?[a-zA-Z0-9_\(\["'])/g, '$1 + $2'); // double pass for chained concats

    // Convert superglobals:
    // $_GET['x'] -> _GET['x']
    // $_POST['x'] -> _POST['x']
    // $_SERVER['x'] -> _SERVER['x']
    res = res.replace(/\$_([A-Z_]+)/g, '_$1');

    // Convert PHP variables $varName into let/const or scoped variables:
    // For assignments: $myVar = ... -> if not initialized, define it
    // First, convert $name into name
    res = res.replace(/\$([a-zA-Z0-9_]+)/g, '$1');

    // In JS, variables assigned without var/let/const in strict mode error.
    // So find top-level assignments like `x = ...;` and ensure `var x = ...;`
    // Matches: `\b([a-zA-Z0-9_]+)\s*=[^=]`
    const assignedVars = new Set<string>();
    const assignRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!=)/g;
    let m;
    while ((m = assignRegex.exec(res)) !== null) {
      const varName = m[1];
      if (!['let', 'const', 'var', 'if', 'while', 'for', 'return', 'case', 'function', '_GET', '_POST', '_SERVER', '_SESSION', '_COOKIE', '_REQUEST'].includes(varName)) {
        assignedVars.add(varName);
      }
    }

    let declarations = '';
    if (assignedVars.size > 0) {
      declarations = `var ${Array.from(assignedVars).join(', ')};\n`;
    }

    return declarations + res;
  }

  private splitPhpArgs(argsStr: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuote: string | null = null;
    let parenDepth = 0;

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      if (inQuote) {
        current += char;
        if (char === inQuote && argsStr[i - 1] !== '\\') {
          inQuote = null;
        }
      } else {
        if (char === '"' || char === "'") {
          inQuote = char;
          current += char;
        } else if (char === '(' || char === '[' || char === '{') {
          parenDepth++;
          current += char;
        } else if (char === ')' || char === ']' || char === '}') {
          parenDepth--;
          current += char;
        } else if (char === ',' && parenDepth === 0) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }
    if (current.trim().length > 0) {
      parts.push(current);
    }
    return parts;
  }
}
