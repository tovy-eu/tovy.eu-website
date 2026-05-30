interface DataLayerObject {
  event?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: DataLayerObject[];
  }
}
