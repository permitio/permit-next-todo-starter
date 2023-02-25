declare namespace Cypress {
    interface Chainable<Subject> {
        verifyForbiddenError: typeof verifyForbiddenError;
    }
}

// This command verify that the error message is displayed
// Run it from everywhere with cy.verifyForbiddenError()
const verifyForbiddenError = () => {
    cy.contains('forbidden').should('exist');
    cy.get('[data-testid="CloseIcon"]').parent().click();
}

Cypress.Commands.add('verifyForbiddenError', verifyForbiddenError);
