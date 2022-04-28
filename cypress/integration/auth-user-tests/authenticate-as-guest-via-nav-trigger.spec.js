import fields from "../../fixtures/json/fields";
import { testUserAuthenticationAsGuest } from "../../support/M.E/utils";
import "cypress-localstorage-commands";
describe("Use navigation 'sign in' button to trigger guest authentication", function () {
  before(function () {
    cy.visit(fields.urls.homepage.withParams);
    cy.cleanUp();
  });
  afterEach(function () {
    cy.saveLocalStorage();
  });

  beforeEach(function () {
    cy.restoreLocalStorage();
  });
  it("Clicked the 'sign in' button ", function () {
    cy.get("#test-nav-auth-trigger").click();
  });

  testUserAuthenticationAsGuest("massenergize.test.user@gmail.com");
});
