import fields from "./json/fields";
import "./go-to-all-actions-page-via-navigation.spec";
import { ONE_ACTION_COMPONENT_CHECKLIST } from "./reusable/values";

/**
 * Proc:
 * Land on home page
 * Use navigation to visit all actions page
 * choose an action from the list to navigate to one action page
 * should be able to load all components in the check list
 */

describe("One action page loads correctly when visited via click-navigations", function () {
  it("Clicks first action", function () {
    cy.get(".test-action-info-btn").first().click();
  });

  it("Finds all necessary display components",() => { 
    cy.findComponentsOnPage(ONE_ACTION_COMPONENT_CHECKLIST)
  })
 
});
