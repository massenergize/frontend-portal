// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// import fields from "./../integration/me-tests/json/fields";

Cypress.Commands.add(
  "loginWithDetails",
  function (email = "frimpong@kehillahglobal.com", password = "Pongo123") {
    cy.get("#login-email").type("pongofrimi@gmail.com");
    cy.get("#login-password").type("Pongo123");
    cy.get("#sign-in-btn").click();
  }
);

Cypress.Commands.add("loadPage", function (pageURL, successComponentID) {
  cy.visit(pageURL);
  cy.get(`#${successComponentID}`);
});
