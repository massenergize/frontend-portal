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
