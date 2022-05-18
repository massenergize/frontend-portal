
import fields from "../../../fixtures/json/fields"
/**
 * Proc:
 * Look for a particular class that all navigation links have.
 * If at least one of them exists, and is in view, it means main nav links are displaying properly.
 * For nav links with drop items, click them and check to see if child items
 * become visible in the DOM
 * If that happens, it means the dropdown children show up nicely
 */
describe("Navbar menu and submenu items  load and work well", function () {
  before(() => {
    cy.visit(fields.urls.homepage.withParams);
    cy.cleanUp();
  });

  it("Renders main navlink menu items", function () {
    cy.get(".test-me-nav-menu-item").first().should("be.visible");
  });
  it("Renders navlinks with dropdowns", function () {
    cy.get(".test-me-nav-menu-item-with-drop")
      .click({ multiple: true })
      .then(function () {
        cy.get(".test-me-nav-drop-item");
      });
  });
});
