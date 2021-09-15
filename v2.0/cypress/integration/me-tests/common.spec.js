export const loginWithDetails = (
  email = "frimpong@kehillahglobal.com",
  password = "Pongo123"
) => {
  it("Types login details and signs in", function () {
    cy.get("#login-email").type("pongofrimi@gmail.com");
    cy.get("#login-password").type("Pongo123");
    cy.get("#sign-in-btn").click();
  });
};
