import { Auth } from "../../src/components/Pages/Auth/shared/firebase-helpers";
import "cypress-localstorage-commands";

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
  function (email = "frimpong@kehillahglobal.com", password = "Pongo123") {
    Auth.signOut();
    return Auth.signInWithEmailAndPassword(email, password);
  }
);

Cypress.Commands.add("deactivateTour", function () {
  cy.get("[aria-label='Skip Tour']").click();
});

Cypress.Commands.add("clearAuthentication", () => Auth.signOut());

Cypress.Commands.add("loadPage", function (pageURL, successComponentID) {
  cy.visit(pageURL);
  cy.get(`#${successComponentID}`);
});

Cypress.Commands.add("findComponentsOnPage", function (arrayOfIds = []) {
  arrayOfIds.forEach((id) => {
    cy.get("#" + id);
  });
});

Cypress.Commands.add("cleanup", function () {
  // window.localStorage.setItem("seen_community_portal_tour", true);
  //test to be continued
});
