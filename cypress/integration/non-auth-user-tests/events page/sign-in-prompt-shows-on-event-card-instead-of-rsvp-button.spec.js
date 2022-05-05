import "./all-events-page-renders-properly(via-link).spec";

describe("Sign in prompt shows when user is not authenticated instead of RSVP button", function () {
  it("Sign in prompt showed up properly", () => {
    cy.get(".test-sign-in-to-rsvp").should("exist");
  });
});
