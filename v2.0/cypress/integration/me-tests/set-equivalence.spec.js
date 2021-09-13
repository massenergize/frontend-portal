describe("User trying to set equivalence", function () {
  it("Renders login page and logs in", function () {
    cy.visit("http://localhost:3000/wayland/signin");
  });

  it("Types login details and signs in", function () {
    cy.get("#login-email").type("pongofrimi@gmail.com");
    cy.get("#login-password").type("Pongo123");
    cy.get("#sign-in-btn").click();
  });

  it("Renders profile page", function () {
    // cy.visit("http://localhost:3000/wayland/profile");
    cy.get("#profile-page-component");
  });

  it("Renders equivalence list component", function () {
    cy.get("#eq-list-dropdown");
  });
});
