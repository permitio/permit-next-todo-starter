const { RuleTester } = require('eslint-plugin-tester');
const rule = require('./no-localhost-pdp');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
  },
});

ruleTester.run('no-localhost-in-pdp', rule, {
  valid: [
    {
      code: 'const permit = new Permit({ pdp: "https://example.com" });',
    },
    {
      code: 'const pdp = "http://localhost:7766";',
    },
    {
      code: 'const permit = new SomeOtherClass({ pdp: "http://localhost:7766" });',
    },
  ],
  invalid: [
    {
      code: 'const permit = new Permit({ pdp: "http://localhost:7766" });',
      errors: [
        {
          message: 'Do not use localhost servers in production for pdp configuration field when initializing Permit object',
          line: 1,
          column: 27,
        },
      ],
    },
    {
      code: 'const permit = new Permit({ pdp: "https://localhost:7766" });',
      errors: [
        {
          message: 'Do not use localhost servers in production for pdp configuration field when initializing Permit object',
          line: 1,
          column: 27,
        },
      ],
    },
  ],
});