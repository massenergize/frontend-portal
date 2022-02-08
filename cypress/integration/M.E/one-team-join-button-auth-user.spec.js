import fields from "./json/fields";
// import "./email-password-login-direct-url-link-to-page.spec";
import "./reusable/go-to-one-team-page-via-link.spec";

// Test to show that join in button does not show, but a prompt it shown when user is not signed in (one team page)

describe("User sees join button instead of sign in prompt", function () {
  before("Clean up and authenticate", () => {
    cy.cleanUp();
    cy.authenticateWithoutUI();
  });
  it("Shows join button instead of prompt", function () {
    cy.get("#test-join-team-btn").click();
    cy.get("#test-sign-in-to-join").should("not.exist");
    cy.get("#test-real-join-content").should("exist");
  });
});
