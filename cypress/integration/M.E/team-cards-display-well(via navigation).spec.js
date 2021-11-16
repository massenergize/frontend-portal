import { showThatAllTeamCardsDisplayProperly } from "../../support/M.E/utils";
import "./reusable/go-to-all-teams-page-via-navigation.spec";
// import {showThatAllTeamCardsDisplayProperly} from
describe("All cards on all teams page show up via navigation", function () {
  it("Displays the same number of team cards as number of teams provided by api", function () {
    showThatAllTeamCardsDisplayProperly();
  });
});
