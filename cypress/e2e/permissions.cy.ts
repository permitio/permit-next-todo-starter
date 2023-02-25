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

describe('TODO e2e test', () => {
    it('Visit the app, check there are no tasks', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Choose User');
        cy.get('input[placeholder="Task"]').should('not.exist');
    });



    it('Choose a viewer, check there are tasks and User cannot add or edit new tasks', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Choose User').parent().click();
        cy.contains('Viewer').click();

        // Check there are tasks
        cy.contains('Learn Next.js').should('exist');
        
        // Try to fail in add task
        addTask('Learn Cypress');
        cy.contains('forbidden').should('exist');
        cy.get('[data-testid="CloseIcon"]').parent().click();
        cy.contains('Learn Cypress').should('not.exist');
        
        // Try to fail in edit task
        editTask('Learn Next.js', 'Learn Cypress');
        cy.contains('forbidden').should('exist');
        cy.get('[data-testid="CloseIcon"]').parent().click();
        cy.get('[data-testid="CancelIcon"]').parent().click();
        cy.contains('Learn Cypress').should('not.exist');

        // Try to fail in delete task
        deleteTask('Learn Next.js');
        cy.contains('forbidden').should('exist');
        cy.contains('Learn Next.js').should('exist');
        cy.get('[data-testid="CloseIcon"]').parent().click();

        // Try to mark task
        markTask('Learn Next.js');
        cy.contains('forbidden').should('not.exist');
    });

    it('Choose an editor, check there are tasks and User can only add tasks', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Choose User').parent().click();
        cy.contains('Editor').click();

        // Check there are tasks
        cy.contains('Learn Next.js').should('exist');
        
        // Try to fail in add task
        addTask('Learn Cypress');
        cy.contains('Learn Cypress').should('exist');
        
        // Try to edit task
        editTask('Learn Cypress', 'Do not Learn Cypress');
        cy.contains('forbidden').should('exist');
        cy.get('[data-testid="CloseIcon"]').parent().click();
        cy.get('[data-testid="CancelIcon"]').parent().click();

        // Try to fail in delete task
        deleteTask('Learn Cypress');
        cy.contains('forbidden').should('exist');
        cy.contains('Learn Next.js').should('exist');
        cy.get('[data-testid="CloseIcon"]').parent().click();

        // Try to mark task
        markTask('Learn Next.js');
        cy.contains('forbidden').should('exist');
    });

    it('Choose a moderator, check there are tasks and User can only edit them', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Choose User').parent().click();
        cy.contains('Moderator').click();

        // Check there are tasks
        cy.contains('Learn Next.js').should('exist');
        
        // Try to fail in add task
        addTask('Learn Cypress and Next.js');
        cy.contains('forbidden').should('exist');
        cy.get('[data-testid="CloseIcon"]').parent().click();
        cy.contains('Learn Cypress and Next.js').should('not.exist');
        
        // Try to edit task
        editTask('Learn Cypress', 'Learn Cypress and Next.js');
        cy.contains('Learn Cypress and Next.js').should('exist');
        
        // Try to fail in delete task
        deleteTask('Learn Cypress and Next.js');
        cy.contains('forbidden').should('exist');
        cy.contains('Learn Cypress').should('exist');
        cy.get('[data-testid="CloseIcon"]').parent().click();

        // Try to mark task
        markTask('Learn Next.js');
        cy.contains('forbidden').should('exist');
    });

    it('Choose an admin, check there are tasks and User can add, edit, mark, and delete them', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Choose User').parent().click();
        cy.contains('Admin').click();

        // Check there are tasks
        cy.contains('Learn Next.js').should('exist');
        
        // Try to in add task
        addTask('Learn Cypress and Next.js and React');
        cy.contains('Learn Cypress and Next.js and React').should('exist');
        
        // Try to edit task
        editTask('Learn Cypress and Next.js and React', 'Learn Cypress and Next.js and React and TypeScript');
        cy.contains('Learn Cypress and Next.js and React and TypeScript').should('exist');
        
        // Try to fail in delete task
        deleteTask('Learn Cypress and Next.js and React and TypeScript');
        cy.contains('Learn Cypress and Next.js and React and TypeScript').should('not.exist');
        deleteTask('Learn Cypress and Next.js');
        cy.contains('Learn Cypress and Next.js').should('not.exist');

        // Try to mark task
        markTask('Learn Next.js');
        cy.contains('forbidden').should('not.exist');
    });
});
