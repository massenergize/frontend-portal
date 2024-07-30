import { typeInsideFilterbox } from "../../../support/M.E/utils";
import fields from "../../../fixtures/json/fields";

/// <reference path="../support/index.d.ts" />

/**
 * Proc:
 * Get the first action of the list, copy the text
 * type the text into the filter box
 * Check the current action cards that are showing and verify if their titles
 * have the content  that was just typed in the filterbox
 */
describe("Test actions filterbox functionality", function () {
	before(function () {
		cy.visit(fields.urls.actions.withParams);
		cy.cleanUp();
	});

	it("Filterbox types and filters actions as expected", function () {
		// cy.get("#test-filter-box-id").as("filterbox");
		cy.get(".test-action-card-item")
			.first()
			.find(".test-action-title")
			.then(function ($title) {
				// cy.get("@filterbox").type($title.text(), { delay: 100 });
				typeInsideFilterbox($title?.text()?.split(" ")[0]);
				cy.log("Typed: " + $title.text());
				cy.get(".test-action-card-item")
					.find(".test-action-title")
					.first()
					.should("includes.text", $title?.text()?.split(" ")[0]);
			});
	});
});
