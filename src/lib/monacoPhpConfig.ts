import type { Monaco } from '@monaco-editor/react';
import { phpLanguageConfig, phpMonarchDefinition } from './monacoPhpLanguage';

export const TRUST_BLUE_THEME = 'trust-blue-light';

export function setupMonacoPhp(monaco: Monaco) {
  // Define custom Trust Blue Light theme
  monaco.editor.defineTheme(TRUST_BLUE_THEME, {
    base: 'vs',
    inherit: true,
    rules: [
      // PHP Open & Close tags
      { token: 'metatag.php', foreground: 'DC2626', fontStyle: 'bold' }, // <?php, <?=, ?>
      { token: 'metatag.html', foreground: '64748B' }, // <!DOCTYPE ...>

      // Keywords & Control structures
      { token: 'keyword.php', foreground: '2563EB', fontStyle: 'bold' }, // echo, if, foreach, function, class, return

      // Variables (Both standalone $name and interpolated "$name" in strings)
      { token: 'variable.php', foreground: '0284C7', fontStyle: 'bold' }, // $variables (vibrant sky-blue)
      { token: 'variable.predefined.php', foreground: '0284C7', fontStyle: 'bold' }, // $_GET, $_POST, $_SERVER
      { token: 'variable.other.php', foreground: '0284C7', fontStyle: 'bold' },

      // Strings
      { token: 'string.php', foreground: '16A34A' }, // "strings", 'strings' (forest green)
      { token: 'string.html', foreground: '16A34A' },
      { token: 'string.escape.php', foreground: 'D97706', fontStyle: 'bold' }, // \n, \t, \", \$, \\ (amber)
      { token: 'string.escape.invalid.php', foreground: 'EF4444' },

      // Numbers
      { token: 'number.php', foreground: 'D97706', fontStyle: 'bold' }, // 123, 20
      { token: 'number.float.php', foreground: 'D97706', fontStyle: 'bold' },
      { token: 'number.hex.php', foreground: 'D97706', fontStyle: 'bold' },
      { token: 'number.octal.php', foreground: 'D97706', fontStyle: 'bold' },
      { token: 'number.binary.php', foreground: 'D97706', fontStyle: 'bold' },

      // Constants & Booleans
      { token: 'constant.php', foreground: 'C026D3', fontStyle: 'bold' }, // TRUE, FALSE, NULL, NAME, PI, __DIR__

      // Functions (Built-in & User-defined)
      { token: 'support.function.php', foreground: '7C3AED', fontStyle: 'bold' }, // var_dump, print_r, strlen, myFunc
      { token: 'entity.name.function.php', foreground: '7C3AED', fontStyle: 'bold' },
      { token: 'function.php', foreground: '7C3AED', fontStyle: 'bold' },

      // Types
      { token: 'type.php', foreground: '7C3AED', fontStyle: 'bold' }, // int, string, array, bool

      // Operators (=, +, -, *, /, ., ->, =>, etc.) - Dark slate, NOT red!
      { token: 'operator.php', foreground: '1E293B', fontStyle: 'bold' },
      { token: 'delimiter.operator.php', foreground: '1E293B', fontStyle: 'bold' },

      // Delimiters (Semicolons, commas, brackets) - Slate, NOT red!
      { token: 'delimiter.php', foreground: '475569' }, // ;, ,
      { token: 'delimiter.bracket.php', foreground: '334155' }, // {, }
      { token: 'delimiter.parenthesis.php', foreground: '334155' }, // (, )
      { token: 'delimiter.array.php', foreground: '334155' }, // [, ]

      // Comments
      { token: 'comment.php', foreground: '64748B', fontStyle: 'italic' }, // // comments, /* */, #
      { token: 'comment.content.html', foreground: '64748B', fontStyle: 'italic' },
      { token: 'comment.html', foreground: '64748B', fontStyle: 'italic' },

      // Identifiers
      { token: 'identifier.php', foreground: '0F172A' },

      // HTML in mixed files
      { token: 'tag.html', foreground: 'EA580C', fontStyle: 'bold' }, // <div>, <p>
      { token: 'attribute.name', foreground: '4F46E5' }, // class="..."
      { token: 'attribute.value', foreground: '059669' }, // "..."
      { token: 'delimiter.html', foreground: '94A3B8' }, // <, >, /
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#1E293B',
      'editorLineNumber.foreground': '#94A3B8',
      'editorLineNumber.activeForeground': '#2563EB',
      'editorCursor.foreground': '#2563EB',
      'editor.selectionBackground': '#DBEAFE',
      'editor.inactiveSelectionBackground': '#EFF6FF',
      'editor.lineHighlightBackground': '#F8FAFC',
      'editorGutter.background': '#FFFFFF',
      'editorIndentGuide.background1': '#E2E8F0',
      'editorIndentGuide.activeBackground1': '#2563EB',
      'editorBracketPairGuide.background1': '#E2E8F0',
      'editorBracketPairGuide.background2': '#E2E8F0',
      'editorBracketPairGuide.background3': '#E2E8F0',
      'editorBracketPairGuide.activeBackground1': '#2563EB',
      'editorBracketPairGuide.activeBackground2': '#2563EB',
      'editorBracketPairGuide.activeBackground3': '#2563EB',
      'editorBracketMatch.background': '#EFF6FF',
      'editorBracketMatch.border': '#3B82F6',
    },
  });

  // Register enhanced PHP Monarch Tokenizer to highlight built-in and user functions in purple
  try {
    monaco.languages.setLanguageConfiguration('php', phpLanguageConfig);
    monaco.languages.setMonarchTokensProvider('php', phpMonarchDefinition);
  } catch (e) {
    console.warn('Could not customize PHP monarch tokens provider:', e);
  }

  // Register rich PHP autocomplete suggestions
  monaco.languages.registerCompletionItemProvider('php', {
    triggerCharacters: ['<', '?', '$', ':', '>', '{', ' '],
    provideCompletionItems: (model: any, position: any) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const textUntilPosition = lineContent.substring(0, position.column - 1);

      // 1. Tag range (replaces typed prefix like <, <?, <?p, <?php, <?=)
      const tagMatch = textUntilPosition.match(/(<[\?a-zA-Z=]*)$/);
      const tagStartCol = tagMatch ? position.column - tagMatch[1].length : position.column;
      const tagRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: tagStartCol,
        endColumn: position.column,
      };

      // 2. Variable range (replaces $, $_, $var)
      const varMatch = textUntilPosition.match(/(\$[a-zA-Z0-9_]*)$/);
      const varStartCol = varMatch ? position.column - varMatch[1].length : position.column;
      const varRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: varStartCol,
        endColumn: position.column,
      };

      // 3. Word range (for general words, functions, keywords)
      const word = model.getWordUntilPosition(position);
      const wordMatch = textUntilPosition.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/);
      const wordStartCol = wordMatch ? position.column - wordMatch[1].length : word.startColumn;
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: wordStartCol,
        endColumn: position.column,
      };

      const suggestions: any[] = [
        // Opening & closing tags
        {
          label: '<?php ... ?>',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<?php\n\t$0\n?>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Full PHP tag block',
          range: tagRange,
        },
        {
          label: '<?= ... ?> (Short echo)',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<?= $0 ?>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Short echo tag for template output',
          range: tagRange,
        },
        {
          label: '<?php echo',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<?php echo $0; ?>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Echo inside inline PHP tag',
          range: tagRange,
        },

        // Control structures
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if (${1:\\$condition}) {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'if statement',
          range,
        },
        {
          label: 'if-else',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if (${1:\\$condition}) {\n\t${2}\n} else {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'if-else statement',
          range,
        },
        {
          label: 'foreach',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'foreach (${1:\\$array} as ${2:\\$item}) {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'foreach loop',
          range,
        },
        {
          label: 'foreach-assoc',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'foreach (${1:\\$array} as ${2:\\$key} => ${3:\\$value}) {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'foreach associative loop',
          range,
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for (${1:\\$i} = 0; ${1:\\$i} < ${2:count}; ${1:\\$i}++) {\n\t${0}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'for loop',
          range,
        },
        {
          label: 'function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'function ${1:functionName}(${2:\\$param}) {\n\t${0}\n\treturn ${3:\\$result};\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'User-defined function',
          range,
        },

        // Output functions
        {
          label: 'echo',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'echo "${1:Hello, World!}";',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Output strings or variables to browser buffer',
          range,
        },
        {
          label: 'var_dump',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'var_dump(${1:\\$variable});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Dumps information about a variable including type and value',
          range,
        },
        {
          label: 'print_r',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print_r(${1:\\$array});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Prints human-readable information about a variable or array',
          range,
        },

        // Superglobals
        {
          label: '$_GET',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: '$_GET[\'${1:key}\']',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Superglobal: HTTP GET variables',
          range: varRange,
        },
        {
          label: '$_POST',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: '$_POST[\'${1:key}\']',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Superglobal: HTTP POST variables',
          range: varRange,
        },
        {
          label: '$_SERVER',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: '$_SERVER[\'${1:REQUEST_METHOD}\']',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Superglobal: Server and execution environment information',
          range: varRange,
        },

        // File includes
        {
          label: 'include',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "include '${1:filename.php}';",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Includes and evaluates the specified virtual file',
          range,
        },
        {
          label: 'require',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "require '${1:filename.php}';",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Requires and evaluates the specified virtual file (halts on error)',
          range,
        },
        {
          label: 'include_once',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "include_once '${1:filename.php}';",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Includes virtual file if not already included',
          range,
        },

        // Standard Functions
        {
          label: 'json_encode',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'json_encode(${1:\\$data}, JSON_PRETTY_PRINT)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Returns the JSON representation of a value',
          range,
        },
        {
          label: 'json_decode',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'json_decode(${1:\\$jsonString}, true)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Decodes a JSON string into PHP array',
          range,
        },
        {
          label: 'date',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "date('${1:Y-m-d H:i:s}')",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Format a local time/date',
          range,
        },
        {
          label: 'count',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'count(${1:\\$array})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Count all elements in an array',
          range,
        },
        {
          label: 'in_array',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'in_array(${1:\\$needle}, ${2:\\$haystack})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Checks if a value exists in an array',
          range,
        },
        {
          label: 'strlen',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'strlen(${1:\\$string})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Get string length',
          range,
        },
        {
          label: 'str_replace',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'str_replace(${1:\\$search}, ${2:\\$replace}, ${3:\\$subject})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Replace all occurrences of the search string with the replacement string',
          range,
        },
        {
          label: 'explode',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "explode('${1:,}', ${2:\\$string})",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Split a string by a string',
          range,
        },
        {
          label: 'implode',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "implode('${1:, }', ${2:\\$array})",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Join array elements with a string',
          range,
        },
      ];

      return { suggestions };
    },
  });
}
