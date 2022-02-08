import fields from "./../json/fields";

const event_id = 211;
describe("Visits one event page with a known url", function () {
  it("Rendered one event page", function () {
    cy.visit(fields.urls.events.raw + "/" + event_id + fields.params);
    cy.cleanUp();
  });
});
