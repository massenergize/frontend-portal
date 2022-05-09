import { AUTH_TOKEN } from "../../../../src/components/Pages/Auth/shared/utils";
import fields from "../../../fixtures/json/fields";
const PASSPORT_KEY = Cypress.env("PASSPORT_KEY");
describe("Authenticates in the background", function () {
  before(function () {
    cy.authenticateWithoutUI().then((auth) => {
      cy.request({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        url: fields.api.urls.authenticate,
        body: { email: auth.user.email, passport_key: PASSPORT_KEY },
      }).then((response) => {
        const token = response.body.data; 
        cy.setCookie("token", token);
        localStorage.setItem(AUTH_TOKEN,token);
      });
    });
  });
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });

  it("Authentication complete", () => {});
});
