import {
  DEFAULT_STATE,
  IS_DONE,
} from "../../../src/components/Pages/ActionsPage/ActionStateConstants";
import fields from "../../fixtures/json/fields";
import "./authenticate-user-with-token.spec";

/**
 * @TODO: Make DRY later
 */
describe("Marking action as 'DONE' works", function () {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });

  it("Goes to all actions page directly via url", function () {
    cy.visit(fields.urls.actions.raw);
    cy.removeBanner();
  });

  it("Clicks on 'done' on action card", { retries: 9 }, function () {
    cy.get(".test-action-card-item").then(($div) => {
      expect($div.attr("data-action-auth-state")).to.equal("authenticated");
    });
    cy.get(".test-btn-for-done")
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

  it("Action card shows properties that it has been done", function () {
    cy.get(".test-btn-for-done").then(($btn) => {
      expect($btn.attr("data-action-state", IS_DONE));
      expect($btn).to.have.css("background-color", "rgb(255, 118, 0)");
    });
  });
  it("Reverse process", function () {
    cy.get(".test-btn-for-done")
      .first()
      .then(($btn) => {
        cy.wrap($btn).click();
      })
      .as("done-button");
    cy.get(".test-one-house").click();
    cy.get(".test-modal-submit").click();
    cy.get("@done-button").then(($btn) => {
      expect($btn.attr("data-action-state", DEFAULT_STATE));
      expect($btn).to.have.css("background-color", "rgb(255, 255, 255)");
    });
  });
});
