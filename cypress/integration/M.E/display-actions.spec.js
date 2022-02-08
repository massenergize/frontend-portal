import fields from "./json/fields";

/**
 * Proc:
 * Render actions page and check to see if action cards are visible.
 * Also check if the number of action items that came from the backend is the same as
 * the number of action box cards visible in the DOM
 */
describe("Action cards display appropriately", function () {
  before(function () {
    cy.visit(fields.urls.actions.withParams);
    cy.cleanUp()
  });

  it("All cards rendered, and number of cards match number of actions", function () {
    cy.get("#test-action-cards-wrapper").then(function ($w) {
      const recordedNumberOfActions = $w.attr(
        "data-number-of-actions-for-test"
      );
      cy.get(".test-action-card-item").should(
        "have.lengthOf",
        recordedNumberOfActions
      );
    });
  });
});
