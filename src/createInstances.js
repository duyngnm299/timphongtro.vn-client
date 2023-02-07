import axios from 'axios';
import jwt_decode from 'jwt-decode';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${HOST_NAME}auth/refresh`,

            (axios.defaults.withCredentials = true),
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
const refreshTokenAdmin = async () => {
    try {
        const res = await axios.post(
            `${HOST_NAME}auth/refresh`,

            (axios.defaults.withCredentials = true),
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const createAxios = (currentUser, dispatch, stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(currentUser?.accessToken);
            console.log(decodedToken);
            console.log(date.getTime() / 1000);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();

                const refreshUser = {
                    ...currentUser,
                    accessToken: data.accessToken,
                };
                dispatch(stateSuccess(refreshUser));
                config.headers['token'] = 'Bearer ' + data.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );
    return newInstance;
};

export const createAxiosAdmin = (currentUser, dispatch, stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(currentUser?.accessToken);
            console.log(decodedToken);
            console.log(date.getTime() / 1000);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshTokenAdmin();

                const refreshUser = {
                    ...currentUser,
                    accessToken: data.accessToken,
                };
                dispatch(stateSuccess(refreshUser));
                config.headers['token'] = 'Bearer ' + data.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        },
    );
    return newInstance;
};
