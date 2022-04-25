import fields from "../../fixtures/json/fields";

const knownTestimonialId = 2; //you can change this manually here
describe("Renders one testimonials page via link", function () {
  it("Visits individual testimonial page with a known id", function () {
    cy.request({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      url: fields.api.urls.fetchTestimonials,
      body: { subdomain: fields.subdomain },
    }).then((response) => {
      const data = response.body.data;
      if (!data || !data.length)
        cy.log("The backend did not return any testimonials");
      const firstOne = response.body.data[0];
      cy.visit(
        fields.urls.testimonials.raw + "/" + firstOne.id + fields.params
      );
    });
    cy.cleanUp();
  });
});
