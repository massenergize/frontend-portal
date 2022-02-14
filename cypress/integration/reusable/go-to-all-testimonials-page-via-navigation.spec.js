import fields from "../../fixtures/json/fields";
describe("Renders all testimonials page navigation menu", () => {
  before(function () {
    cy.visit(fields.urls.homepage.withParams);
  });
  it("Cleans Up", function () {
    cy.cleanUp();
  });
  it("Selects testimonials from nav menu", function () {
    cy.get("#menu-actions-id").click();
    cy.get(".test-me-nav-drop-item").eq(2).click();
  });
});
