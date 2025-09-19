interface ImportMetaEnv {
  VITE_CHILIZ_RPC_URL?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  const value: string;
  export default value;
}
