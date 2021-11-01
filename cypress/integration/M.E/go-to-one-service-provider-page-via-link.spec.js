import { checkForRelevantComponentsOnOneServicePage } from "../../support/M.E/utils";
import fields from "./json/fields";

const idOfKnownVendor = 3;
describe("Renders one service provider correctly", function () {
  before("Visits one service proder page with a known id", () => {
    cy.visit(fields.urls.services + "/" + idOfKnownVendor);
  });

  it("Page shows all relevant display elements", function () {
    checkForRelevantComponentsOnOneServicePage();
  });
});
