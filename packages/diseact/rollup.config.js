import { execSync } from 'child_process';
import typescript from '@rollup/plugin-typescript';
import tsconfigPaths from 'rollup-plugin-typescript-paths';

execSync('copyfiles -u 1 "src/**/*.d.ts" ./')

/**
 * @type {import('rollup').RollupOptions}
 */
const default_config = {
    plugins: [tsconfigPaths, typescript()],
    input: [
        'src/lib/index.ts',
        'src/jsx-runtime/index.ts'
    ],
    output: {
        dir: './',
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
    },
    external: ['util', 'crypto', '@napi-rs/canvas', /^node\:/],
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
