import fields from "./json/fields";

describe("Visits all actions page via navigation", function () {
  before(() => {
    cy.visit(fields.urls.homepage);
  });

  it("Clicks actions on navigation bar and chooses all actions page", function () {
    cy.get("#menu-actions-id").click();
    cy.get(".test-me-nav-drop-item").first().click();
  });
});
