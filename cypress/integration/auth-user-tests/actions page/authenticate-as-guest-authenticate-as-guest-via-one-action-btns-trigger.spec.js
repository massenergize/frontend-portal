import fields from "../../../fixtures/json/fields";
import "cypress-localstorage-commands";
import "./../non-auth-user-tests/one-action-page-loads-well(via link).spec";
describe("Done and Todo buttons trigger guest authentication dialog on ONE action page", function () {
  it(
    "Trigered guest auth dialog with todo button",
    { retries: 2 },
    function () {
      cy.get("#test-todo-btn").click();
    }
  );
  it("Reversed Process", function () {
    cy.get("#test-guest-cancel-btn").click();
  });
  it(
    "Trigered guest auth dialog with done button",
    { retries: 2 },
    function () {
      cy.get("#test-done-btn").click();
    }
  );
  it("Reversed Process", function () {
    cy.get("#test-guest-cancel-btn").click();
  });
});
