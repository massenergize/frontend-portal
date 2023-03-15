import { typeInsideFilterbox } from "../../../support/M.E/utils";
import "../../reusable/go-to-all-events-page(via link).spec";

var title;
describe("Filtering on all events page works well", function () {
  before(() => cy.cleanUp());
  it("Got the title of the first event", function () {
    cy.get(".test-event-card-title")
      .first()
      .then(($el) =>{
        console.log("=== Write title ===", $el.text());
        return (title = $el.text());
      });
  });
  it("Typed content into filterbox", () => {
    typeInsideFilterbox(title);
  });
  it("Event cards were filtered", () => {
    cy.get(".test-event-card-title").each(($el) => {
      console.log("=== Checking title match ===", $el.text());
      return $el.text().includes(title)}
      );
  });
});
