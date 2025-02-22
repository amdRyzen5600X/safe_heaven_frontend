import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

export const env = {
    BASE_URL: `http://${import.meta.env.VITE_BACKEND_HOST || "127.0.0.1"}:${import.meta.env.VITE_BACKEND_PORT || "3000"}`
};

const createAxiosInstance = (url: string ): AxiosInstance => {
    const instance = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });

    instance.interceptors.request.use(
        // @ts-ignore
        (config: AxiosRequestConfig): AxiosRequestConfig => {
            const token = Cookies.get("access_token");

            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error: any) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => response,
        async (error: any) => {
            const originalRequest = error.config;

            if (originalRequest.url.includes('/auth')) {
                return Promise.reject(error);
            }

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = Cookies.get('refresh_token');

                    if (!refreshToken) {
                        throw new Error('there is no refresh_token');
                    }

                    const { data } = await axios.post(`${env.BASE_URL}/auth/refresh`, { refresh_token: refreshToken });

                    Cookies.set('access_token', data.access_token);
                    Cookies.set('refresh_token', data.refresh_token);

                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

                    return instance(originalRequest);
                } catch (refreshError) {
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");

                    window.location.href = "/sign-in";

                    return Promise.reject(refreshError);
                }
            }

            if (error.response && error.response.status === 401) {
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");

                window.location.href = "/sign-in";
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export default createAxiosInstance;
