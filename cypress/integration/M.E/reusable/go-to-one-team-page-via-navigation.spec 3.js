import "./go-to-all-teams-page-via-navigation.spec";

describe("Renders on team page by choosing a team from team list", function () {
  it("Clicks on first team card", function () {
    cy.get(".test-team-clickable-card").first().click();
  });
});
