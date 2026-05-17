const fs = require('fs');

const mappings = {
  '--sys-color-roles-1-primary-roles-primary-color-role': 'brand-primary',
  '--sys-color-roles-1-primary-roles-primary-container-color-role': 'brand-primary-container',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral10': 'brand-neutral-10',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral20': 'brand-neutral-20',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral30': 'brand-neutral-30',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral40': 'brand-neutral-40',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral50': 'brand-neutral-50',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral60': 'brand-neutral-60',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral80': 'brand-neutral-80',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral90': 'brand-neutral-90',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral95': 'brand-neutral-95',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral98': 'brand-neutral-98',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral99': 'brand-neutral-99',
  '--sys-primitive-color-collection-1-color-palettes-neutral-neutral100': 'brand-neutral-100',
  '--sys-primitive-color-collection-1-color-palettes-secondary-secondary40': 'brand-secondary-40',
  '--sys-primitive-color-collection-1-color-palettes-secondary-secondary50': 'brand-secondary-50',
  '--sys-primitive-color-collection-1-color-palettes-success-success30': 'brand-success-30',
  '--sys-primitive-color-collection-1-color-palettes-success-success40': 'brand-success-40',
  '--sys-primitive-color-collection-1-color-palettes-success-success50': 'brand-success-50',
  '--sys-primitive-color-collection-1-color-palettes-success-success95': 'brand-success-95',
  '--sys-primitive-color-collection-1-color-palettes-warning-warning40': 'brand-warning-40',
  '--sys-primitive-color-collection-1-color-palettes-warning-warning50': 'brand-warning-50',
  '--sys-primitive-color-collection-1-color-palettes-warning-warning95': 'brand-warning-95',
  '--sys-primitive-color-collection-1-color-palettes-error-error50': 'brand-error-50',
  '--sys-primitive-color-collection-1-color-palettes-primary-primary20': 'brand-primary-20',
  '--sys-primitive-color-collection-1-color-palettes-primary-primary30': 'brand-primary-30',
  '--sys-primitive-color-collection-1-color-palettes-primary-primary40': 'brand-primary-40',
  '--sys-primitive-color-collection-1-color-palettes-primary-primary80': 'brand-primary-80',
  '--sys-primitive-color-collection-1-color-palettes-primary-primary90': 'brand-primary-90',
  '--sys-primitive-color-collection-1-color-palettes-primary-primary95': 'brand-primary-95',
  '--sys-typography-display-display-large-font-family': 'brand-display-large',
  '--sys-typography-title-title-large-font-family': 'brand-title-large',
  '--sys-typography-body-body-large-font-family': 'brand-body-large'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [v, name] of Object.entries(mappings)) {
    content = content.split(`[var(${v})]`).join(name);
  }
  fs.writeFileSync(filePath, content);
  console.log(`Processed ${filePath}`);
}

processFile('src/app/(public)/page.tsx');
processFile('src/app/(public)/layout.tsx');

const path = 'src/app/globals.css';
let content = fs.readFileSync(path, 'utf8');

const themeBlock = `
@theme {
  --color-brand-primary: var(--sys-color-roles-1-primary-roles-primary-color-role);
  --color-brand-primary-container: var(--sys-color-roles-1-primary-roles-primary-container-color-role);
  --color-brand-neutral-10: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral10);
  --color-brand-neutral-20: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral20);
  --color-brand-neutral-30: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral30);
  --color-brand-neutral-40: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral40);
  --color-brand-neutral-50: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral50);
  --color-brand-neutral-60: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral60);
  --color-brand-neutral-80: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral80);
  --color-brand-neutral-90: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral90);
  --color-brand-neutral-95: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral95);
  --color-brand-neutral-98: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral98);
  --color-brand-neutral-99: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral99);
  --color-brand-neutral-100: var(--sys-primitive-color-collection-1-color-palettes-neutral-neutral100);
  --color-brand-secondary-40: var(--sys-primitive-color-collection-1-color-palettes-secondary-secondary40);
  --color-brand-secondary-50: var(--sys-primitive-color-collection-1-color-palettes-secondary-secondary50);
  --color-brand-success-30: var(--sys-primitive-color-collection-1-color-palettes-success-success30);
  --color-brand-success-40: var(--sys-primitive-color-collection-1-color-palettes-success-success40);
  --color-brand-success-50: var(--sys-primitive-color-collection-1-color-palettes-success-success50);
  --color-brand-success-95: var(--sys-primitive-color-collection-1-color-palettes-success-success95);
  --color-brand-warning-40: var(--sys-primitive-color-collection-1-color-palettes-warning-warning40);
  --color-brand-warning-50: var(--sys-primitive-color-collection-1-color-palettes-warning-warning50);
  --color-brand-warning-95: var(--sys-primitive-color-collection-1-color-palettes-warning-warning95);
  --color-brand-error-50: var(--sys-primitive-color-collection-1-color-palettes-error-error50);
  --color-brand-primary-20: var(--sys-primitive-color-collection-1-color-palettes-primary-primary20);
  --color-brand-primary-30: var(--sys-primitive-color-collection-1-color-palettes-primary-primary30);
  --color-brand-primary-40: var(--sys-primitive-color-collection-1-color-palettes-primary-primary40);
  --color-brand-primary-80: var(--sys-primitive-color-collection-1-color-palettes-primary-primary80);
  --color-brand-primary-90: var(--sys-primitive-color-collection-1-color-palettes-primary-primary90);
  --color-brand-primary-95: var(--sys-primitive-color-collection-1-color-palettes-primary-primary95);
  --font-brand-display-large: var(--sys-typography-display-display-large-font-family);
  --font-brand-title-large: var(--sys-typography-title-title-large-font-family);
  --font-brand-body-large: var(--sys-typography-body-body-large-font-family);
}
`;

if (!content.includes('@theme {')) {
  content = content.replace('@import "tailwindcss";', '@import "tailwindcss";\n' + themeBlock);
  fs.writeFileSync(path, content);
  console.log('Added theme block');
} else {
  console.log('Theme block already exists');
}
