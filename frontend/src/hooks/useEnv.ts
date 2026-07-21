export const useEnv = () => {
    const server = import.meta.env.VITE_SERVER_URL ?? import.meta.env.VITE_DEV_SERVER_URL;

    return {
        dev: {
            server,
        },
    };
};
