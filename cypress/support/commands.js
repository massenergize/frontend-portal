import { Auth } from "../../src/components/Pages/Auth/shared/firebase-helpers";
import firebase from "./../../src/config/firebaseConfig";

Cypress.Commands.add(
  "loginWithDetails",
  function (email = "frimpong@kehillahglobal.com", password = "Pongo123") {
    cy.get("#email-password-link").click()
    cy.get("#login-email").type("pongofrimi@gmail.com");
    cy.get("#login-password").type("Pongo123");
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
