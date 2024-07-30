import { typeInsideFilterbox } from "../../../support/M.E/utils";
import "../../reusable/go-to-all-events-page(via link).spec";

var title;
describe("Filtering on all events page works well", function () {
  before(() => cy.cleanUp());


  it("Get the title of the first event if there is", function () {

    cy.get('div[style="padding-top: 0px; margin-top: 9px; padding-right: 40px;"] > .row').then(($el) => {

      cy.log("=======================LOGGING======================", $el.children().length)

      if ($el.children().length > 0) {
        cy.get(".test-event-card-title")
          .first()
          .then(($el) => {
            return (title = $el.text().split(" ")[0]);
          });

        // type title in the search box
        typeInsideFilterbox(title);


        // elements showing includes the title
        cy.get(".test-event-card-title").each(($el) => {
          return $el.text().includes(title)
        }
        );

      } else {
        cy.log("No events found");
      }


    })
  });
});
