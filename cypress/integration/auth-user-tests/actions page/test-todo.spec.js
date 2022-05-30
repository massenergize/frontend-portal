import {
  DEFAULT_STATE,
  IS_IN_TODO,
} from "../../../../src/components/Pages/ActionsPage/ActionStateConstants";
import { AUTH_TOKEN } from "../../../../src/components/Pages/Auth/shared/utils";
import fields from "../../../fixtures/json/fields";

const PASSPORT_KEY = Cypress.env("PASSPORT_KEY");
describe("Adding action to TODO list", function () {
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
        cy.setLocalStorage(AUTH_TOKEN, token);
      });
    });
  });
  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
  });

  it("Goes to all actions page directly via url", function () {
    cy.visit(fields.urls.actions.raw);
    cy.removeBanner();
  });

  it("Clicks on 'todo' on action card", function () {
    cy.waitUntil(() => cy.get("#test-auth-user-dropdown")).then(() => {
      cy.get(".test-btn-for-todo").first().click({ force: true });
    });
  });

  it("Opens up action modal", function () {
    cy.get(".test-action-modal").should("exist");
  });

  it("Selects one household, and chooses date of completion from dropdown", function () {
    cy.get(".test-modal-dropdown").click();
    cy.get(".test-one-modal-drop-item").click();
    cy.get(".test-modal-submit").click();
  });

  it("Action card shows properties that it has been added to 'todo' ", function () {
    cy.waitUntil(
      () =>
        cy
          .get(".test-btn-for-todo")
          .invoke("attr", "data-action-state")
          .then((state) => state === IS_IN_TODO) &&
        cy
          .get(".test-btn-for-todo")
          .invoke("css", "background-color")
          .then((color) => color === "rgb(255, 118, 0)")
    );
  });
  it("Reversed process", function () {
    cy.get(".test-btn-for-todo")
      .first()
      .then(($btn) => {
        cy.wrap($btn).click();
      });
    cy.get(".test-one-house").click();
    cy.get(".test-modal-submit").click();
  });
  it("Checked for default state", function () {
    cy.waitUntil(() =>
      cy
        .get(".test-btn-for-todo")
        .first()
        .invoke("css", "background-color")
        .then((color) => color === "rgb(255, 255, 255)")
    );
  });
});
