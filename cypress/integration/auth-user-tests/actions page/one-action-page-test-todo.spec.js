import {
  DEFAULT_STATE,
  IS_IN_TODO,
} from "../../../../src/components/Pages/ActionsPage/ActionStateConstants";
import fields from "../../../fixtures/json/fields";
import "../reusable/authenticate-user-with-token.spec";

/**
 * @TODO: Make DRY later
 */
describe("Test 'TODO' functionality on one action page as authenticated user", function () {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });
  it("Request action list from api, and choose one to visit directly", function () {
    cy.request({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: fields.api.urls.fetchActions,
      body: { subdomain: fields.subdomain },
    }).then((response) => {
      const first = response.body.data[0];
      cy.visit(fields.urls.actions.raw + "/" + first.id);
    });
  });

  it("Click on TODO button", { retries: 9 }, function () {
    cy.get("#todo-btns").then(($div) => {
      expect($div.attr("data-page-state")).to.equal("authenticated");
    });
    cy.get("#test-todo-btn").click();
  });

  it("Opens up action modal", function () {
    cy.get(".test-action-modal").should("exist");
  });

  it("Selects one household, and chooses date of completion from dropdown", function () {
    cy.get(".test-modal-dropdown").click();
    cy.get(".test-one-modal-drop-item").click();
    cy.get(".test-modal-submit").click();
    cy.wait(1000);
  });

  it("Action card shows properties that its in todo list", function () {
    cy.get("#test-todo-btn").then(($btn) => {
      expect($btn.attr("data-action-state", IS_IN_TODO));
      expect($btn).to.have.css("background-color", "rgb(255, 118, 0)");
    });
  });
  it("Reverse process", function () {
    cy.get("#test-todo-btn")
      .first()
      .then(($btn) => {
        cy.wrap($btn).click();
      })
      .as("todo-btn");
    cy.get("#todo-btns").then(($div) => {
      expect($div.attr("data-action-state", DEFAULT_STATE));
      cy.get("@todo-btn").then(($btn) => {
        expect($btn).to.have.css("background-color", "rgb(255, 118, 0)");
      });
    });
  });
});
