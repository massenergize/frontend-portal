import fields from "../json/fields";
import "./go-to-all-testimonials-page-via-navigation.spec";

describe("Chooses a testimonial from all testimonials page, and redirects to individual testimonial page", function () {
  it("Clicks 'full view' on the first loaded testimonial", () =>
    cy.get(".test-story-sheet-full-view-link").first().click());
});
