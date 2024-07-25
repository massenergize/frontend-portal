const { visitSite } = require("../../../support/M.E/utils");

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

describe("Mark an action as done", function () {
  before(() => {
    visitSite("https://community.massenergize.dev/wayland/actions");
    cy.cleanUp();
    cy.authenticateWithoutUI();
  });

  it("Marks an action as done or undone", () => {
    cy.wait(6000);

    cy.get('span[style="font-size: 55px; font-weight: 700; color: black;"]')
      .eq(0)
      .invoke("text")
      .then((initialText) => {
        cy.log(
          "=======================LOGGING======================",
          initialText
        );

        cy.get("#test-action-cards-wrapper")
          .children()
          .then(($elements) => {
            const itemCount = $elements.length;

            if (itemCount > 0) {
              cy.get(
                `#test-action-cards-wrapper > :nth-child(${getRandomInt(
                  itemCount
                )})`
              )
                .contains("Done")
                .click({ force: true });

              cy.wait(1500);

              cy.get("#CompletionDate > div > button").then(($element) => {
                if ($element.text() === "Completion Date") {
                  cy.contains("Completion Date").click({ force: true });

                  cy.get(".dropdown-menu.show")
                    .children()
                    .should("have.length", 4);
                  cy.get(".dropdown-menu.show")
                    .children()
                    .first()
                    .click({ force: true });

                  cy.get(".test-modal-submit").click({ force: true });
                } else {
                  cy.contains("Uncheck this to remove").click({ force: true });
                  cy.get(".test-modal-submit").click({ force: true });
                }
              });

              cy.wait(6000);

              cy.get(
                'span[style="font-size: 55px; font-weight: 700; color: black;"]'
              )
                .eq(0)
                .invoke("text")
                .then((finalText) => {
                  expect(finalText).not.to.equal(initialText);
                });
            } else {
              cy.log("No Actions found");
            }
          });
      });
  });
});
