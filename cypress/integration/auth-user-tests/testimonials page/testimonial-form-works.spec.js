
import fields from "../../../fixtures/json/fields";
import "../reusable/authenticate-user-with-token.spec";

/**
 * @TODO: Make DRY later
 */
describe("Testimonial form Works", function () {
   before(() => {
     cy.authenticateWithoutUI("luxcomh@gmail.com","S@msung600");
   });

   it("visit testimonial page",()=>{
      cy.visit(fields.urls.testimonials.raw);
           cy.cleanUp();
   })


  it("Testimonial form works", function () {
    cy.get(".stories-row")
  })


})
