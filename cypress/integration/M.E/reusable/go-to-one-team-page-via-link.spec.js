import fields from "./../json/fields";

const teamId = 33;
describe("Renders individual team full-view page with a known team id", function () {
  it("Visit individual team with the link", function () {
    cy.visit(fields.urls.teams.raw + "/" + teamId + fields.params);
  });
});
