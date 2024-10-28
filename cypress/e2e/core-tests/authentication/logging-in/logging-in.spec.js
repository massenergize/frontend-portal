const { visitSite } = require("../../../../support/M.E/utils");

const url = 'https://community.massenergize.dev/wayland'

describe('Navbar navigations', () => {

    before(() => {
        visitSite(url)
        // cy.visit('http://localhost:3000/');
    });

    it('Sign in with email and password!', () => {
        cy.clearAuthentication()
        cy.loginWithDetails()
    })


    // it('Sign in with email only!', () => {
    //     cy.clearAuthentication()
    //     cy.get('#test-nav-auth-trigger > b').click();
    //     cy.get('[style="background: var(--app-theme-green); --width: 60%; margin-bottom: 14px;"]').click();
    //     cy.get('#login-email').clear();
    //     cy.get('#login-email').type('jeph.edu1@gmail.com', { delay: 100 });
    //     cy.get('.auth-text-btn > .auth-btns').click();
    //     cy.get('.me-anime-open-in').should('contain', 'MassEnergize sent you an email with a link, please click the link to continue. If its not in your inbox, check your Promotions and Spam folder. Not there? Use the link below to resend');

    // })
    // it('Sign in as Guest!', () => {
    //     cy.clearAuthentication()
    //     cy.get('#test-nav-auth-trigger > b').click();
    //     cy.get('[style="background: var(--app-theme-green); --width: 60%; margin-bottom: 14px;"]').click();
    //     cy.get('#login-email').clear();
    //     cy.get('#login-email').type('jeph.edu1@gmail.com', { delay: 100 });
    //     cy.get('.auth-text-btn > .auth-btns').click();
    //     cy.get('.me-anime-open-in').should('contain', 'MassEnergize sent you an email with a link, please click the link to continue. If its not in your inbox, check your Promotions and Spam folder. Not there? Use the link below to resend');

    // })





})

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