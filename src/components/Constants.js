const CONST = {};
CONST["LIMIT"] = 140;
CONST["BIG_LIMIT"] = 400;

export const TESTIMONIAL = "Testimonial";
export const ACTION = "Action";
export const VENDOR = "Service Provider";
export const EVENT = "Event";

export default CONST;

export const COPYRIGHT_OPTIONS = {
  YES: {
    value: true,
    key: "YES",
    text: "Yes. I took the photo or made the image, or was given permission by the person who made the image",
    notes:
      "Took the photo or made the image, or was given permission by the person who made the image",
  },
  YES_CHECKED: {
    value: true,
    key: "YES_CHECKED",
    text: "Yes. I have checked that the image is nto copyright protected.",
    notes: "Checked that the image is not copyright protected",
  },
  NO: {
    value: false,
    key: "NO",
    text: "No. The image may be protected by copyright, and I don't have permission.",
    notes: "Image may be protected by copyright, and I don't have permission",
  },
};

export const PAGE_ESSENTIALS = {
  HOMEPAGE: {
    key: "homepage",
    routes: [
      "home_page_settings.info",
      "menus.list",
      "communities.features.flags.list",
      "impact_page_settings.info",
      // "tag_collections.list",
    ],
  },
  ACTIONS: {
    key: "actions",
    routes: [
      "actions_page_settings.info",
      "tag_collections.list",
      "actions.list",
    ],
  },
  EVENTS: {
    key: "events",
    routes: [
      "events_page_settings.info",
      "tag_collections.list",
      "events.list",
      "events.exceptions.list",
    ],
  },
  TESTIMONIALS: {
    key: "testimonials",
    routes: [
      "testimonials_page_settings.info",
      "tag_collections.list",
      "testimonials.list",
    ],
  },
  VENDORS: {
    key: "vendors",
    routes: [
      "vendors_page_settings.info",
      "tag_collections.list",
      "vendors.list",
    ],
  },
  IMPACT_PAGE: {
    key: "impact",
    routes: [
      "graphs.communities.impact",
      "tag_collections.list",
      "graphs.actions.completed",
    ],
  },
  ABOUT_US: {
    key: "aboutus",
    routes: ["about_us_page_settings.info", "donate_page_settings.info"],
  },
  DONATE: {
    key: "donate",
    routes: ["donate_page_settings.info"],
  },
  CONTACT_US: {
    key: "contactus",
    routes: ["contact_us_page_settings.info"],
  },
  TEAMS: {
    key: "teams",
    routes: [
      "teams_page_settings.info",
      "graphs.actions.completed",
      "teams.stats",
    ],
  },
  ONE_TEAM: {
    key: "one-team",
    routes: [
      "teams.stats",
    ],
  },
  ONE_ACTION: {
    key: "one-action",
    routes: [
      "graphs.actions.completed",
      "actions.list",
      "testimonials.list",

    ],
  },
};
