import fields from "../json/fields";

describe("Renders all teams page via a link", function () {
  it("Visits all teams page with a link", () => cy.visit(fields.urls.teams));
});
