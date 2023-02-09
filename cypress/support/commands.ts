declare namespace Cypress {
    interface Chainable<Subject> {
        addTask: typeof addTask;
        editTask: typeof editTask;
        deleteTask: typeof deleteTask;
        markTask: typeof markTask;
    }
}

const addTask = (task: string) => {
    cy.get('input[placeholder="Task"]').should('exist');
    cy.get('[data-testid="AddIcon"]').should('exist').parent().should('be.disabled');
    cy.get('input[placeholder="Task"]').type(task);
    cy.get('[data-testid="AddIcon"]').should('exist').parent().should('not.be.disabled').click();
    cy.get('input[placeholder="Task"]').clear();
}

const editTask = (originalTask: string, edited: string) => {
    cy.contains(originalTask).should('exist').parent().click();
    cy.get(`input[value="${originalTask}"]`).should('exist').clear().type(edited);
    cy.get('[data-testid="SaveIcon"]').should('exist').parent().should('not.be.disabled').click();
};

const deleteTask = (task: string) => {
    cy.contains(task).parent().parent().next().within(() => {
        cy.get('[data-testid="DeleteIcon"]').should('exist').parent()
            .should('not.be.disabled').click();
    });
};

const markTask = (task: string) => {
    cy.contains(task).parent().parent().prev().within(() => {
        cy.get('input[type="checkbox"]')
            .should('not.be.disabled').click();
    });
};

Cypress.Commands.add('addTask', addTask);
Cypress.Commands.add('editTask', editTask);
Cypress.Commands.add('deleteTask', deleteTask);
Cypress.Commands.add('markTask', markTask);
