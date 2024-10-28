const { visitSite } = require("../../../support/M.E/utils");

const url = 'https://community.massenergize.dev/wayland'

describe('Navbar navigations', () => {

    before(() => {
        visitSite(url)
        cy.cleanUp()
        // cy.visit('http://localhost:3000/');
    });

    it('Navigates to the home page', () => {
        cy.url().should('eq', url);
    })

    it('Take a tour', () => {
        cy.get('.dropdown > #menu-home-id').click();
        cy.get('#menu-take-the\\ tour-id').click();
        cy.get('[style="padding: 20px 10px;"]').click();
        cy.get('[data-test-id="button-primary"] > span').should('have.text', 'Show me!');
        cy.get('[style="align-items: center; display: flex; justify-content: flex-end; margin-top: 15px;"] > div > button > span').click();
    })

    it('Navigates to the actions page', () => {
        cy.get('.dropdown > #menu-actions-id').click();
        cy.get('#menu-all-actions-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'All Actions');
    })

    it('Navigates to the service providers page', () => {
        cy.get('.dropdown > #menu-actions-id').click();
        cy.get('#menu-service-providers-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Service Providers');

    })

    it('Navigates to the testimonials page', () => {
        cy.get('.dropdown > #menu-actions-id').click();
        cy.get('#menu-testimonials-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Testimonials');
    })

    it('Navigates to the teams page', () => {
        cy.get('#menu-teams-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Teams');
    })

    it('Navigates to the events page', () => {
        cy.get('#menu-events-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Events');
    })

    it('Navigates to the impact page', () => {
        cy.get('.dropdown > #menu-about-us-id').click();
        cy.get('#menu-impact-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Impact');
    })

    it('Navigates to the about us page', () => {
        cy.get('.dropdown > #menu-about-us-id').click();
        cy.get('#menu-our-story-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'About Us');
    })

    it('Navigates to the contact us page', () => {
        cy.get('.dropdown > #menu-about-us-id').click();
        cy.get('#menu-contact-us-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Contact Us');
    })


    it('Navigates to the donate page', () => {
        cy.get('.dropdown > #menu-about-us-id').click();
        cy.get('#menu-donate-id').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Donate');
    })

    it('Shows the login modal', () => {
        cy.get('#test-nav-auth-trigger > b').click();
        cy.get('.auth-options-root').should('contain', 'Welcome! Sign in or Join')
    })
})

