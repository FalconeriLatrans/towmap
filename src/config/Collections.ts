import { Environment } from "./Environment";

const suffix =
  Environment.production
    ? ""
    : "_dev";

export const Collections = {

  participants:`participants${suffix}`,
  allocations:`allocations${suffix}`,

};