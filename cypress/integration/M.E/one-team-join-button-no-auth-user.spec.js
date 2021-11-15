import fields from "./json/fields";
import "./reusable/go-to-one-team-page-via-link.spec";

// Test to show that join in button does not show, but a prompt it shown when user is not signed in (one team page)

describe("User is prompted to sign in, instead of join button", function () {
  it("Shows signin prompt instead of join/leave content when not signed in", function () {
    cy.get("#test-join-team-btn").click();
    cy.get("#test-sign-in-to-join").should("exist");
    cy.get("#test-real-join-content").should("not.exist");
  });
});
