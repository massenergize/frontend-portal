import fields from "../../fixtures/json/fields";

describe("Cookies banner shows up on load", () => {
  it("Visited homepage", () => cy.visit(fields.urls.homepage.withParams));

  it("Saw cookies and privacy policy banner", () => {
    cy.get("#test-cookie-banner-okay").should("exist");
  });

  it("Accepted cookie successfully", () => {
    // cy.deactivateTour();
    cy.get("#test-cookie-banner-okay").click();
    cy.get("#test-cookie-banner").should("not.exist");
  });
});
