import fields from "../../fixtures/json/fields";

describe("Visits one event page with a known url", function () {
  it("Retrieves event list from B.E and chooses 1", function () {
    // make api request to call for all events and choose one.
    cy.request({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: fields.api.urls.fetchEvents,
      body: { subdomain: fields.subdomain },
    }).then((response) => {
      const data = response.body.data;
      if (!data || !data.length)
        cy.log("The backend did not return any list of events");
      const firstOne = data[0];
      cy.visit(fields.urls.events.raw + "/" + firstOne.id + fields.params);
    });
    cy.cleanUp();
  });
});
