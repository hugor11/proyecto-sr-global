// Simple build script: minify script.js -> script.min.js using terser
const { minify } = require('terser');
const fs = require('fs');

(async () => {
  try {
    const srcPath = 'script.js';
    const outPath = 'script.min.js';
    const code = fs.readFileSync(srcPath, 'utf8');
    const result = await minify(code, {
      compress: {
        drop_console: false
      },
      mangle: true,
      format: { comments: false }
    });
    if (result.code) fs.writeFileSync(outPath, result.code);
    console.log('Minified JS written to', outPath);
  } catch (e) {
    console.error('Build error:', e);
    process.exit(1);
  }
})();
