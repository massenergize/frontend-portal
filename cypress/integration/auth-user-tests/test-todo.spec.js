import {
  DEFAULT_STATE,
  IS_IN_TODO,
} from "../../../src/components/Pages/ActionsPage/ActionStateConstants";
import fields from "../../fixtures/json/fields";
import "./authenticate-user-with-token.spec";

describe("Adding action to TODO list", function () {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });

  it("Goes to all actions page directly via url", function () {
    cy.visit(fields.urls.actions.raw);
    cy.removeBanner();
  });

  it("Clicks on 'todo' on action card", function () {
    cy.wait(1000); // helps wait for authentication params to load in
    cy.get(".test-btn-for-todo")
      .first()
      .then(($btn) => {
        cy.wrap($btn).click();
      });
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

  it("Action card shows properties that it has been added to 'todo' ", function () {
    cy.get(".test-btn-for-todo").then(($btn) => {
      expect($btn.attr("data-action-state", IS_IN_TODO));
      expect($btn).to.have.css("background-color", "rgb(255, 118, 0)");
    });
  });
  it("Reverse process", function () {
    cy.get(".test-btn-for-todo")
      .first()
      .then(($btn) => {
        cy.wrap($btn).click();
      })
      .as("todo-button");
    cy.get(".test-one-house").click();
    cy.get(".test-modal-submit").click();
    cy.get("@todo-button").then(($btn) => {
      expect($btn.attr("data-action-state", DEFAULT_STATE));
      expect($btn).to.have.css("background-color", "rgb(255, 255, 255)");
    });
  });
});
