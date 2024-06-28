const { visitSite } = require("../../../../support/M.E/utils");


describe("", () => {

    before("", () => {
        visitSite()
        cy.cleanUp()
        cy.authenticateWithoutUI()
    })


    it("Signs a user out", () => {
        cy.get('.me-nav-profile-pic').click();
        cy.wait(1000)
        cy.get('button').contains('Sign Out').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('Sign Out');
        }).click()
        cy.wait(2000)
        cy.contains('Sign In').should('be.visible')
    })

})