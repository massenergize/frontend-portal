import { Auth } from "../../src/components/Pages/Auth/shared/firebase-helpers";
import "cypress-localstorage-commands";
import fields from "../fixtures/json/fields";
const removeCookieBanner = () => {
  // This is just a function to always close the banner, not for testing the cookie banner
  cy.get("#test-cookie-banner-okay").then(($banner) => {
    if ($banner) cy.wrap($banner).click();
  });
};
const clearAuthentication = () => {
  Auth.signOut();
};
Cypress.Commands.add(
  "loginWithDetails",
  function (email = "frimpong@kehillahglobal.com", password = "Pongo123") {
    cy.get("#email-password-link").click();
    cy.get("#login-email").type(email);
    cy.get("#login-password").type(password);
    cy.get("#sign-in-btn").click();
  }
);
Cypress.Commands.add(
  "authenticateWithoutUI",
  function (email = fields.emailToUse, password = fields.passwordToUse) {
    Auth.signOut();
    return Auth.signInWithEmailAndPassword(email, password);
  }
);
Cypress.Commands.add("deactivateTour", function () {
  cy.get("[aria-label='Skip Tour']").click();
});

Cypress.Commands.add("clearAuthentication", clearAuthentication);

Cypress.Commands.add("loadPage", function (pageURL, successComponentID) {
  cy.visit(pageURL);
  cy.get(`#${successComponentID}`);
});

Cypress.Commands.add("findComponentsOnPage", function (arrayOfIds = []) {
  arrayOfIds.forEach((id) => {
    cy.get("#" + id);
  });
});

Cypress.Commands.add("removeBanner", removeCookieBanner);
Cypress.Commands.add("cleanUp", function () {
  removeCookieBanner();
  clearAuthentication();
});
