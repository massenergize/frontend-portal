import fields from "../../fixtures/json/fields";
describe("Renders all testimonials page navigation menu", () => {
  it("Renders homepage", () => cy.visit(fields.urls.homepage.withParams));
  it("Selects testimonials from nav menu", function () {
    cy.get("#menu-actions-id").click();
    cy.get(".test-me-nav-drop-item").eq(2).click();
  });
});
