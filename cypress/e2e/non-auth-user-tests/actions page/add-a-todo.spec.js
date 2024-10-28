const { visitSite } = require("../../../support/M.E/utils");


function getRandomInt(max) {
    return (Math.floor(Math.random() * (max))) + 1
}

describe('Adds an action to the todo list', () => {

    before(() => {
        visitSite('https://community.massenergize.dev/wayland/actions')
        cy.cleanUp()
        cy.authenticateWithoutUI();
    });



    it('Adds or removes an action from the todo list', () => {
        cy.wait(6000)

        cy.get('span[style="font-size: 55px; font-weight: 700; color: black;"]').eq(1).invoke('text').then((initialText) => {

            cy.log("=======================LOGGING======================", initialText)

            cy.get('#test-action-cards-wrapper').children().then(($elements) => {
                const itemCount = $elements.length;

                if (itemCount > 0) {
                    cy.get(`#test-action-cards-wrapper > :nth-child(${getRandomInt(itemCount)})`).contains('To Do').click()

                    cy.wait(1500)

                    cy.get('#CompletionDate > div > button').then(($element) => {
                        if ($element.text() === 'Completion Date') {
                            cy.contains('Completion Date').click()

                            cy.get('.dropdown-menu.show').children().should('have.length', 4)
                            cy.get('.dropdown-menu.show').children().first().click()

                            cy.get('.test-modal-submit').click({ force: true })
                        } else {
                            cy.contains('Uncheck this to remove').click()
                            cy.get('.test-modal-submit').click({ force: true })
                        }
                    });

                    cy.wait(6000)

                    cy.get('span[style="font-size: 55px; font-weight: 700; color: black;"]').eq(1).invoke('text').then((finalText) => {
                        expect(finalText).not.to.equal(initialText);
                    });
                } else {
                    cy.log("No Actions found");
                }
            });
        });




    })
})