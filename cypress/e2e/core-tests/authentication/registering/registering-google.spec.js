const { pickAtRandom, get50RandomEmails } = require("../../../../../src/components/Utils");
const { visitSite } = require("../../../../support/M.E/utils");

const url = 'https://community.massenergize.dev/wayland'

const emails = 'test@skilledhq.com'



describe('Navbar navigations', () => {
    before(() => {
        visitSite(url)
        cy.cleanUp()
        cy.clearAuthentication()
        // cy.visit('http://localhost:3000/');
    });


    it('Sign in using google auth', () => {

        // Future versions of cypress seeks to address the issue of multiple windows or tabs opening at the same time, so till then we have to wait to fully automate this feature since it opens up a whole new page. 
        // One solution would be to change the button to a <a href="..." /> so that I can eliminate the target attribute from "_blank" and make it happen on the same page. With that we can move past the dual window thing..... similar thing has been done in the file "/core-tests/footer-navigations/footer-navigations.spec.js" on the test "Navigate to report a bug page" where the target attribute was invoked.

        cy.clearAuthentication()
        cy.get('#test-nav-auth-trigger').click();
        cy.get('[style="background: rgb(215, 46, 46); flex: 1 1 0%; margin-bottom: 14px;"]').click();

        // cy.get(':nth-child(1) > input').clear();
        // cy.get(':nth-child(1) > input').type('Collins');
        // cy.get('.c-f-inner-wrapper > :nth-child(2) > input').clear();
        // cy.get('.c-f-inner-wrapper > :nth-child(2) > input').type('Boston');
        // cy.get(':nth-child(6) > input').clear();
        // cy.get(':nth-child(6) > input').type('00233');
        // cy.get('#\\33 1120108').click();

        
        cy.wait(4000) // Assuming that you have already logged in with google before, so it will just authenticated and redirect back to the page, the time is just to wait for the authentication and redirection to the page

        cy.get('.me-nav-profile-pic').click();
        cy.get('[href="/wayland/profile"]').click();
    })
})

