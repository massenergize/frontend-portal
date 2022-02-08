import fields from "../json/fields";

const knownTestimonialId = 2; //you can change this manually here
describe("Renders one testimonials page via link", function () {
  it("Visits individual testimonial page with a known id", () =>
    cy.visit(
      fields.urls.testimonials.raw + "/" + knownTestimonialId + fields.params
    ));
});
