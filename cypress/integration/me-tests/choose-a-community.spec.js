import fields from "./json/fields";

describe("Loads all communities page, and successfully select a community", function () {
  it("Renders all communities page", function () {
    cy.loadPage(fields.urls.landing, "communities-dropdown-test-id");
  });

  it("Searches for a community by typing in the autocomplete box", function () {
    cy.get("#test-auto-complete-textbox")
      .as("textbox")
      .type(`${fields.community}`, { delay: 300 });
    cy.get(".test-dropdown-child-class").first().as("item").click();
  });

  // if there is at least one service-item box on the page, it means homepage loaded properly
  // why service-item boxes? Because welcome images, graphs and events on the homepage are subject
  // to admin tweaks. They all have cases of 0. But for boxes, there is bound to be one of them on
  //every community page everytime.
  it("Successfully redirected to homepage", function () {
    cy.get(".service-item").first();
  });
});
