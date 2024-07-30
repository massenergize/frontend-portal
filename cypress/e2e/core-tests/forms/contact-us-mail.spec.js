const { visitSite } = require("../../../support/M.E/utils");
const { pickAtRandom, get50RandomEmails } = require("../../../../src/components/Utils");


const url = 'https://community.massenergize.dev/wayland'

const emails = get50RandomEmails()
const names = [
    'David', 'Michael', 'James', 'John', 'Robert', 'William', 'Richard', 'Charles', 'Joseph', 'Thomas',
    'Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jennifer', 'Susan', 'Margaret', 'Dorothy', 'Lisa'
]

describe('Navbar navigations', () => {

    before(() => {
        visitSite(url)
        cy.cleanUp()
        // cy.visit('http://localhost:3000/');
    });

    it('Contact Admins via contact form', () => {
        cy.wait(2000)
        cy.get('.dropdown > #menu-about-us-id').click();
        cy.get('#menu-contact-us-id').click();
        cy.get("input[placeholder='Your Name *']").click();
        cy.get("input[placeholder='Your Name *']").clear();
        cy.get("input[placeholder='Your Name *']").type(pickAtRandom(names));
        cy.get("input[placeholder='Your Email *']").click();
        cy.get("input[placeholder='Your Email *']").clear();
        cy.get("input[placeholder='Your Email *']").type(pickAtRandom(emails));
        cy.get("input[placeholder='Subject *']").click();
        cy.get("input[placeholder='Subject *']").clear();
        cy.get("input[placeholder='Subject *']").type('This is a new cypress test');
        cy.get("textarea[placeholder='Message *']").click();
        cy.get("textarea[placeholder='Message *']").clear();
        cy.get("textarea[placeholder='Message *']").type('This is just for testing, kindly ignore');
        cy.get('.touchable-opacity.me-flat-btn').click();
        cy.get('.me-paragraph.page-text-phone-mode').should('include.text', 'Thanks for contacting the community administrator.');
    })

})
