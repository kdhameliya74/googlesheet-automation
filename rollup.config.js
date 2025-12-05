const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const copy = require('rollup-plugin-copy');
const replace = require('@rollup/plugin-replace');
const pkg = require('./package.json');

module.exports = {
  input: 'server.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    'path', 'fs', 'util', 'events', 'stream', 'http', 'https', 'url', 'os', 'crypto', 'child_process'
  ],
  plugins: [
    replace({
      values: {
        "'../credentials.json'": "'./credentials.json'",
        '"../credentials.json"': '"./credentials.json"'
      },
      preventAssignment: true,
      delimiters: ['', '']
    }),
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    copy({
      targets: [
        { src: 'public', dest: 'dist' },
        { 
          src: 'package.json', 
          dest: 'dist',
          transform: (contents) => {
            const pkg = JSON.parse(contents.toString());
            pkg.scripts.start = 'node bundle.js';
            delete pkg.scripts.build;
            delete pkg.devDependencies;
            return JSON.stringify(pkg, null, 2);
          }
        },
        { src: 'package-lock.json', dest: 'dist' },
        { src: 'credentials.json', dest: 'dist' },
        { src: '.env', dest: 'dist' }
      ]
    })
  ]
};
