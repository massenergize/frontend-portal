import { typeInsideFilterbox } from "../../support/M.E/utils";


import "./../reusable/go-to-all-testimonials-page-via-navigation.spec";

/**
 * Get the title of the first testimonial
 * type the title into the filter box
 * All showing testimonial cards should have that title
 */

var numberOfStories, title;
describe("Filterbox on testimonials page works well", function () {
  before(() => cy.cleanUp());
  it("Gets the number of available Testimonials ", function () {
    cy.get(".test-stories-wrapper").then(
      ($el) => (numberOfStories = $el.attr("data-number-of-stories"))
    );
  });

  it("Gets the title of first testimonial", function () {
    if (numberOfStories === 0)
      cy.log("Page loaded properly but there were no stories...");
    else
      cy.get(".test-story-sheet-title")
        .first()
        .then(($el) => (title = $el.text()));
  });

  it("Types into filter box", function () {
    typeInsideFilterbox(title);
  });

  it("Checks that all filtered testimonials have the same title", function () {
    if (numberOfStories !== 0)
      cy.get(".test-story-sheet-title").each(($el, ind, $list) =>
        cy.wrap($el).should("have.text", title)
      );
  });
});
