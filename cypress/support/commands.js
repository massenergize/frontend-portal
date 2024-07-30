import { Auth } from "../../src/components/Pages/Auth/shared/firebase-helpers";
import "cypress-localstorage-commands";
import fields from "../fixtures/json/fields";
const PASSPORT_KEY = Cypress.env("PASSPORT_KEY");
const removeCookieBanner = () => {
  // This is just a function to always close the banner, not for testing the cookie banner
  cy.get("body").then(($body) => {
    if ($body.find("#test-cookie-banner-okay").length) {
      cy.get("#test-cookie-banner-okay").then(($banner) => {
        cy.wrap($banner).click();
      });
    }
  });
};
const clearAuthentication = () => {
  return Auth.signOut();
};

Cypress.Commands.add(
  "loginWithDetails",
  function (email = fields.emailToUse, password = fields.passwordToUse) {
    cy.wait(2000);
    cy.get("#test-nav-auth-trigger > b").click();
    cy.get(
      'button[style="background: black; --width: 60%; margin-bottom: 14px;"]'
    ).click();
    cy.wait(1000);
    cy.get("input[name='email']").first().type(email, { force: true });
    cy.get("input[name='password']").first().type(password, { force: true });
    cy.get(
      "button[style='background: var(--app-theme-green); margin-left: auto; flex: 1 1 0%;']"
    ).click({ force: true });
    cy.wait(2000);
    cy.get("img[alt='profile media']").should("exist");
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
    cy.get("#test-action-title");
  });
});

Cypress.Commands.add("removeBanner", removeCookieBanner);
Cypress.Commands.add("cleanUp", function () {
  removeCookieBanner();
  clearAuthentication();
});

// ............... TINYMCE ............

Cypress.Commands.add("getTinyMce", (tinyMceId) => {
  cy.window().then((win) => {
    return win.tinymce.editors[tinyMceId];
  });
});

Cypress.Commands.add(
  "setContent",
  { prevSubject: true },
  (subject, content) => {
    subject.setContent(content);
    return subject;
  }
);

Cypress.Commands.add("setTinyMceContent", (tinyMceId, content) => {
  cy.window().then((win) => {
    const editor = win.tinymce.editors[tinyMceId];
    editor.setContent(content);
  });
});

Cypress.Commands.add("getTinyMceContent", (tinyMceId, content) => {
  cy.window().then((win) => {
    const editor = win.tinymce.editors[tinyMceId];
    return editor.getContent();
  });
});
