import { checkForRelevantComponentsOnOneServicePage } from "../../support/M.E/utils";

import fields from "./../../fixtures/json/fields"

const idOfKnownVendor = 3;
describe("Renders one service provider correctly", function () {
  before("Visits one service proder page with a known id", () => {
    cy.request({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: fields.api.urls.fetchVendors,
      body: { subdomain: fields.subdomain },
    }).then((response) => {
      const data = response.body.data;
      if (!data || !data.length) cy.log("The backend did not return any teams");
      const firstOne = response.body.data[0];
      cy.visit(fields.urls.services.raw + "/" + firstOne.id + fields.params);
    });
    cy.cleanUp();
  });

  it("Page shows all relevant display elements", function () {
    checkForRelevantComponentsOnOneServicePage();
  });
});
