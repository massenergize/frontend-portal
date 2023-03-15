import fields from "../../../fixtures/json/fields";
import {
  createFilterContentFromCollection,
  loadEvents,
  onlyRelevantTags,
} from "../../../support/M.E/handy";

var filterObject;
/**
 * IDEA:
 * Load events, and load all categories
 * Now filter out only categories that have actually been used on items
 * Now select the first collection, choose any tag in that collection,
 * And turn it into a format that follows the URL filter structure being used on the portal
 * Build a URL with it, and visit the events page with the filters
 * Test is successful if all the preselected items have the tag name of the tag whose id
 * is used in the url filter, embedded in their  "data-tag-names" of each of the selected items
 *
 */
describe("Filters passed via url work well on events page", function () {
  before("Load content from api", async function () {
    const events = await loadEvents();
    const filters = await onlyRelevantTags(events);
    filterObject = createFilterContentFromCollection(filters[0]);
  });

  it("Visits all events page with filter url", function () {

    cy.visit(
      fields.urls.events.raw + "/" + "?filters=" + filterObject.filterString
    );
    // cy.removeBanner();
  });

  it("All selected events cards contain the filter tagName", function () {
    cy.get(".test-one-event-card").each(($eventCard) => {
      expect(
        $eventCard.attr("data-tag-names").includes(filterObject.tagName)
      ).to.equal(true);
    });
  });
});
