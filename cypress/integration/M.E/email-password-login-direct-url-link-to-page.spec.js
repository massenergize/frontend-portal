import fields from "./json/fields";

describe("Authenticates user and redirects to profile page", function () {
  it("Visited login page", function () {
    cy.visit(fields.urls.login);
  });

  it("Entered user credentials of an exisiting user account and logged in", function () {
    cy.loginWithDetails();
  });

  it("Redirected to profile page", function () {
    cy.get("#profile-page-component").should("exist");
  });
});
