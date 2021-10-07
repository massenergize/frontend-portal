import fields from "./json/fields";

describe("Locates user portal", function () {
  it("Renders user portal all communities page successfully", function () {
    cy.loadPage(fields.urls.landing, "communities-dropdown-test-id");
  });
});
