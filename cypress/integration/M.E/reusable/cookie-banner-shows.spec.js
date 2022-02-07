import fields from "../json/fields";

describe("Cookies banner shows up on load", () => {
  it("Visited homepage", () => cy.visit(fields.urls.homepage));

  it("Saw cookies and privacy policy banner", () => {
    cy.get("#test-cookie-banner").should("exist");
  });

  it("Accepted cookie successfully", () => {
    cy.deactivateTour();
    cy.get("#test-cookie-banner-okay").click();
    cy.get("#test-cookie-banner").should("not.exist");
  });
});
