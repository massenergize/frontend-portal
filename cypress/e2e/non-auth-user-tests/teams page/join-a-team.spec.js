const { visitSite } = require("../../../support/M.E/utils");

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

describe("Joining a team", function () {
  before(() => {
    visitSite("https://community.massenergize.dev/wayland/teams");
    cy.cleanUp();
    // cy.authenticateWithoutUI();
  });

  // it('Redirects an Unauthenticated user to login page', () => {
  //     cy.wait(6000)

  //     cy.get('.team-card').first().click()
  //     cy.wait(2000)
  //     cy.get('button[class="me-undefault-btn me-universal-btn me-btn-green  me-btn-phone-mode"]').first().click()
  //     cy.contains('Welcome! Sign in or Join').should('be.visible')

  // })

  it("Adds an authenticated user to a team", () => {
    cy.authenticateWithoutUI();

    cy.wait(6000);

    cy.get(".team-card").then(($el) => {
      cy.get(".team-card")
        .eq(getRandomInt($el.length - 1))
        .click();
      cy.wait(2000);

      cy.get(
        ".test-one-team-wrapper > .row > .col-md-9.col-12 > .row > center"
      ).then(($el) => {
        const itemCount = $el.children().length;

        cy.log(
          "==================== ITEM COUNT TEAMS ===============",
          itemCount
        );

        if (itemCount > 1) {
          cy.log(
            "==================== Removing a USER from a TEAM! ==============="
          );

          cy.wait(3000);

          cy.get(".boxed_wrapper > .team-ul > ul").then(($el) => {
            const teammates = $el.children().length;

            cy.log(
              "=======================  REMOVING INITIAL TEAM   ======================",
              teammates
            );

            cy.contains("Leave Team").click();
            cy.contains("Yes, Leave").click();

            cy.wait(3000);

            cy.get(".boxed_wrapper > .team-ul > ul").then(($element) => {
              cy.log(
                "=======================  REMOVING FINAL TEAM   ======================",
                $element.children().length
              );

              cy.wait(3000);

              expect($element.children().length + 1).to.equal(teammates - 1);
            });
          });
        } else {
          cy.log(
            "==================== Adding a USER to a TEAM! ==============="
          );

          cy.wait(3000);

          cy.get(".boxed_wrapper > .team-ul > ul").then(($el) => {
            const teammates = $el.children().length;

            cy.get("#test-join-team-btn").click();

            cy.contains("Join Now").click();

            cy.wait(2000);

            cy.contains("in this team").should("be.visible");

            cy.wait(3000);

            cy.log(
              "=======================  ADDING INITIAL TEAM   ======================",
              teammates
            );

            cy.get(".boxed_wrapper > .team-ul > ul").then(($element) => {
              cy.log(
                "=======================  ADDING FINAL TEAM   ======================",
                $element.children().length
              );

              cy.wait(3000);
              expect($element.children().length - 1).to.equal(teammates + 1);
            });
          });
        }
      });
    });
  });
});
