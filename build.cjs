const path = require('path');
const esbuild = require('esbuild');
const fs = require('fs');
const { parse } = require('@babel/parser');
const { exec } = require('child_process');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

const RELATIVE_IMPORT_REGEX = /^(\.\/|\.\.\/)/;


const build = (MODULE_TYPE) => {
  const ext = MODULE_TYPE === 'cjs' ? '.cjs' : '.mjs';
 
  return esbuild.build({
    entryPoints: [
      'src/**/*.js',
    ],
    format: MODULE_TYPE,
    target: 'node21',
    outdir: './',
    outExtension: {
      '.js': ext
    },
    resolveExtensions: ['.js', '.mjs', '.cjs'],
    write: false,
    plugins: [
      {
        name: 'modify-import-sources',
        setup(build) {
          build.onEnd((result) => {
            result.outputFiles.forEach(async (file) => {
              let modifiedContents = file.text;
              const ast = parse(modifiedContents, { sourceType: MODULE_TYPE == 'esm' ? 'module' : 'unambiguous' });

              traverse(ast, {
                ImportDeclaration({ node }) {
                  if (node.source && node.source.value) {
                    if(!RELATIVE_IMPORT_REGEX.test(node.source.value)) return;

                    node.source.value = node.source.value.replace(/([^/]+)$/, `$&.${ext.slice(1)}`);
                  }
                },
                CallExpression({ node }) {
                  if (node.callee.name === 'require' && node.arguments[0].type === 'StringLiteral') {
                    const arg = node.arguments[0];
                    if(!RELATIVE_IMPORT_REGEX.test(arg.value)) return;
                    
                    arg.value = arg.value.replace(/([^/]+)$/, `$&.${ext.slice(1)}`);
                  }
                }
              });

              const { code } = generator(ast, {}, modifiedContents);

              const dir = path.dirname(file.path);
              await fs.promises.mkdir(dir, { recursive: true });

              await fs.promises.writeFile(file.path, code, 'utf8');
            });
          });
        }
      }
    ],
  });
};

Promise.all([
  build("esm"),
  build("cjs"),
  new Promise((r, rr) => exec('copyfiles -u 1 "src/**/*.d.ts" ./', (e) => e ? rr(e) : r())),
]);
