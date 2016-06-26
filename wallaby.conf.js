'use strict';

module.exports = function (w) {
  return {
    files: [
      // Application code
      { pattern: 'lib/**/*.js', load: false },
      // Support files
      { pattern: 'package.json', load: false }
    ],
    tests: [
      'test/**/*.js'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'mocha'
  };
};