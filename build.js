import path from 'path';
import esbuild from 'esbuild';
import { exec } from 'child_process';
import fs from 'fs';

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
    plugins: [
      {
        name: 'modify-import-sources',
        setup(build) {
          build.onLoad({ filter: /\.js$/ }, async (args) => {
            const contents = await fs.promises.readFile(args.path, 'utf8');
            
            // Only modify imports for ESM
            if (MODULE_TYPE === 'esm') {
              const modifiedContents = contents.replace(
                /from\s+['"](\.[^'"]+)['"](?!\.m?js)/g, 
                (match, importPath) => {
                  // Check if the import path already exists with .js extension
                  const fullPath = path.resolve(path.dirname(args.path), importPath);
                  const jsPath = fullPath.endsWith('.js') ? fullPath : `${fullPath}.js`;
                  
                  return fs.existsSync(jsPath) 
                    ? `from '${importPath}.mjs'` 
                    : match;
                }
              );

              return { 
                contents: modifiedContents,
                loader: 'js' 
              };
            }

            return { contents };
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
])