import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.es',
  plugins: [
    babel(),
  ],
  targets: [
    {
      format: 'iife',
      moduleName: 'Butter',
      dest: 'dist/butter.js'
    },
    {
      format: 'cjs',
      dest: 'index.js'
    }
  ]
};
