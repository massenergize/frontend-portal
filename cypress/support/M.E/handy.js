import { apiCall } from "../../../src/api/functions";
import {
  filterTagCollections,
  getRandomIntegerInRange,
} from "../../../src/components/Utils";
import fields from "../../fixtures/json/fields";
const subdomain = fields.subdomain;
export const getTagCollections = () => {
  return apiCall("tag_collections.list", {
    subdomain,
  });
};

export const onlyRelevantTags = (array = []) => {
  return getTagCollections().then((response) => {
    return filterTagCollections(array, response.data);
  });
};

export const loadActions = () => {
  return apiCall("actions.list", { subdomain }).then(
    (response) => response.data
  );
};
export const loadTestimonials = () => {
  return apiCall("testimonials.list", { subdomain }).then(
    (response) => response.data
  );
};
export const loadEvents = () => {
  return apiCall("events.list", { subdomain }).then(
    (response) => response.data
  );
};
export const loadServiceProviders = () => {
  return apiCall("vendors.list", { subdomain }).then(
    (response) => response.data
  );
};

export const createFilterContentFromCollection = (collection) => {
  const randomIndex = getRandomIntegerInRange(collection.tags.length);
  const tag = collection.tags[randomIndex];
  return { filterString: collection.id + ":" + tag.id, tagName: tag.name };
};
