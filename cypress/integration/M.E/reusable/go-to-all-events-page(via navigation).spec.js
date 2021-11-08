import fields from "../json/fields";

describe("Renders all events page by using navigation", function () {
  it("Visit home page ", () => cy.visit(fields.urls.homepage));

  it("Clicks on 'events' using nav menu", () => {
    cy.get("#events-nav-id").click();
  });
});
