import { typeInsideFilterbox } from "../../support/M.E/utils";
import fields from "./json/fields";

/**
 * Proc:
 * Enter all services page
 * Find the text name of the first service provider on the page, collect it
 * type it in search box
 * In the end, the filtered services on the page should have the exact name as typed in the search box
 *
 */

var name,
  numberOfServiceProviders = 0;
describe("Filter box on services page works well", function () {
  before(() => cy.visit(fields.urls.services));

  it("Gets number of available vendors", function () {
    cy.get(".test-no-of-vendors-div").then(
      ($element) =>
        (numberOfServiceProviders = $element.attr("data-number-of-vendors"))
    );
  });
  it("Collects title of first item if available", function () {
    if (numberOfServiceProviders > 0) {
      cy.get(".test-vendor-name")
        .first()
        .then(($sheet) => (name = $sheet.text()));
    } else
      cy.log("Page loaded properly, but there were no service providers...");
  });

  it("Enters filtering text inside filterbox", function () {
    if (numberOfServiceProviders > 0) {
      typeInsideFilterbox(name);
    } else
      cy.log("Page loaded properly but there were no service providers...");
  });

  it("Filterbox filters correctly", function () {
    cy.get(".test-vendor-name").each(($element, index, $all) =>
      cy.wrap($element).should("have.text", name)
    );
  });
});
