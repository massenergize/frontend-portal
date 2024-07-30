const { visitSite } = require("../../../../support/M.E/utils");
const { pickAtRandom, get50RandomEmails } = require("../../../../../src/components/Utils");

const emails = ['test@skilledhq.com', 'test+1@skilledhq.com', 'test+2@skilledhq.com', 'test+3@skilledhq.com', 'test+4@skilledhq.com']
const names = [
    'David', 'Michael', 'James', 'John', 'Robert', 'William', 'Richard', 'Charles', 'Joseph', 'Thomas',
    'Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jennifer', 'Susan', 'Margaret', 'Dorothy', 'Lisa'
]

describe('Navbar navigations', () => {

    before(() => {
        visitSite()
        cy.cleanUp()
        cy.authenticateWithoutUI();
    });

    it('Creates a new event', () => {
        cy.wait(4000);
        cy.get('#menu-teams-id').click();
        cy.wait(4000);
        cy.get('.round-sticky-btn.touchable-opacity').first().click();
        cy.get('input[name="name"]').first().click();
        cy.get('input[name="name"]').first().type("A new Cypress Team");
        cy.get('input[name="tagline"]').first().click();
        cy.get('input[name="tagline"]').first().type("Capable");
        cy.get('#chip-text-box').click();
        cy.get('#chip-text-box').type(emails[0]);
        // cy.contains('Add').click();
        cy.get('.me-undefault-btn.me-universal-btn').first().click();
        cy.wait(500);
        // cy.get('#chip-text-box').click();
        // cy.get('#chip-text-box').type(emails[1]);
        // cy.contains('Add').click();


        cy.get('.phone-vanish > .round-sticky-btn-container > .round-sticky-btn > span').click();
        cy.get('#\\39 972798').click();
        cy.get('#\\32 3299206').click();
        cy.get('.me-dropdown > :nth-child(1)').click();
        cy.get('[style="display: flex; background: rgb(249, 249, 249); margin-top: 10px;"] > div > .touchable-opacity').click();
    })

})