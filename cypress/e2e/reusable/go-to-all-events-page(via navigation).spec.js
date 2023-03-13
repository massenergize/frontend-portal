import fields from "../../fixtures/json/fields";

describe("Renders all events page by using navigation", function () {
  it("Visited home page ", () => cy.visit(fields.urls.homepage.withParams));

  it("Clicked on 'events' using nav menu", () => {
    cy.get("#menu-events-id").click();
  });
});
