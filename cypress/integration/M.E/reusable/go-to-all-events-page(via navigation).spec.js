import fields from "../json/fields";

describe("Renders all events page by using navigation", function () {
  it("Visited home page ", () => cy.visit(fields.urls.homepage));

  it("Clicked on 'events' using nav menu", () => {
    cy.get("#menu-events-id").click();
  });
});
