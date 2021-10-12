import fields from "./json/fields";

describe("Individual actions page renders correctly through menu clicking", function () {
  //visit homepage
  //look for actions dropdown
  //click on the all actions page to go to all actions
  //click on the first action card you see
  //check if individual page shows well by checking for specific ids of items placed at vantage points
  before("Renders landing page", function () {
    cy.visit(fields.urls.landing);
  });

  it("Uses dropdown to go to locate actions page", function () {
    cy.get("#test-action-menu-id").as("action-drop-toggler").click();
    cy.get(".test-me-nav-drop-item").first().click();
  });

  it("Clicks the first action card", function () {
    cy.get(".sensitive-photo").first().click();
  });

  it("Renders action individudal page correctly", function () {
    cy.get("#test-title");
    cy.get("#desctab");
  });
});
