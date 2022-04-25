import fields from "./../../fixtures/json/fields";
import { ONE_ACTION_COMPONENT_CHECKLIST } from "./../reusable/values";

describe("One action page loads correctly", function () {
  before(function () {
    cy.request({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: fields.api.urls.fetchActions,
      body: { subdomain: fields.subdomain },
    }).then((response) => {
      const data = response.body.data;
      if (!data || !data.length)
        cy.log("The backend did not return any actions");
      const firstOne = response.body.data[0];
      cy.visit(fields.urls.actions.raw + "/" + firstOne.id + fields.params);
    });
    cy.cleanUp();
  });

  it("Finds all important display components", function () {
    cy.findComponentsOnPage(ONE_ACTION_COMPONENT_CHECKLIST);
  });
});
