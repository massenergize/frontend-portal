import fields from "../../fixtures/json/fields";

describe("Visits contact us page via navigation menu", () => {
  it("Visited homepage", () => cy.visit(fields.urls.homepage.withParams));

  it("Clicked on 'contact us' from menu and redirected there", () => {
    cy.get("#about-us-nav-id").click();
    cy.get(".test-me-nav-drop-item").eq(2).click();
  });
});
