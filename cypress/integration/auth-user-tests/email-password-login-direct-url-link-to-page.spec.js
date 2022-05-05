
import fields from "../../fixtures/json/fields"
describe("Authenticates user and redirects to profile page", function () {
  it("Cleared any previous authentication", () => {
    cy.clearAuthentication();
  });
  it("Visited login page", function () {
    cy.visit(fields.urls.login);
  });

  it("Entered user credentials of an exisiting user account and logged in", function () {
    cy.loginWithDetails(fields.emailToUse, fields.passwordToUse);
  });

  it("Redirected to profile page", function () {
    cy.get("#profile-page-component").should("exist");
  });
});
