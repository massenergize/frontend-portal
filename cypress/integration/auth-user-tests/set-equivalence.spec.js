import "cypress-localstorage-commands";

import fields from "../../fixtures/json/fields"

describe("User trying to set equivalence", function () {
  before(() => {
    cy.visit(fields.urls.homepage.withParams);
    cy.cleanUp();
    cy.authenticateWithoutUI();
    cy.visit(fields.urls.homepage.raw + "profile");
  });
  // it("Renders login page", function () {
  //   cy.visit(fields.urls.homepage);
  //   cy.cleanUp();
  // });

  // it("Types login details and signs in", function () {
  //   // cy.loginWithDetails();
  //   // cy.authenticateWithoutUI();
  // });

  it("Renders profile page", function () {
    cy.get("#profile-page-component");
  });

  it("Renders EQ dropdown component", function () {
    cy.get("#eq-list-dropdown").as("dropdown");
  });

  it("Renders same number of available EQ items in equivalence dropdown", function () {
    cy.get("#eq-list-dropdown-wrapper").then(function ($div) {
      const numberOfItems = $div.attr("data-number-of-eq-items");
      // click dropdown component to show children, so that they will be available in the DOM
      cy.get("#eq-list-dropdown").click();
      // check that the number of EQ items in the dropdown match the number of items that came from the backend
      //+1. Plus one because we always add the extra "-------" (null) field we usually pass into the dropdown.
      cy.get(".eq-list-dropdown-item").should(
        "have.length",
        (Number(numberOfItems) + 1).toString()
      );
    });
  });

  // The idea is that user is able to choose an item from the dropdown,
  // then saves the selected item to local storage, and removes the dropdown list blanket
  // from the DOM on selection
  it("Clicks dropdown and closses dropdown successfully", function () {
    clickDropdownItem().should("not.exist");
  });

  it("Chosen dropdown item is available in local storage", function () {
    clickDropdownItem(true).then(function () {
      cy.getLocalStorage("PREFERRED_EQ").should("exist");
    });
  });

  it("Carbon box reflects choice after selection right away!", function () {
    clickDropdownItem(true).then(function () {
      cy.getLocalStorage("PREFERRED_EQ").then(function ($eq) {
        const json = JSON.parse($eq);
        cy.get("#carbon-counter-box")
          .invoke("attr", "data-pref-eq-name")
          .should("equal", json.name);
      });
    });
  });
});

function clickDropdownItem(toggleDropdownFirst = false) {
  if (toggleDropdownFirst) cy.get("#eq-list-dropdown").click();
  return cy
    .get(".eq-list-dropdown-item")
    .eq(1)
    .then(function ($eqItem) {
      cy.wrap($eqItem).click();
    });
}
