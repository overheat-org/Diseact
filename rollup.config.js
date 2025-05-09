import { execSync } from 'child_process';

execSync('copyfiles -u 1 "src/**/*.d.ts" ./')

/**
 * @type {import('rollup').RollupOptions}
 */
const default_config = {
    input: ['src/lib/index.js', 'src/jsx-runtime/index.js'],
    output: {
        dir: './',
        preserveModules: true,
    },
    external: ['util', 'crypto', '@napi-rs/canvas'],
    treeshake: false
}

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
    {
        ...default_config,
        output: {
            ...default_config.output,
            format: 'es',
            entryFileNames: '[name].mjs',
        },
    },
    {
        ...default_config,
        output: {
            ...default_config.output,
            format: 'cjs',
            entryFileNames: '[name].cjs',
        },
    }
]

export default config;