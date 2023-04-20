import fields from "../../../fixtures/json/fields";

describe("Visits all actions page via navigation", function () {
  before(() => {
    cy.visit(fields.urls.homepage.withParams);
    cy.cleanUp();
  });

  it(
    "Clicks actions on navigation bar and chooses all actions page",
    { retries: 2 },
    function () {
      cy.get("#menu-actions-id").click();
      cy.get(".test-me-nav-drop-item").first().click();
    }
  );
});
