import {
  DEFAULT_STATE,
  IS_DONE,
} from "../../../../src/components/Pages/ActionsPage/ActionStateConstants";
import fields from "../../../fixtures/json/fields";
import "cypress-localstorage-commands";
import { AUTH_TOKEN } from "../../../../src/components/Pages/Auth/shared/utils";
// import "../reusable/authenticate-user-with-token.spec";
const PASSPORT_KEY = Cypress.env("PASSPORT_KEY");

/**
 * @TODO: Make DRY later
 */
describe("Test 'DONE' functionality on one action page as authenticated user", function () {
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

  afterEach(function () {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    Cypress.Cookies.preserveOnce("token");
  });

  it("Request action list from api, and choose one to visit directly", function () {
    cy.request({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: fields.api.urls.fetchActions,
      body: { subdomain: fields.subdomain },
    }).then((response) => {
      const first = response.body.data[0];
      cy.visit(fields.urls.actions.raw + "/" + first.id);
    });
  });

  it("Click on DONE button", { retries: 7 }, function () {
    // cy.wait(2000);
    cy.get("#todo-btns").then(($div) => {
      expect($div.attr("data-page-state")).to.equal("authenticated");
    });
    cy.get("#test-done-btn").click();
  });

  it("Opens up action modal", function () {
    cy.get(".test-action-modal").should("exist");
  });

  it("Selects one household, and chooses date of completion from dropdown", function () {
    cy.get(".test-modal-dropdown").click();
    cy.get(".test-one-modal-drop-item").click();
    cy.get(".test-modal-submit").click();
    cy.wait(1000);
  });

  it("Action card shows properties that it has been done", function () {
    cy.get("#test-done-btn").then(($btn) => {
      expect($btn.attr("data-action-state", IS_DONE));
      expect($btn).to.have.css("background-color", "rgb(255, 118, 0)");
    });
  });
  it("Reverse process", { retries: 2 }, function () {
    cy.get("#test-done-btn")
      .first()
      .then(($btn) => {
        cy.wrap($btn).click({ force: true });
      });
    cy.get("#todo-btns").then(($div) => {
      expect($div.attr("data-action-state", DEFAULT_STATE));
      cy.get("#test-done-btn").then(($btn) => {
        expect($btn).to.have.css("background-color", "rgb(255, 255, 255)");
      });
    });
  });
});
