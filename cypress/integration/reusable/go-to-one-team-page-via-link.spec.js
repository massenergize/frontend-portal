import fields from "../../fixtures/json/fields";


describe("Renders individual team full-view page with a known team id", function () {
  it("Fetch teams from B.E and choose one to visit directly", function () {
    cy.request({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: fields.api.urls.fetchTeams,
      body: { subdomain: fields.subdomain },
    }).then((response) => {
      const data = response.body.data;
      if (!data || !data.length) cy.log("The backend did not return any teams");
      const firstOne = response.body.data[0];
      cy.visit(fields.urls.teams.raw + "/" + firstOne.id + fields.params);
    });
    cy.cleanUp();
  });
});
