import "./common.spec";
import "cypress-localstorage-commands";
const emailToUse = "frimpong@kehillahglobal.com";
const passwordToUse = "Pongo123";
const loginURL = "http://localhost:3000/wayland/signin";
const registrationURL = "http://localhost:3000/wayland/signup";
describe("Creating new ME User", function () {
  /**
   * Visit sign up page
   * Type email and password, password confirmation
   * Submit button should not be disabled
   * Submit form
   * Redirect to verify email page
   * Wait for 10 seconds to allow testor to manually activate email
   * redirect to login page
   * type in login details of just registered email, submit
   * Check if "complete profile page" is shown
   * Fill out complete profile page with details, check if redirected to profile page...
   */

  it("Visits registration page", function () {
    cy.restoreLocalStorage();
    cy.visit(registrationURL);
  });

  afterEach(function () {
    cy.saveLocalStorage();
  });

  beforeEach(function () {
    cy.restoreLocalStorage();
  });

  it("Renders registration page successfully", function () {
    cy.get(".register-form").first();
  });

  it("Types registration details", function () {
    cy.get("#email").type(emailToUse);
    cy.get("#password").type(passwordToUse);
    cy.get("#confirm-password").type(passwordToUse);
  });

  it("Create profile button is enabled, submits on click, and shows verify email box successfully!", function () {
    cy.get("#create-profile-btn")
      .should("not.be.disabled")
      .click()
      .then(function () {
        cy.get("#verify-email-area");
      });
  });

  // between this step  and the next, the testor has 50 seconds to access the activation link and activate
  // email before the next commands continue
  // it("Waiting for 50 seconds for you to activate the email before continuing...", function () {
  //   cy.wait(20000);
  // });
  it("Clicks on sign in anchor and visits sign in page successfully", () => {
    cy.get("#sign-in-anchor").click();
  });

  // it("Logs in with email that was just registered", function () {
  //   loginWithDetails(emailToUse, passwordToUse);
  // });
});
