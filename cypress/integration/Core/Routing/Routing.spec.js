/// <reference types="cypress" />

describe('Application routes as expected', () => {
    beforeEach(() => {
        cy.visit('/');
    })

    it('forces the Login page', () => {
        cy.visit('/search');
        cy.url().should('include', '/login') // => true
        
    })
}
);