import ts from '@rollup/plugin-typescript';
import { glob } from 'glob';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    plugins: [
        ts(),
    ],
    input: [
        './src/index.tsx',
        ...glob.sync('./src/commands/**/*')
    ],
    output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        dir: 'out'
    },
    external: ['@jsx-oh/discord']
}

export default config;
