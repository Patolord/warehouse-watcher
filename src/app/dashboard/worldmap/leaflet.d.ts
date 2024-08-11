import * as L from "leaflet";

declare module "leaflet" {
  namespace Marker {
    interface PrototypeOptions {
      icon?: L.Icon;
    }
  }
}
