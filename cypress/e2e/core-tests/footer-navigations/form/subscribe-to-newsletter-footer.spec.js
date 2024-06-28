const { visitSite } = require("../../../../support/M.E/utils");
const { pickAtRandom, get50RandomEmails } = require("../../../../../src/components/Utils");


const url = 'https://community.massenergize.dev/wayland'
const names = [
    'David', 'Michael', 'James', 'John', 'Robert', 'William', 'Richard', 'Charles', 'Joseph', 'Thomas',
    'Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jennifer', 'Susan', 'Margaret', 'Dorothy', 'Lisa'
]

const emails = get50RandomEmails()

describe('Navbar navigations', () => {

    before(() => {
        visitSite(url)
        cy.cleanUp()
        // cy.visit('http://localhost:3000/');
    });

    it("Subscribe to newsletter", () => {
        cy.get('.temp-f-container').scrollIntoView({ force: true })
        cy.get('[type="text"]').clear({ force: true });
        cy.get('[type="text"]').type(pickAtRandom(names));
        cy.get('[type="email"]').clear({ force: true });
        cy.get('[type="email"]').type(pickAtRandom(emails));
        cy.get('button[type="submit"]').click({ force: true });
        cy.get('.footer-widget > .cool-font').should('include.text', "Success!");
    })
})
