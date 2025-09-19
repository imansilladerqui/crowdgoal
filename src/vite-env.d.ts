/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHILIZ_CHAIN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
