import fields from "./json/fields";

describe("Locates user portal", function () {
  before(function () {
    cy.visit(fields.urls.landing);
  });

  it("Found community dropdown items", () => {
    cy.get(".select-envelope")
    cy.get(".custom-select>option").should("exist");
  });
});
