import { PresetTemplate } from '../types';

export const STARTER_TEMPLATES: PresetTemplate[] = [
  {
    id: 'default-app',
    title: 'Hello World',
    description: 'Minimal, error-free starter template for Eternity Global Innovation.',
    category: 'Starter',
    files: [
      {
        name: 'index.php',
        language: 'php',
        isEntry: true,
        content: `<?php
echo "<h1>Hello World!</h1>\\n";
echo "<h3>Welcome to Eternity Global Innovation</h3>\\n";
echo "<p>PHP online compiler is running live and ready. Start typing code to see instant live preview!</p>\\n";
?>
`,
      },
    ],
  },
];
