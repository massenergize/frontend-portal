import { testimonialsShowProperly } from "../../support/M.E/utils";
import fields from "./json/fields";
import "./reusable/go-to-all-testimonials-page-via-navigation.spec";

describe("All testimonials sheets load correctly", function () {
  it("Checks if sheets match the number of stories available", () =>
    testimonialsShowProperly());
});
