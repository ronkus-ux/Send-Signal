const fs = require('fs');

const inputPath = './design-tokens.tokens.json';
const outputPath = './design-tokens.css';

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let css = ':root {\n';

function toKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
              .replace(/[\s_]+/g, '-')
              .toLowerCase();
}

function processValue(val, type, key) {
    if (typeof val === 'string') {
        return val.replace(/\{([^}]+)\}/g, (match, ref) => {
            let formattedRef = ref.replace(/\./g, '-').replace(/[\s_]+/g, '-').toLowerCase();
            return `var(--sys-${formattedRef})`;
        });
    }
    if (typeof val === 'number') {
        const dimTypes = ['dimension', 'sizing', 'spacing', 'borderRadius', 'borderWidth'];
        const dimKeys = ['font-size', 'line-height', 'letter-spacing', 'paragraph-spacing', 'paragraph-indent'];
        if (dimTypes.includes(type) || dimKeys.includes(key)) {
            return val === 0 ? '0' : `${val}px`;
        }
        return val;
    }
    return val;
}

function extractTokens(obj, currentPath = []) {
    if (obj && typeof obj === 'object') {
        if ('value' in obj) {
            if (typeof obj.value === 'object' && obj.value !== null && !Array.isArray(obj.value)) {
                // object value like custom-fontStyle
                for (const [key, val] of Object.entries(obj.value)) {
                    let k = toKebabCase(key);
                    let finalPath = [...currentPath, k];
                    let varName = '--sys-' + finalPath.map(p => toKebabCase(p)).join('-');
                    let processedVal = processValue(val, null, k);
                    css += `  ${varName}: ${processedVal};\n`;
                }
            } else {
                let varName = '--sys-' + currentPath.map(p => toKebabCase(p)).join('-');
                let lastKey = toKebabCase(currentPath[currentPath.length - 1] || '');
                let processedVal = processValue(obj.value, obj.type, lastKey);
                css += `  ${varName}: ${processedVal};\n`;
            }
        } else {
            for (const key in obj) {
                if (key === 'extensions' || key === 'description') continue;
                if (key === 'type' && typeof obj[key] === 'string') continue; 
                extractTokens(obj[key], [...currentPath, key]);
            }
        }
    }
}

extractTokens(data);

css += '}\n';

fs.writeFileSync(outputPath, css);
console.log('Successfully generated ' + outputPath);
