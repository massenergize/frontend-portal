import fields from "../../fixtures/json/fields";

describe("Gets to all teams page via clicking on navigation", function () {
  it("Lands on homepage", function () {
    cy.visit(fields.urls.homepage.withParams);
    cy.cleanUp();
  });

  it("Clicks on 'teams' on navbar and directs to all teams page", function () {
    cy.get("#menu-teams-id").click();
    // cy.get(".test-me-nav-drop-item").eq(3).click();
  });
});
