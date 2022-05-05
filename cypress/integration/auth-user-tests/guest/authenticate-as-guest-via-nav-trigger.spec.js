import fields from "../../../fixtures/json/fields";
import {
  testUserAuthenticationAsGuest,
  typeInTextBox,
} from "../../../support/M.E/utils";
import "cypress-localstorage-commands";
describe("Use navigation 'sign in' button to trigger guest authentication", function () {
  before(function () {
    cy.visit(fields.urls.homepage.withParams);
    // cy.cleanUp();
  });
 

  beforeEach(function () {
    Cypress.Cookies.preserveOnce("token");
    cy.restoreLocalStorage();
  });

  afterEach(function () {
    cy.saveLocalStorage();
  });
  it("Clicked the 'sign in' button ", function () {
    cy.get("#test-nav-auth-trigger").click();
  });

  it("Clicked button to proceed as guest", function () {
    cy.get("#test-proceed-as-guest").click();
  });

  it("Typed guest email to to be used", function () {
    typeInTextBox("#test-guest-email", "massenergize.test.user@gmail.com", 50);
  });

  it("Submitted guest email for authentication", function () {
    cy.get("#test-continue-button").click();
    cy.saveLocalStorage(); //needed because the code reloads the page. So localstorage needs to be saved within the test before cypress clears it
  });

  it(
    "User is authenticated 'sign in' button is showing user initials or image",
    { retries: 2 },
    function () {
      cy.get("#test-auth-user-dropdown");
    }
  );

  it("Reversed entire process", { retries: 2 }, function () {
    cy.get("#test-auth-user-dropdown").click();
    cy.get("#test-dropdown-signout").click();
  });
  // testUserAuthenticationAsGuest("massenergize.test.user@gmail.com"); // PONGO: Remove this function from util, when you are sure of ur theory.
});
