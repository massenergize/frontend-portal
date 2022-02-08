import fields from "./json/fields";
import { ONE_ACTION_COMPONENT_CHECKLIST } from "./reusable/values";

/**
 * Proc:
 * Visit the one action page with a known action id, in URL
 * Now check for  some ids(page title, todo buttons, and description tab components) that show that the page loaded properly
 * If cypress is able to grab each component with their ids, test passed!
 */

const knownActionId = 7;
describe("One action page loads correctly", function () {
  before(function () {
    cy.visit(fields.urls.actions.raw + "/" + knownActionId + fields.params);
    cy.cleanUp();
  });

  it("Finds all important display components", function () {
    cy.findComponentsOnPage(ONE_ACTION_COMPONENT_CHECKLIST);
  });
});
