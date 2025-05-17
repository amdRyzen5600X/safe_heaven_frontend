/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_BACKEND_HOST: string;
    readonly VITE_BACKEND_PORT: string;
    readonly VITE_SOCKETIO_HOST: string;
    readonly VITE_SOCKETIO_PORT: string;
}

interface ImportMetaEnv {
    readonly env: ImportMetaEnv;
}
