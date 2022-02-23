export const contactUsPageComponentsLoadProperly = () => {
  var hasLocation;
  it("Found contact us form", () => {
    cy.get("#test-contact-us-form").should("exist");
    // look into testing the contact form generator
  });
  it("Found admin names", () => {
    cy.get(".test-admin-names").should("exist");
  });
  it("Found location ", () => {
    cy.get("test-contact-us-wrapper").then(
      ($el) => (hasLocation = $el.attr("data-location"))
    );
    if (hasLocation) {
      cy.get("#test-location-name").should("exist");
      cy.get("#test-no-location-name").should("not.exist");
      cy.log("Has location...");
    } else {
      cy.get("#test-location-name").should("not.exist");
      cy.get("#test-no-location-name").should("exist");
      cy.log("Does not have location...");
    }
  });
};

export const rsvpWithDropdown = () => {
  it("Clicked the RSVP button to activate dropdown", function () {
    cy.get(".test-card-rsvp-toggler").first().click();
  });
  it("RSVP dropdown opened up", function () {
    cy.get(".test-light-drop-menu");
  });

  it("Chose 'Going' from RSVP dropdown list", () => {
    cy.get(".test-light-drop-item").eq(1).click();
  });
};
export const oneEventPageComponentsRenderProperly = () => {
  var rec, venue, date;
  it("Got the details of recurring status, venue, and date from the event object itself", () => {
    cy.get(".test-one-event-wrapper")
      .first()
      .then(($el) => {
        rec = $el.attr("data-is-recurring");
        venue = $el.attr("data-venue");
        date = $el.attr("data-date");
      });
  });
  it("Found event title", () => cy.get(".test-event-title").should("exist"));
  it("Found event description", () =>
    cy.get(".test-event-body").first().should("exist"));
  it("Found event image", () => cy.get(".test-event-image"));
  it("Found the event date", () => {
    if (date) cy.get(".test-event-date").first().should("exist");
    else cy.log("Does not have any date...");
  });
  it("Found the event venue", () => {
    if (venue) cy.get(".test-event-venue").first().should("exist");
    else cy.log("Does not have any venue...");
  });
  // it("Found the event recurring status", () => {
  //   if (rec) cy.get(".test-event-recurring-status").first().should("exist");
  //   else cy.log("Does not have any recurring string...");
  // });
};

export const showThatAllEventCardsDisplayProperly = () => {
  var numberOfEvents;
  before(() => cy.cleanUp());
  it("Got number of available events", function () {
    cy.get(".test-events-page-wrapper").then(
      ($el) => (numberOfEvents = $el.attr("data-number-of-events"))
    );
  });

  it("Event cards display when there are events or 'No events' prompt shows up instead", function () {
    if (!numberOfEvents || numberOfEvents === 0) {
      cy.get("#test-no-events").should("exist");
      cy.get(".test-one-event-card").first().should("not.exist");
      cy.log("There we no events...");
    } else {
      cy.get("#test-no-events").should("not.exist");
      cy.get(".test-one-event-card").should("have.lengthOf", numberOfEvents);
    }
  });
};

export const oneTeamPageComponentsRenderProperly = () => {
  var hasLotsOfText;
  it("Has found team name", () => cy.get(".test-team-name").first());
  it("Has found team tagline", () => cy.get(".test-team-tagline").first());
  it("Has found description", () => {
    cy.get(".test-one-team-wrapper")
      .first()
      .then(($div) => (hasLotsOfText = $div.text() === "true"));
    if (hasLotsOfText) cy.get(".test-team-big-text").first();
    else cy.get(".test-team-small-text").first();
  });
  it("Has found graph", () => cy.get("#test-team-graph-wrapper"));
};

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
  ]; // all ids are setup like this in the component, their attributes also follow the same naming, just without "test-", but with "data-"
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
  cy.get("#test-filter-box-id").type(text, { delay: 150, force: true });
  cy.get("#test-filter-box-id").scrollIntoView({ offset: { top: -550 } });
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
