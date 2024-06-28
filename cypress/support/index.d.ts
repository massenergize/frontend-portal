declare namespace Cypress {
	interface Chainable {
		/**
		 * Custom command to select DOM element by data-cy attribute.
		 * @example cy.dataCy('greeting')
		 */
		dataCy(value: string): Chainable<Element>;
		cleanUp(): Chainable<void>;
		findComponentsOnPage(componentList: string[]): Chainable<void>;
		//         Cypress.Commands.add("cleanUp", function () {
		//   removeCookieBanner();
		//   clearAuthentication();
		// });
	}
}
