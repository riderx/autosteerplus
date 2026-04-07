/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare module "*.PNG" {
  const src: string;
  export default src;
}

declare module "*.JPG" {
  const src: string;
  export default src;
}
