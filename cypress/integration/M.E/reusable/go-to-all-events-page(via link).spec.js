import fields from "../json/fields";

describe("Renders all events page via link", function () {
  it("Visited all events page with link ", () => cy.visit(fields.urls.events));
});
