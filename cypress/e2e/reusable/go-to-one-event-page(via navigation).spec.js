import "./../non-auth-user-tests/events page/all-events-page-renders-properly(via-navigation).spec";

describe("Visits one event page by using navigation menu and clicks", function () {
  it("Rendered one event page after clicking first event card ", function () {
    cy.get(".test-one-event-card-clickable").first().click({force:true});
  });
});
 