const { visitSite } = require("../../../support/M.E/utils");

const url = 'https://community.massenergize.dev/wayland'

describe('Navbar navigations', () => {

    before(() => {
        visitSite(url)
        cy.cleanUp()
        // cy.visit('http://localhost:3000/');


        // All created tests here work for unauth users
    });

    it('Prompts to login(add an action)', () => {
        cy.clearAuthentication()
        cy.get('.dropdown > #menu-actions-id').click();
        cy.get('#menu-all-actions-id').click();
        cy.get('.submitted-content-btn-wrapper > :nth-child(1) > :nth-child(1) > .phone-vanish > .round-sticky-btn-container > .round-sticky-btn > span').click();
        cy.get('.auth-options-root').should('include.text', 'Welcome! Sign in or Join');
        cy.get('.auth-title-bar > .touchable-opacity > .fa').click();

    })

    it('Prompts to login(add a testimonial)', () => {
        cy.clearAuthentication()
        cy.get('.dropdown > #menu-actions-id').click();
        cy.get('#menu-testimonials-id').click({ force: true });
        cy.get('.submitted-content-btn-wrapper > :nth-child(1) > :nth-child(1) > .phone-vanish > .round-sticky-btn-container > .round-sticky-btn').click();
        cy.get('.auth-options-root').should('include.text', 'Welcome! Sign in or Join');
        cy.get('.auth-title-bar > .touchable-opacity > .fa').click();
    })

    it('Prompts to login(add an event)', () => {
        cy.clearAuthentication()
        cy.get('#menu-events-id > .cool-font').click();
        cy.get('.submitted-content-btn-wrapper > :nth-child(1) > :nth-child(1) > .phone-vanish > .round-sticky-btn-container > .round-sticky-btn').click();
        cy.get('.auth-options-root').should('include.text', 'Welcome! Sign in or Join');
        cy.get('.auth-title-bar > .touchable-opacity > .fa').click();
    })
})