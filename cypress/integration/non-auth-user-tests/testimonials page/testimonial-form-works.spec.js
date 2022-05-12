import fields from "../../../fixtures/json/fields"


describe("Testimonial form works", function(){
    before(function(){
        cy.visit(fields.urls.testimonials.raw);
    });

    it("Click add testimonial button", function(){
        cy.contains("Add testimonial").click();
        
    })
})