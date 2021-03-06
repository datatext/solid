import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import executable from "rollup-plugin-executable"

export default [
    {
        input: 'build/index.js',
        plugins: [
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            commonjs(),
            executable()
        ],
        external: [
            'commander',
            'inversify',
            'reflect-metadata',
            'fs',
            'pg',
            'pg-native'
        ],
        output: {
            file: 'dist/index.js',
            format: 'cjs',
        },
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') {
                // Suppress this overzealous warning. It's generated by TypeScript for each decorator function or
                // extended class ...
                // See https://github.com/rollup/rollup/issues/794#issuecomment-270803587
                return;
            }
            console.error(warning.message);
        }
    },
    {
        input: 'build/cli/cli.js',
        plugins: [
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            commonjs(),
            executable()
        ],
        external: [
            'commander',
            'inversify',
            'reflect-metadata',
            'fs',
            'pg',
            'pg-native'
        ],
        output: {
            file: 'dist/bin/solid',
            format: 'cjs',
            banner: '#!/usr/bin/env node'
        },
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') {
                // Suppress this overzealous warning. It's generated by TypeScript for each decorator function or
                // extended class ...
                // See https://github.com/rollup/rollup/issues/794#issuecomment-270803587
                return;
            }
            console.error(warning.message);
        }
    }
];