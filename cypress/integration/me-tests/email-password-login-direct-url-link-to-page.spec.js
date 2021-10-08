
import fields from './json/fields'

describe("Renders login page", function () {
  it("Visits login page", function () {
    cy.visit(fields.urls.login);
  });

  it("Enters user credentials of an exisiting user account", function () {
    cy.loginWithDetails();
  });

  it("Redirects to, and renders profile page", function () {
    cy.get("#profile-page-component");
  });
});
