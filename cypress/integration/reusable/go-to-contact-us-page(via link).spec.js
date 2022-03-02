import fields from "../../fixtures/json/fields";

describe("Visits contact us page with url", () => {
  it("Visited contact us page", () =>
    cy.visit(fields.urls.contactus.withParams));
});
