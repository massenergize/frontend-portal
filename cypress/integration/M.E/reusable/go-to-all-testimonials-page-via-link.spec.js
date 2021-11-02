import fields from "../json/fields";

describe("Renders all testimonials page via link", () => {
  it("Visit all testimonials page", () => cy.visit(fields.urls.testimonials));
});
