const { visitSite } = require("../../../../support/M.E/utils");
const { pickAtRandom } = require("../../../../../src/components/Utils");

const names = [
    'David', 'Michael', 'James', 'John', 'Robert', 'William', 'Richard', 'Charles', 'Joseph', 'Thomas',
    'Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jennifer', 'Susan', 'Margaret', 'Dorothy', 'Lisa'
]

var name = pickAtRandom(names)

const findNextItemAndAddToPrevious = () => {

    var item_index = names.indexOf(name)

    var next_name

    if (item_index === 0) {
        next_name = names[1]
    } else if (item_index === names.length) {
        next_name = names[names.length - 1]
    } else {
        next_name = names[item_index + 1]
    }

    return name + " " + next_name

}

describe("", () => {

    before("", () => {
        visitSite()
        cy.cleanUp()
        cy.authenticateWithoutUI()
    })


    it("Makes changes to a user profile", () => {
        cy.get('.me-nav-profile-pic').click();
        cy.wait(1000)
        cy.get('a').contains('Preferences').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('Preferences');
        }).click();
        cy.wait(1000)
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Settings');
        cy.contains("Edit my profile").click()
        cy.get('input[name="full_name"]').clear()
        cy.get('input[name="full_name"]').type(findNextItemAndAddToPrevious())
        cy.get('input[name="preferred_name"]').clear()
        cy.get('input[name="preferred_name"]').type(name)
        cy.contains("SUBMIT").click()
        cy.wait(1000)
        cy.get('.me-nav-profile-pic').click();
        cy.get('a').contains('My Profile').should('be.visible').then(($el) => {
            const text = $el.text();
            expect(text).to.equal('My Profile');

        }).click();
        cy.wait(1000)
        cy.get('.breadcumb-wrapper ul li').eq(1).should('contain', 'Profile');
        cy.contains(name).should('exist')app

    })
})