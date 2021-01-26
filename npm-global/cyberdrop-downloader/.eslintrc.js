module.exports = {
    root: true,
    extends: "airbnb-base",
    rules: {
        'no-console': 'off',
        'no-multi-spaces': 'off',
        'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
        'consistent-return': 'off',
        'prefer-destructuring': ['error', {
            "AssignmentExpression": {
              'array': false,
              'object': false
            }
          }],
    },
};