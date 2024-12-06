import { execSync } from 'child_process';

execSync('copyfiles -u 1 "src/**/*.d.ts" ./')

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
    {
        input: ['src/lib/index.js', 'src/jsx-runtime/index.js'],
        output: {
            dir: './',
            format: 'es',
            entryFileNames: '[name].mjs',
            preserveModules: true,
        }
    },
    {
        input: ['src/lib/index.js', 'src/jsx-runtime/index.js'],
        output: {
            dir: './',
            format: 'cjs',
            entryFileNames: '[name].cjs',
            preserveModules: true,
        }
    }
]

export default config;