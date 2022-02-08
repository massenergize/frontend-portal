import { showThatServicesDisplayProperly } from "../../support/M.E/utils";
import fields from "./json/fields";

describe("Visit all services page via navigation", function () {
  before("Renders services page", () => {
    cy.visit(fields.urls.homepage.withParams);
    cy.cleanUp();
  });

  it("Selects services page from navigation menu dropdown", function () {
    cy.get("#menu-actions-id").click();
    cy.get(".test-me-nav-drop-item").eq(1).click();
  });

  it("Renders all vendor cards correctly", function () {
    showThatServicesDisplayProperly();
  });
});
