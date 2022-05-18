import fields from "../../../fixtures/json/fields";
import "cypress-localstorage-commands";

describe("Done and Todo buttons trigger guest authentication dialog on all actions page", function () {
  before(function () {
    cy.visit(fields.urls.actions.withParams);
    cy.cleanUp();
  });
  it(
    "Trigered guest auth dialog with todo button",
    { retries: 2 },
    function () {
      cy.get(".test-btn-for-todo").first().click();
    }
  );
  it("Reversed Process", function () {
    cy.get("#test-guest-cancel-btn").click();
  });
  it(
    "Trigered guest auth dialog with done button",
    { retries: 2 },
    function () {
      cy.get(".test-btn-for-done").first().click();
    }
  );
  it("Reversed Process", function () {
    cy.get("#test-guest-cancel-btn").click();
  });
});
