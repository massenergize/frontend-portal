import fields from "../../fixtures/json/fields";

describe("Renders all teams page via a link", function () {
  it("Visits all teams page with a link", () => {
    cy.visit(fields.urls.teams.withParams);
    cy.cleanUp();
  });
});
