
import Axios, { AxiosRequestConfig } from 'axios';

import * as Device from 'expo-device';

const baseUrlForRealDevice = process.env.EXPO_PUBLIC_SERVER_BASE_URL
const baseUrlForEmulator = process.env.EXPO_PUBLIC_EMULATOR_SERVER_BASE_URL
const baseUrl = Device.isDevice ? baseUrlForRealDevice : baseUrlForEmulator;
console.log("Real device?: "+ Device.isDevice);
console.log("baseUrl: "+baseUrl)

export const AXIOS_INSTANCE = Axios.create({
    baseURL: baseUrl
});

export const addAuthenticationHeaderInterceptor = (token: string) => {
    return AXIOS_INSTANCE.interceptors.request.use(function (config) {
        config.headers.Authorization = "Bearer "+token;
        return config;
    });
}

export const removeInterceptor = (interceptor: number) => {
    AXIOS_INSTANCE.interceptors.request.eject(interceptor);
}

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-ignore
    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};

export default customInstance;