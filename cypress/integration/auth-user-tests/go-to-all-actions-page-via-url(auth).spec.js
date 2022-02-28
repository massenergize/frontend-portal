import fields from "../../fixtures/json/fields";
import { fromJsonToForm } from "../../support/M.E/utils";

describe("Signs in and enters all actions page", function () {
  afterEach(function () {
    Cypress.Cookies.preserveOnce();
    Cypress.Cookies.debug(true);
    cy.getCookies().then((cookies) => {
      console.log("And then I am loggin all the cookies banan", cookies);
      console.log(
        "I am the available cookies ====> ",
        cookies.map((c) => c?.name)
      );
    });
  });

  it("Authenticates a known user", function () {
    cy.authenticateWithoutUI().then((auth) => {
      cy.request({
        method: "POST",
        url: "http://massenergize.test:8000/api/auth.login",
        body: fromJsonToForm({
          idToken: auth.user._lat,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        console.log("I am also the me response", response.json());
      });
    });

    // cy.visit(fields.urls.login);
    // cy.clearAuthentication();
    // cy.loginWithDetails(fields.emailToUse, fields.passwordToUse);
  });

  // it("Goes to all actions page directly via url", function () {
  //   cy.wait(1000); // We have to wait for 1 second  for all auth process to be complete and to be redirected to the profile page, then we can move on to the action page
  //   cy.visit(fields.urls.actions.raw);
  //   cy.removeBanner();
  // });
});
