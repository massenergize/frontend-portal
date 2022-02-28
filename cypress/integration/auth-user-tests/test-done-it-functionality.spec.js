import { IS_DONE } from "../../../src/components/Pages/ActionsPage/ActionStateConstants";
import "./go-to-all-actions-page-via-url(auth).spec";

describe("Marking action as 'DONE' works", function () {
  it("Clicks on 'done' on action card", function () {
    cy.wait(2000); // helps wait for authentication params to load in
    cy.get(".test-btn-for-done")
      .first()
      .scrollIntoView({ offset: { top: -200 } })
      .then(($btn) => {
        cy.wrap($btn).click();
      }); 
  });

  it("Opens up action modal", function () {
    cy.get(".test-action-modal").should("exist");
  });

  it("Selects one household, and chooses date of completion from dropdown", function () {
    // cy.get(".test-one-house").click();
    cy.get(".test-modal-dropdown").click();
    cy.get(".test-one-modal-drop-item").click();
    cy.get(".test-modal-submit").click();
    cy.wait(1000);
  });

  it("Action card shows properties that it has been done", function () {
    cy.get(".test-btn-for-done").then(($btn) => {
      expect($btn.attr("data-action-state", IS_DONE));
    });
  });
});
