const { visitSite } = require("../../../../support/M.E/utils");


describe("Changing communication preferences", () => {

    before(() => {
        visitSite()
        cy.cleanUp()
        cy.authenticateWithoutUI()
    })


    it("Changes communication preferences", () => {
        cy.get('.me-nav-profile-pic').click();
        cy.wait(1000)
        cy.get('a').contains('Preferences').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('Preferences');
        }).click();
        cy.wait(1000)
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Settings');
        cy.contains("Change communication preferences").click()
        // cy.get('.me-floating-check ').filter('.me-floating-check-active').as('activeElement').setLocalStorage("active", `element`)
        cy.get('.me-floating-check ').filter('.me-floating-check-active').as('activeElement').should('be.visible').then(($el) => {
            const activeText = $el.text()

            cy.get('.me-floating-check ').not('.me-floating-check-active').first().click()
            cy.contains('Save Settings').click()
            cy.get(".me-toast.success").should('be.visible')
            cy.get('.me-nav-profile-pic').click();
            cy.get('a').contains('Preferences').should('be.visible').then(($el) => {
                const text = $el.text();
                expect(text).to.equal('Preferences');
            }).click();
            cy.contains("Change communication preferences").click()

            cy.get('.me-floating-check ').filter('.me-floating-check-active').then(($el) => {
                expect($el.text()).to.equal(activeText)
            })

            // TODO check to make sure that the right texts are shown and compared
        });



    })

})