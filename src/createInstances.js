import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { adminLoginSuccess } from './redux/slice/adminSlice';
import { loginSuccess } from './redux/slice/authSlice';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

const refreshToken = async (refreshToken) => {
    const data = JSON.stringify({ refreshToken });
    try {
        const res = await axios.post(
            `${HOST_NAME}/auth/refresh`,
            data,
            {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json',
                },
            },
            // (axios.defaults.withCredentials = true),
        );
        return res.data;
    } catch (err) {
        return console.log(err);
    }
};
const refreshTokenAdmin = async (refreshToken) => {
    const data = JSON.stringify({ refreshToken });

    try {
        const res = await axios.post(
            `${HOST_NAME}/auth/refresh`,
            data,
            {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json',
                },
            },
            // (axios.defaults.withCredentials = true),
        );

        return res.data;
    } catch (err) {
        return console.log(err);
    }
};
export const createAxios = (currentUser, dispatch) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(currentUser?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken(currentUser?.refreshToken);
                const refreshUser = {
                    ...currentUser,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                };
                dispatch(loginSuccess(refreshUser));
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

export const createAxiosAdmin = (currentUser, dispatch) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(currentUser?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshTokenAdmin(currentUser?.refreshToken);
                const refreshUser = {
                    ...currentUser,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                };
                dispatch(adminLoginSuccess(refreshUser));
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
