export const showThatServicesDisplayProperly = () => {
  cy.get(".test-no-of-vendors-div").then(function ($div) {
    const noOfVendors = $div.attr("data-number-of-vendors");
    cy.get(".test-vendor-card").should("have.lengthOf", noOfVendors);
  });
};
export const showThatAllTeamCardsDisplayProperly = () => {
  cy.get(".test-teams-wrapper").then(function ($div) {
    const number = $div.attr("data-number-of-teams");
    cy.get(".team-card").should("have.lengthOf", number);
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

export const typeInsideFilterbox = (text) => {
  cy.get("#test-filter-box-id").type(text, { delay: 150 });
};

export const testimonialsShowProperly = () => {
  cy.get(".test-stories-wrapper").then(function ($div) {
    const noOfStories = $div.attr("data-number-of-stories");
    if (noOfStories > 0)
      cy.get(".test-story-sheet").should("have.lengthOf", noOfStories);
    else cy.log("Loaded properly, but there were 0 testimonials...");
  });
};

export const showThatTestimonialPageComponentsLoadWell = () => {
  it("Shows title properly", () =>
    cy
      .get(".test-story-title")
      .then(($title) =>
        cy.wrap($title).should("have.text", $title.attr("data-story-title"))
      ));
  it("Shows description properly", () =>
    cy
      .get(".test-story-body")
      .then(($body) =>
        cy.wrap($body).should("have.text", $body.attr("data-story-body"))
      ));
  it("Shows username properly", () =>
    cy
      .get(".test-story-user-name")
      .then(($el) =>
        cy.wrap($el).should("have.text", "By " + $el.attr("data-user-name"))
      ));
};
