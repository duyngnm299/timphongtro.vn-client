import axios from 'axios';
import config from '~/config';
import { adminLogOutSuccess } from '~/redux/slice/adminSlice';
import { logOutFailed, logOutSuccess } from '../redux/slice/authSlice';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

const API = axios.create({
    baseURL: `${HOST_NAME}`,
});

// API.interceptors.request.use((req) => {
//     if (localStorage.getItem('user_info')) {
//         req.headers.Authorization = `Bearer ${JSON.parse(
//             localStorage.getItem('user_info').token,
//         )}`;
//     }
//     return req;
// });

// export const signIn = async (user, navigate, dispatch) => {
//     dispatch(loginStart());
//     try {
//         const res = await API.post('/auth/signin', user, {
//             withCredentials: true,
//         });
//         dispatch(loginSuccess(res.data));
//         navigate('/');
//     } catch (error) {
//         dispatch(loginFailed(error?.response?.data?.message));
//     }
// };

export const signIn = async (user) => {
    const res = await API.post('/auth/signin', user, {
        withCredentials: true,
    });
    return res;
};

// export const signInGoogle = async (accessToken, navigate, dispatch) => {
//     dispatch(loginStart());
//     try {
//         const res = await API.post('/auth/signin', {
//             googleAccessToken: accessToken,
//         });
//         dispatch(loginSuccess(res.data));
//         navigate('/');
//     } catch (error) {
//         dispatch(loginFailed(error?.response?.data?.message));
//     }
// };

export const signInGoogle = async (accessToken) => {
    const res = await API.post('/auth/signin', {
        googleAccessToken: accessToken,
        withCredentials: true,
    });
    return res;
};
export const signUp = async (user) => {
    const res = await API.post('/auth/signup', user);
    return res;
};
export const signUpGoogle = async (accessToken) => {
    const res = await API.post('/auth/signup', {
        googleAccessToken: accessToken,
    });
    return res.data;
};

export const logOut = async (
    dispatch,
    navigate,
    token,
    refreshToken,
    axiosJWT,
) => {
    const data = JSON.stringify({ accessToken: token, refreshToken });
    try {
        await axiosJWT.post(`${HOST_NAME}/auth/logout`, data, {
            headers: {
                token: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        dispatch(logOutSuccess());
        navigate('/dang-nhap');
    } catch (error) {
        console.log(error);
        dispatch(logOutFailed());
    }
};
export const adminLogOut = async (
    dispatch,
    id,
    navigate,
    token,
    refreshToken,
    axiosJWT,
) => {
    const data = JSON.stringify({ accessToken: token, refreshToken });
    try {
        await axiosJWT.post(`${HOST_NAME}/auth/admin/logout`, data, {
            headers: {
                token: `Bearer ${token}`,
            },
        });
        dispatch(adminLogOutSuccess());
        navigate(config.routes.adminLogin);
    } catch (error) {
        console.log(error);
    }
};

export const getAllCategories = async () => {
    try {
        const res = await API.get('/category');
        return res;
    } catch (error) {
        return error;
    }
};

export const createPost = async (formData) => {
    try {
        const res = await API.post('/post', formData);
        return res;
    } catch (error) {
        return error;
    }
};

export const createPreviewPost = async (formData) => {
    try {
        const res = await API.post('/post/preview-post', formData);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getAllPost = async () => {
    try {
        const res = await API.get('/post');
        return res;
    } catch (error) {
        return error;
    }
};

export const getPostOfUser = async (id) => {
    try {
        const res = await API.get(`/post/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updateUser = async (id, data) => {
    try {
        const res = await API.post(`/user/update/${id}`, data, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updateUserFormData = async (id, formData) => {
    try {
        const res = await API.post(`/user/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updateUserSavePost = async (id, data) => {
    try {
        const res = await API.post(`user/update-save-post/${id}`, data, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};
export const deleteSavePost = async (id, data) => {
    try {
        const res = await API.post(`user/deleted-save-post/${id}`, data, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const deletedUser = async (id) => {
    try {
        const res = await API.post(`/user/deleted/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const checkExpiredPost = async (id) => {
    try {
        const res = await API.put(`/post/check/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const sendMail = async (id) => {
    try {
        const res = await API.post(`/auth/send-mail/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const verifyEmail = async (id, otp) => {
    try {
        const res = await API.post(`/auth/verify/${id}`, otp, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getUser = async (id) => {
    try {
        const res = await API.get(`/user/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const SearchFilterPost = async (query) => {
    try {
        const res = await API.post(`/post/search?${query}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getPostListOfUser = async (query) => {
    try {
        const res = await API.post(`/post/list?${query}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getConvOfUser = async (id) => {
    try {
        const res = await API.get(`/conversation/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getMessages = async (id) => {
    try {
        const res = await API.get(`/message/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const addMessage = async (data) => {
    try {
        const res = await API.post(`/message`, data);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updatePassword = async (id, data) => {
    try {
        const res = await API.post(`/auth/${id}`, data);
        return res.data;
    } catch (error) {
        return error;
    }
};

// export const updateSeen = async (id) => {
//     try {
//         const res = await API.post(`/message/update/${id}`);
//         return res.data;
//     } catch (error) {
//         return error;
//     }
// };

export const createConversation = async (data) => {
    try {
        const res = await API.post('/conversation', data);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const res = await API.get(`/user/email/${email}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updatePost = async (id, data) => {
    try {
        const res = await API.post(`/post/update/${id}`, data);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const deletedPost = async (id) => {
    try {
        const res = await API.post(`/post/deleted/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};
export const getAllPostOfUser = async (query) => {
    try {
        const res = await API.post(`/post/allPostOfUser?${query}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updateExpiredPost = async (id, data) => {
    try {
        const res = await API.post(`/post/update-expired/${id}`, data);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getAllUser = async () => {
    try {
        const res = await API.get('/user');
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getAllPostApproved = async (query) => {
    try {
        const res = await API.get('/post/admin/getlistpost?' + query);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const adminCensorPost = async (id, data) => {
    try {
        const res = await API.post('/post/admin/censor/' + id, data);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const adminLogin = async (data) => {
    try {
        const res = await API.post('/auth/admin/signin/', data, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        return error;
    }
};
export const adminRegister = async (data) => {
    try {
        const res = await API.post('/auth/admin/signup/', data);
        return res.data;
    } catch (error) {
        return error;
    }
};
export const createTransaction = async (data) => {
    try {
        const res = await API.post('/transaction/create', data);
        return res.data;
    } catch (error) {
        return error;
    }
};
export const getAllTransaction = async () => {
    try {
        const res = await API.get('/transaction/get-all');
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getTransactionOfUser = async (id) => {
    try {
        const res = await API.get(`/transaction/get-transaction-of-user/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterTransaction = async (query) => {
    try {
        const res = await API.get(`/transaction/filter/list?${query}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterTransactionByType = async (query) => {
    try {
        const res = await API.get(`/transaction/filter/type?${query}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterAllTransactionByMonth = async () => {
    try {
        const res = await API.get(`/transaction/revenue/by-month`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterAllTransactionByDate = async () => {
    try {
        const res = await API.get(`/transaction/revenue/by-date`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getTransactionOfDay = async (query) => {
    try {
        const res = await API.get(
            `/transaction/get-transaction-of-day?${query}`,
        );
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getAllTransactionByDistrict = async () => {
    try {
        const res = await API.get(`/transaction/revenue/by-district`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getTransactionOfDistrict = async (query) => {
    try {
        const res = await API.get(
            `/transaction/get-transaction-of-district?district=${query}`,
        );
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getTransactionOfMonth = async (query) => {
    try {
        const res = await API.get(
            `/transaction/get-transaction-of-month?date=${query}`,
        );
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getTransactionNewest = async () => {
    try {
        const res = await API.get(`/transaction/get-transaction-newest`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getUserNewest = async () => {
    try {
        const res = await API.get(`/user/get/newest`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterUserByMonth = async () => {
    try {
        const res = await API.get(`/user/filter/month`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterPostByMonth = async () => {
    try {
        const res = await API.get(`/post/filter/month`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterPostByDate = async () => {
    try {
        const res = await API.get(`/post/filter/date`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterPostByDistrict = async () => {
    try {
        const res = await API.get(`/post/filter/district`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterPostByCategory = async () => {
    try {
        const res = await API.get(`/post/filter/category`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const filterUserByDate = async () => {
    try {
        const res = await API.get(`/user/filter/date`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const createReportedPost = async (data) => {
    try {
        const res = await API.post(`/post/create/reported`, data);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const deletedReportedPost = async (id) => {
    try {
        const res = await API.post(`/post/deleted/reported/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getAllReported = async () => {
    try {
        const res = await API.get(`/post/get-all/reported`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getDetailReported = async (id) => {
    try {
        const res = await API.post(`/post/detail/reported/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updateUserReportedPost = async (userId, post) => {
    try {
        const res = await API.post(
            `/user/update-reported-post/${userId}`,
            post,
        );
        return res.data;
    } catch (error) {
        return error;
    }
};

export const deleteReportedPostOfUser = async (userId, postId) => {
    try {
        const res = await API.post(
            `/user/deleted-reported-post/${userId}`,
            postId,
            {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json',
                },
            },
        );
        return res.data;
    } catch (error) {
        return error;
    }
};
export const getReportedByPostId = async (postId) => {
    try {
        const res = await API.get(
            `/post/get-reported-by-post-id/${postId}`,
            postId,
        );
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getNewestMessage = async (convId) => {
    try {
        const res = await API.get(`/message/newest/${convId}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const createNotification = async (data) => {
    try {
        const res = await API.post(`/notification/create`, data, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const getNotificationOfUser = async (id) => {
    try {
        const res = await API.get(`/notification/get-ntf-of-user/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const updateSeenNoti = async (id) => {
    try {
        const res = await API.post(`/notification/update-seen/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export const readAllNotification = async (userId) => {
    try {
        const res = await API.post(`/notification/read-all/${userId}`);
        return res.data;
    } catch (error) {
        return error;
    }
};
