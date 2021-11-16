import fields from "../json/fields";
import "./../all-events-page-renders-properly(via-navigation).spec";
const event_id = 211;

describe("Visits one event page by using navigation menu and clicks", function () {
  it("Rendered one event page after clicking first event card ", function () {
    cy.get(".test-one-event-card").first().click();
  });
});
