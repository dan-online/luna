module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            dynamicImport: true,
            decorators: true
          },
          target: 'es2021',
          transform: {
            decoratorMetadata: true
          }
        }
      }
    ]
  }
};
