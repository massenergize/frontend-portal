import fields from "../../fixtures/json/fields";
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
        cy.setCookie("token", response.body.data);
      });
    });
  });
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });

  it("Authentication complete", () => {});
});
