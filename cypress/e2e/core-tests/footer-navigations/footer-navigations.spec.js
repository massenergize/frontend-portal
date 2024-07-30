const { visitSite } = require("../../../support/M.E/utils");

const url = 'https://community.massenergize.dev/wayland'

describe('Navbar navigations', () => {

    before(() => {
        visitSite(url)
        cy.cleanUp()
        // cy.visit('http://localhost:3000/');
    });


    it('Navigates to contact page', () => {
        cy.get('.main-footer').scrollIntoView()
        cy.get('.energize-link').click({ force: true });
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Contact Us');

        /* ==== End Cypress Studio ==== */
    })

    it('Navigates to privacy policy page', () => {
        cy.get('.main-footer').scrollIntoView()
        cy.get('.list > :nth-child(1) > .cool-font').click({ force: true });
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Policies');
        cy.get('.card-header').should('contain', 'Privacy Policy');
    })

    it('Navigates to terms of service page', () => {
        cy.get('.main-footer').scrollIntoView()
        cy.get('.list > :nth-child(2) > .cool-font').click({ force: true });
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Policies');
        cy.get('.card-header').should('contain', 'Terms of Service');
    })

    it('Navigate to all massEnergize communiites page', () => {
        cy.get('.main-footer').scrollIntoView()
        cy.get('.list > :nth-child(4) > a').invoke('removeAttr', 'target').click()
        cy.get(".select-envelope")
        cy.get(".community-name").should("exist");
        cy.go('back');
    })

    it('Navigate to report a bug page', () => {
        cy.go('back');
        cy.authenticateWithoutUI()
        cy.get('.main-footer').scrollIntoView()
        cy.get('.list > :nth-child(3) > a').invoke('removeAttr', 'target').click()
        cy.get(".F9yp7e.ikZYwf.LgNcQe").should("exist", "MassEnergize - report issue or request");
    })
})

// F9yp7e ikZYwf LgNcQe
// MassEnergize - report issue or request
// .F9yp7e.ikZYwf.LgNcQe


// cy.get('.main-footer').scrollIntoView()
// cy.get('.list > :nth-child(3) > a').invoke('removeAttr', 'target').click()
// // cy.get(".select-envelope")
// cy.get("MassEnergize - report issue or request").should("exist");