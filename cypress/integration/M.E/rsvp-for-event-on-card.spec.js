import { rsvpWithDropdown } from "../../support/M.E/utils";
import "./email-password-login-direct-url-link-to-page.spec";
import "./reusable/go-to-all-events-page(via link).spec";
var status;
describe("Using RSVP dropdown works well and reflects choices of what a user chooses", function () {
  rsvpWithDropdown();

  it("Waited 2 seconds for response", () => cy.wait(2000));

  it("Did not get any errors", () => {
    cy.get(".test-rsvp-error").should("not.exist");
  });

  it("Displayed appropriate RSVP status after selection", () => {
    cy.get(".test-rsvp-status-div").first().should("have.text", "Going"); // because we always choose 'going' when testing
  });
});
