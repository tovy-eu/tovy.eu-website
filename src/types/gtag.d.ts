interface DataLayerObject {
  event?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    dataLayer: DataLayerObject[];
  }
}
