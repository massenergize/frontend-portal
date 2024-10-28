const { visitSite } = require("../../../../support/M.E/utils");


describe('User Profile Navigations', () => {
    before(() => {
        visitSite()
        cy.cleanUp()
        cy.authenticateWithoutUI()
    });


    it('Has the right nav menus', () => {
        cy.get('.me-nav-profile-pic').click();
        cy.get('a').contains('My Profile').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('My Profile');
        });
        cy.get('a').contains('Preferences').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('Preferences');
        });
        cy.get('button').contains('Sign Out').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('Sign Out');
        });
    })


    it("Visits the user's profile page", () => {
        cy.wait(1000)
        cy.get('a').contains('My Profile').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('My Profile');
        }).click();
        cy.wait(1000)
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Profile');
        cy.contains("Welcome")
    })


    it("Visits the user's preferences page", () => {
        cy.get('.me-nav-profile-pic').click();
        cy.wait(1000)
        cy.get('a').contains('Preferences').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('Preferences');
        }).click();
        cy.wait(1000)
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Settings');
        cy.contains("Edit my profile")
        cy.contains("Change communication preferences")
        cy.contains("Delete my account")
    })

})