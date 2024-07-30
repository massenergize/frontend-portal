const { visitSite } = require("../../support/M.E/utils");

const community_name = "Wayland";

const url = `https://community.massenergize.dev/${community_name}`;

describe("Verify Browser Tab Title", () => {
  before(() => {
    visitSite(url);
  });

  it("should have the correct title", () => {

    cy.title().should("eq", `${community_name} | Home`);
  });
});
