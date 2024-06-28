const { visitSite } = require("../../../support/M.E/utils");

const url = 'https://community.massenergize.dev/wayland'

describe('Navbar navigations', () => {

    before(() => {
        visitSite(url)
        cy.cleanUp()
        // cy.visit('http://localhost:3000/');
    });


    it('Navigates to events page, and views in calendar mode', () => {
        cy.get('#menu-events-id > .cool-font').click();
        cy.get('#test-event-view-toggler-calendar').click();
        cy.get('.rbc-month-header').should('be.visible');
    })


})