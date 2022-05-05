import { showThatAllTeamCardsDisplayProperly } from "../../../support/M.E/utils";
import "../../reusable/go-to-all-teams-page-via-link.spec";

describe("All cards on all teams page show up via link", function () {
  it("Displays the same number of team cards as number of teams provided by api", function () {
    showThatAllTeamCardsDisplayProperly();
  });
});
