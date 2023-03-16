import fields from "../../fixtures/json/fields";

describe("Test tour", function () {
  it("Tour overlay shows up", function () {
    cy.visit(fields.urls.homepage.raw+"?tour=true");
    cy.get(".react-joyride__overlay").should("exist");
    cy.get(".__floater__open").should("exist");
    cy.get(".__floater__body").should("exist");
    cy.get("[aria-label='Skip Tour']").should("exist");
  });

  it("Deactivated tour successfully", function () {
    cy.get("[aria-label='Skip Tour']").click();
    cy.get(".react-joyride__overlay").should("not.exist");
    cy.get(".__floater__open").should("not.exist");
    cy.get(".__floater__body").should("not.exist");
  });
});
