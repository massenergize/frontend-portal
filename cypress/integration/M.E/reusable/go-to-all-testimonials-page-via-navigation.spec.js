import fields from "../json/fields";

describe("Renders all testimonials page navigation menu", () => {
  it("Renders homepage", () => cy.visit(fields.urls.homepage));
  it("Selects testimonials from nav menu", function () {
    cy.get("#menu-testimonials-id").click();
    cy.get(".test-me-nav-drop-item").eq(2).click();
  });
});
