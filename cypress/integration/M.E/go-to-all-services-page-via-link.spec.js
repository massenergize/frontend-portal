import { showThatServicesDisplayProperly } from "../../support/M.E/utils";
import fields from "./json/fields";

describe("Visits and shows all services page via link", () => {
  before("Visits services page via link", function () {
    cy.visit(fields.urls.services.withParams);
    cy.cleanUp();
  });

  it("Renders vendor cards correctly", function () {
    showThatServicesDisplayProperly();
  });
});
