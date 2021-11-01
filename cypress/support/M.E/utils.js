export const showThatServicesDisplayProperly = () => {
  cy.get(".test-no-of-vendors-div").then(function ($div) {
    const noOfVendors = $div.attr("data-number-of-vendors");
    cy.get(".test-vendor-card").should("have.lengthOf", noOfVendors);
  });
};
