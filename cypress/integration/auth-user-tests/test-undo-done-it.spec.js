import { DEFAULT_STATE } from "../../../src/components/Pages/ActionsPage/ActionStateConstants";
import "./test-done-it-functionality.spec";

describe("Undo action card that is already done", function () {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });

  it("Clicks on 'done' on action card", function () {
    cy.get(".test-btn-for-done")
      .first()
      .then(($btn) => {
        cy.wrap($btn).click();
      });
  });

  it("Unchecks selected household", function () {
    cy.get(".test-household-uncheck-div").click();
    cy.get(".test-modal-submit").click();
    cy.wait(1000);
  });

  it("Action card shows properties that it is not done", function () {
    cy.get(".test-btn-for-done").then(($btn) => {
      expect($btn.attr("data-action-state", DEFAULT_STATE));
      expect($btn).to.have.css("background-color", "white");
    });
  });

});
