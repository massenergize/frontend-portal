const { visitSite } = require("../../../support/M.E/utils");

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

describe("Mark an action as done", function () {
  before(() => {
    visitSite("https://community.massenergize.dev/wayland/actions");
    cy.cleanUp();
    cy.authenticateWithoutUI();
  });

  it("Creates a new action", () => {
    cy.wait(6000);

    // cy.get(
    //   ".all-head-area.position-btn-and-title > .phone-vanish.submitted-content-btn-wrapper"
    // )
    //   .contains("Action")
    //   .click();

    cy.get("#test-action-cards-wrapper")
      .children()
      .then(($elements) => {
        const itemCount = $elements.length;

        cy.get(
          ".all-head-area.position-btn-and-title > .phone-vanish.submitted-content-btn-wrapper"
        )
          .contains("Action")
          .click();

        // filling the form
        cy.get('input[name="title"]').type("This is a sample new test action", {
          force: true,
        });
        cy.get('textarea[name="featured_summary"]').type(
          "This is a sample featured summary",
          { force: true }
        );

        // tox-edit-area

        cy.setTinyMceContent(
          "tiny-react_88887760151721728133122",
          "This is the new content"
        );

        // cy.get(".tox-edit-area > :nth-child(1)").then(($iframe) => {
        //   cy.wrap($iframe)
        //     .contains("#tiny-tiny-react_48668310311721729644243")
        //     .then(($body) => {
        //       // Access the editor content
        //       const editorContent = $body.text();
        //       expect(editorContent).to.equal("Initial content");

        //       // Type in the editor
        //       cy.wrap($body).type("New content{enter}");

        //       // Verify the updated content
        //       cy.wrap($iframe)
        //         .find("body")
        //         .then(($body) => {
        //           const updatedEditorContent = $body.text();
        //           expect(updatedEditorContent).to.equal("New content");
        //         });
        //     });

        // Access the editor content
        //   const editorContent = $editor.contents().text();
        //   expect(editorContent).to.equal("");

        //   cy.log("Editor content: ", `=='${editorContent}'`);

        //   // Type in the editor
        //   cy.wrap($editor)
        //     .first()
        //     .type("This is the new description text!", { force: true });

        //   const editorContent2 = $editor.contents().text();
        //   cy.log("Editor content 222: ", `=='${editorContent2}'`);

        // Verify the updated content
        // cy.get(".tox-edit-area > :nth-child(1)").then(($editor) => {
        //     const updatedEditorContent = $editor.contents().text();
        //     expect(updatedEditorContent).to.equal("New content");
        // });
      });
  });
});
