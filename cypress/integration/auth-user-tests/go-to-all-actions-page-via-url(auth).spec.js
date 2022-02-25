import fields from "../../fixtures/json/fields"

describe("Signs in and enters all actions page", function() { 
    before("Authenticates a known user", function() { 
        cy.authenticateWithoutUI()
    })
    it("Goes to all actions page directly via url", function() { 
        cy.visit(fields.urls.actions.raw); 
        cy.removeBanner();
    })
})