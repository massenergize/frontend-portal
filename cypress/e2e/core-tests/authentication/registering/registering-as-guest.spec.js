const { pickAtRandom, get50RandomEmails } = require("../../../../../src/components/Utils");
const { visitSite } = require("../../../../support/M.E/utils");

const url = 'https://community.massenergize.dev/wayland'

const emails = get50RandomEmails()


describe('Navbar navigations', () => {
    before(() => {
        visitSite(url)
        cy.cleanUp()
        // cy.visit('http://localhost:3000/');
    });


    // it('Sign up with email and password!', () => {
    //     cy.get('#test-nav-auth-trigger > b').click();
    //     cy.get('[style="background: black; --width: 60%; margin-bottom: 14px;"]').click();
    //     cy.get('[style="background: var(--app-theme-orange); border-bottom-right-radius: 5px; margin: 0px; display: flex; flex-direction: row; align-items: center; width: 100%; justify-content: center;"]').click();
    //     cy.get('[placeholder="Enter your email address"]').clear();
    //     cy.get('[placeholder="Enter your email address"]').type(pickAtRandom(emails));
    //     cy.get('[placeholder="Enter your password here"]').clear();
    //     cy.get('[placeholder="Enter your password here"]').type('@12345678910!');
    //     cy.get('#default').clear();
    //     cy.get('#default').type('@12345678910!');
    //     cy.get('.auth-text-btn > .auth-btns').click();
    //     cy.get('.login-form-content > h1').should('contain', 'Check your email');

    // })

    it('Sign in as guest', () => {
        cy.get('#test-nav-auth-trigger').click();
        cy.get('.auth-link > p').click();
        cy.get('#test-guest-email').click();
        cy.get('#test-guest-email').clear();
        cy.get('#test-guest-email').type(pickAtRandom(emails));
        cy.get('.auth-text-btn > .auth-btns').click();
        cy.get('.me-nav-profile-pic').click();
        cy.get('[href="/wayland/profile"]').click();
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Profile');
        cy.contains('Guest').should('be.visible');
    })
})

