const { visitSite } = require("../../../../support/M.E/utils");

describe("Mark an action as done", function () {
  before(() => {
    visitSite("https://community.massenergize.dev/wayland/actions");
    cy.cleanUp();
    cy.authenticateWithoutUI();
  });

  it("Checks Carbon Equivalencies", () => {
    cy.get(".me-nav-profile-pic").click();
    cy.get('.z-depth-1 > [href="/wayland/profile"]').click();
    cy.get("#eq-list-dropdown").click();
    cy.get(".me-dropdown.me-anime-show-up").children().should("have.length", 5);
  });
});
