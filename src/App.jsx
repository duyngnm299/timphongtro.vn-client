import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
    createNotification,
    getAllPostApproved,
    updateExpiredPost,
} from './api';
import { newNotification } from './redux/slice/notificationSlice';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function App() {
    const socket = useRef();
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const adminUser = useSelector(
        (state) => state.admin.adminLogin?.currentUser?.user,
    );

    const currentDate = new Date();
    const date_diff_indays = function (date1, date2) {
        const dt1 = new Date(date1);
        const dt2 = new Date(date2);
        return Math.floor(
            (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
                (1000 * 60 * 60 * 24),
        );
    };
    const handleDate = (endDate) => {
        const [day, month, year] = endDate.split('/');
        const end = new Date(+year, month - 1, +day);
        const result = date_diff_indays(currentDate, end);
        if (result <= 0) {
            return true;
        }
    };
    useEffect(() => {
        if (currentUser) {
            socket.current = io(`${HOST_NAME}`, {
                transports: ['websocket', 'polling'], // use WebSocket first, if available
            });
            socket.current.emit('addUser', currentUser?._id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    useEffect(() => {
        if (adminUser) {
            socket.current = io(`${HOST_NAME}`, {
                transports: ['websocket', 'polling'], // use WebSocket first, if available
            });
            socket.current.emit('addUser', adminUser?._id);
            console.log(socket.current);
        }
    }, [adminUser]);
    useEffect(() => {
        getAllPostApproved('status=approved').then((res) =>
            res.posts.map((item) => {
                let check = handleDate(item.endDate);

                if (check) {
                    const data = {
                        status: 'expired',
                    };
                    updateExpiredPost(item._id, data);
                    socket.current = io(`${HOST_NAME}`);
                    socket.current.emit('expiredPost', {
                        userId: item?.createdBy[0],
                        title: 'Bài đăng của bạn đã hết hạn.',
                        postId: item?._id,
                        imagePath: item?.images[0].imagePath,
                    });
                    dispatch(
                        newNotification({
                            userId: item?.createdBy[0],
                            title: 'Bài đăng của bạn đã hết hạn.',
                            postId: item?._id,
                            imagePath: item?.images[0].imagePath,
                        }),
                    );
                    const ntfData = JSON.stringify({
                        userId: item?.createdBy[0],
                        title: 'Bài đăng của bạn đã hết hạn.',
                        postId: item?._id,
                        imagePath: item?.images[0].imagePath,
                    });

                    createNotification(ntfData).then((res) => console.log(res));
                }
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout sk={socket && socket}>
                                        <Page sk={socket && socket} />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
