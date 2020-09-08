module.exports = {
  extends: 'kswedberg',
  globals: {
    BAMF: true,
  },
  rules: {
    'no-param-reassign': 'off',
    indent: [
      'warn',
      2,
      {
        MemberExpression: 0,
        // outerIIFEBody: 0,
        ignoreComments: true,
      },
    ],
  },
};
