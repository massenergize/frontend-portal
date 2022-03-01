import fields from "../../fixtures/json/fields";
import {
  createFilterContentFromCollection,
  loadActions,
  onlyRelevantTags,
} from "../../support/M.E/handy";

var filterObject;
/**
 * IDEA:
 * Load actions, and load all categories
 * Now filter out only categories that have actually been used on items
 * Now select the first collection, choose any tag in that collection,
 * And turn it into a format that follows the URL filter structure being used on the portal
 * Build a URL with it, and visit the actions page with the filters
 * Test is successful if all the preselected items have the tag name of the tag whose id
 * is used in the url filter, embedded in their  "data-tag-names" of each of the selected items
 *
 */
describe("Filters passed via url work well on actions page", function () {
  before("Load content from api", async function () {
    const actions = await loadActions();
    const filters = await onlyRelevantTags(actions);
    filterObject = createFilterContentFromCollection(filters[0]);
  });

  it("Visits all actions page with filter url", function () {
    cy.visit(
      fields.urls.actions.raw + "/" + "?filters=" + filterObject.filterString
    );
    cy.removeBanner();
  });

  it("All selected actions cards contain the filter tagName", function () {
    cy.get(".test-action-card-item").each(($actionCard) => {
      expect(
        $actionCard.attr("data-tag-names").includes(filterObject.tagName)
      ).to.equal(true);
    });
  });
});
