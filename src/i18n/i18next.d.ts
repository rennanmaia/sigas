import "i18next";
import type { I18nResource } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: I18nResource;
    defaultNS: keyof I18nResource;
    returnNull: false;
  }
}
