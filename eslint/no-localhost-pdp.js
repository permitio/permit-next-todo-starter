module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow usage of localhost in pdp configuration field when initializing Permit object',
            category: 'Possible Errors',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        let permitInitialized = false;

        function fixPdpValue(pdpValue) {
          // replace 'localhost' with your domain name
          return pdpValue.replace(/localhost(:\d+)?/, 'example.com');
        }

        return {
          NewExpression(node) {
            if (node.callee.name === 'Permit') {
              permitInitialized = true;
            }
          },
          Property(node) {
            if (permitInitialized && node.key.name === 'pdp') {
              const pdpValue = node.value.value;
              if (pdpValue.includes('localhost')) {
                const fixedValue = fixPdpValue(pdpValue);
                context.report({
                  node,
                  message: 'Do not use localhost servers in production for pdp configuration field when initializing Permit object',
                  fix: fixer => fixer.replaceTextRange([node.value.start, node.value.end], JSON.stringify(fixedValue)),
                });
              }
            }
          },
        };
    },
};