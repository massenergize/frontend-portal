import fields from "../json/fields";

describe("Renders all events page by using navigation", function () {
  it("Visits all event ", cy.visit(fields.urls.events));
});
