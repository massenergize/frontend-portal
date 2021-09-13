describe("User trying to set equivalence", function () {
  it("Renders login page", function () {
    cy.visit("http://localhost:3000/wayland/signin");
  });

  it("Types login details and signs in", function () {
    cy.get("#login-email").type("pongofrimi@gmail.com");
    cy.get("#login-password").type("Pongo123");
    cy.get("#sign-in-btn").click();
  });

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


});
