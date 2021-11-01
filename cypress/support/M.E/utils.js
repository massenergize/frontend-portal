export const showThatServicesDisplayProperly = () => {
  cy.get(".test-no-of-vendors-div").then(function ($div) {
    const noOfVendors = $div.attr("data-number-of-vendors");
    cy.get(".test-vendor-card").should("have.lengthOf", noOfVendors);
  });
};

export const checkForRelevantComponentsOnOneServicePage = () => {
  const ids = [
    "test-vendor-name",
    "test-vendor-description",
    "test-vendor-phone",
    "test-vendor-email",
  ]; // all ids are setup like this in the component, their attributes also follow the same nameing, just without "test-", but with "data-"
  ids.forEach((id) => {
    id = "#" + id;
    cy.get(id).then(($element) => {
      const arr = id.split("-");
      const value = $element.attr(`data-${arr[1]}-${arr[2]}`);
      if (arr[2] !== "description") cy.get(id).should("have.text", value); // cant test description this way, because we are using dangerouslySetHtml
    });
  });
};
