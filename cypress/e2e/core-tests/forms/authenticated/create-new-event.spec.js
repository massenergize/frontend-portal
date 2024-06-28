const { visitSite } = require("../../../../support/M.E/utils");
const { pickAtRandom, get50RandomEmails } = require("../../../../../src/components/Utils");


const url = 'https://community.massenergize.dev/wayland'

const emails = get50RandomEmails()
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
        cy.get(':nth-child(3) > .n-l-item').click();
        cy.get('.submitted-content-btn-wrapper > :nth-child(1) > :nth-child(1) > .phone-vanish > .round-sticky-btn-container > .round-sticky-btn').click();
        // cy.get('#\\36 953473').click();
        cy.get('#\\37 86259').clear();
        cy.get('#\\36 070228').type('A new ultimate event');
        // cy.get('#\\31 497076').click();
        cy.get('#\\32 896297').clear();
        cy.get('#\\33 89599').type('2024-12-24T00:33');
        // cy.get('#\\35 064468').click();
        // cy.get('#\\31 827102').clear();
        cy.get('#\\37 75444').type('2024-12-30T12:44');
        cy.get(':nth-child(2) > .me-check-square').click();
        // cy.get('#\\35 581921').click();
        // cy.get('#\\36 168713').clear();
        // cy.get('#\\35 080772').type('www.google.com');
        // cy.get('#\\31 5628333').click();
        cy.get('.me-dropdown > :nth-child(2)').click();
        cy.get('[style="background: green; color: white;"]').click();
        cy.get('.me-paragraph > .fa').click();
        cy.get('[style="background: green; color: white;"]').click();
    })

})

