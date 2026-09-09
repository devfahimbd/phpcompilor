import { PresetTemplate } from '../types';

export const STARTER_TEMPLATES: PresetTemplate[] = [
  {
    id: 'fullstack-demo',
    title: 'Full-Stack PHP App (HTML + CSS + JS)',
    description: 'Dynamic server-rendered dashboard with PHP logic, embedded HTML5, styled CSS, and interactive JavaScript.',
    category: 'Full-Stack',
    files: [
      {
        name: 'index.php',
        language: 'php',
        isEntry: true,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Eternity Global PHP Innovation Class</title>
  <link rel="stylesheet" href="style.css" />
  <style>
    /* In-line CSS inside PHP file */
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
      margin-bottom: 12px;
    }
    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .user-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(37,99,235,0.08);
      border-color: #93c5fd;
    }
    .counter-box {
      margin-top: 24px;
      padding: 18px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      text-align: center;
    }
    .btn-action {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-action:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <?php
    // Include virtual helper file from another tab!
    include 'data.php';

    $serverTime = date('l, F j, Y \\a\\t h:i:s A');
    $appName = "PHP Web Compiler IDE";
    $version = "8.3.4";
    $batch = "Eternity Global Innovation Course";

    $stats = [
      'Active Students' => 48,
      'Projects Built'  => 120,
      'Success Rate'    => '99.4%'
    ];
  ?>

  <div class="container">
    <div class="hero-badge">
      <span>●</span> Compiled & Executed Live
    </div>

    <h1>Welcome to <?= $appName ?></h1>
    <p class="subtitle">
      Powered by <strong>PHP <?= $version ?></strong> for <em><?= $batch ?></em>
    </p>

    <div class="alert alert-info">
      📅 <strong>Server Timestamp:</strong> <?= $serverTime ?>
    </div>

    <!-- Dynamic PHP stats loop -->
    <div class="stats-row">
      <?php foreach ($stats as $label => $value): ?>
        <div class="stat-card">
          <div class="stat-value"><?= $value ?></div>
          <div class="stat-label"><?= $label ?></div>
        </div>
      <?php endforeach; ?>
    </div>

    <!-- Student List from data.php -->
    <h2>Registered Students (Included from data.php)</h2>
    <div class="user-grid">
      <?php foreach ($students as $student): ?>
        <div class="user-card">
          <h3 style="margin:0 0 6px 0; color:#1e293b;"><?= $student['name'] ?></h3>
          <p style="margin:0 0 8px 0; font-size:13px; color:#64748b;"><?= $student['role'] ?></p>
          <span style="font-size:12px; padding:3px 8px; border-radius:6px; background:#f1f5f9; color:#475569;">
            Badge: <?= $student['badge'] ?>
          </span>
        </div>
      <?php endforeach; ?>
    </div>

    <!-- Interactive JS section running on client-side -->
    <div class="counter-box">
      <h3>Interactive JavaScript Test</h3>
      <p>Demonstrating how JavaScript runs seamlessly alongside rendered PHP markup.</p>
      <button class="btn-action" id="clickMeBtn">Click Me: 0 Clicks</button>
      <p id="clickMsg" style="margin-top:10px; font-weight:600; color:#2563eb;"></p>
    </div>
  </div>

  <script>
    // Embedded JavaScript in PHP output
    let count = 0;
    const btn = document.getElementById('clickMeBtn');
    const msg = document.getElementById('clickMsg');

    btn.addEventListener('click', () => {
      count++;
      btn.innerText = 'Clicked: ' + count + ' times!';
      msg.innerText = '🎉 JavaScript is running dynamically in the live sandbox iframe!';
    });
  </script>
</body>
</html>`,
      },
      {
        name: 'data.php',
        language: 'php',
        content: `<?php
/**
 * Data store file
 * This file is included into index.php using:
 * include 'data.php';
 */

$students = [
  [
    'name' => 'Fahim Ahmed',
    'role' => 'Lead Full-Stack Developer',
    'badge' => 'Instructor'
  ],
  [
    'name' => 'Sara Rahman',
    'role' => 'Backend PHP Specialist',
    'badge' => 'Pro'
  ],
  [
    'name' => 'Tariqul Islam',
    'role' => 'Database & API Architect',
    'badge' => 'Expert'
  ],
  [
    'name' => 'Mehnaz Kabir',
    'role' => 'Frontend UI Engineer',
    'badge' => 'Rising Star'
  ]
];
`,
      },
      {
        name: 'style.css',
        language: 'css',
        content: `/* External Stylesheet Virtual File */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 24px;
  background-color: #f8fafc;
  color: #0f172a;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

h1 {
  color: #1e293b;
  font-size: 28px;
  margin-top: 0;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  margin-bottom: 24px;
  font-size: 15px;
}

.alert {
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 14px;
}

.alert-info {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1d4ed8;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  font-weight: 500;
}
`,
      },
    ],
  },
  {
    id: 'form-validation',
    title: 'Student Grade & Fee Calculator (Form Handling)',
    description: 'PHP logic processing form inputs, calculating averages, awarding letter grades, and formatting outputs.',
    category: 'Forms & Logic',
    files: [
      {
        name: 'index.php',
        language: 'php',
        isEntry: true,
        content: `<?php
// Function to compute grade
function calculateGrade($marks) {
  if ($marks >= 80) return ['A+', '#16a34a', 'Outstanding'];
  if ($marks >= 70) return ['A',  '#2563eb', 'Excellent'];
  if ($marks >= 60) return ['B',  '#0284c7', 'Very Good'];
  if ($marks >= 50) return ['C',  '#d97706', 'Satisfactory'];
  return ['F', '#dc2626', 'Needs Improvement'];
}

$subjects = [
  'PHP & MySQL' => 88,
  'Web Architecture' => 92,
  'Algorithms' => 74,
  'Database Management' => 85,
  'JavaScript & DOM' => 79
];

$totalMarks = array_sum($subjects);
$count = count($subjects);
$average = round($totalMarks / $count, 2);
[$overallGrade, $gradeColor, $feedback] = calculateGrade($average);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grade & Fee Calculator</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; background: #f8fafc; color: #1e293b; }
    .card { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #f1f5f9; }
    th { background: #f8fafc; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
    .grade-badge { font-weight: 700; padding: 4px 10px; border-radius: 6px; color: white; display: inline-block; font-size: 13px; }
    .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin-top:0; color:#1e293b;">Semester Grade Report</h2>
    <p style="color:#64748b; font-size:14px;">Calculated dynamically with custom PHP functions & arrays.</p>

    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Marks</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($subjects as $subject => $score): ?>
          <?php [$grd, $color] = calculateGrade($score); ?>
          <tr>
            <td><strong><?= $subject ?></strong></td>
            <td><?= $score ?> / 100</td>
            <td><span class="grade-badge" style="background:<?= $color ?>"><?= $grd ?></span></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <div class="summary-box">
      <div>
        <div style="font-size:13px; color:#64748b;">Average Score</div>
        <div style="font-size:24px; font-weight:700; color:#1e293b;"><?= $average ?>%</div>
      </div>
      <div>
        <div style="font-size:13px; color:#64748b;">Overall Status</div>
        <div style="font-size:16px; font-weight:600; color:<?= $gradeColor ?>;"><?= $feedback ?> (<?= $overallGrade ?>)</div>
      </div>
    </div>
  </div>
</body>
</html>`,
      },
    ],
  },
  {
    id: 'api-json',
    title: 'PHP REST API Simulator (JSON & Headers)',
    description: 'Generates structured JSON response, array transformations, and timestamp calculation.',
    category: 'APIs & Backend',
    files: [
      {
        name: 'index.php',
        language: 'php',
        isEntry: true,
        content: `<?php
header('Content-Type: application/json; charset=utf-8');

$products = [
  ['id' => 101, 'name' => 'PHP Pro Mastery Course', 'price' => 49.99, 'stock' => 25],
  ['id' => 102, 'name' => 'Next.js & React Guide', 'price' => 39.99, 'stock' => 40],
  ['id' => 103, 'name' => 'Full-Stack Wasm Compiler', 'price' => 59.99, 'stock' => 12]
];

// Calculate summary
$totalInventoryValue = 0;
foreach ($products as $p) {
  $totalInventoryValue += ($p['price'] * $p['stock']);
}

$response = [
  'status' => 'success',
  'code' => 200,
  'generated_at' => date('c'),
  'meta' => [
    'total_items' => count($products),
    'inventory_value' => round($totalInventoryValue, 2),
    'currency' => 'USD'
  ],
  'data' => $products
];

echo json_encode($response, 128); // 128 = JSON_PRETTY_PRINT
`,
      },
    ],
  },
];
