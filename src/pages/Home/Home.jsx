import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import ImageSlider from '~/components/ImageSlider';
import SearchHomePage from '~/components/SearchHomePage';
import ShowPost from '~/components/ShowPost';
import images from '~/assets/images';
import { useDispatch, useSelector } from 'react-redux';
// import { useState } from 'react';
import { newMessage, onlineUsers } from '~/redux/slice/messageSlice';
import { useState } from 'react';
import { newNotification } from '~/redux/slice/notificationSlice';
import Footer from '~/layouts/components/Footer';

const cx = classNames.bind(styles);
const Home = ({ sk }) => {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const dispatch = useDispatch();
    const [inHome, setInHome] = useState(false);
    useEffect(() => {
        setInHome(!inHome);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        currentUser &&
            sk &&
            sk?.current?.on('getMessage', (data) => {
                if (data && data?.receiverId === currentUser?._id) {
                    dispatch(newMessage(data));
                }
            });
        sk &&
            sk?.current?.on('getNotification', (data) => {
                if (data && data?.userId === currentUser?._id) {
                    dispatch(newNotification(data));
                }
            });
        sk &&
            sk?.current?.on('getExpiredPost', (data) => {
                console.log('[Expired]', data);

                if (data && data?.userId === currentUser?._id) {
                    dispatch(newNotification(data));
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        currentUser &&
            sk &&
            sk?.current?.on('getMessage', (data) => {
                if (data && data?.receiverId === currentUser?._id) {
                    dispatch(newMessage(data));
                }
            });
        sk &&
            sk?.current?.on('getNotification', (data) => {
                if (data && data?.userId === currentUser?._id) {
                    dispatch(newNotification(data));
                }
            });
        sk &&
            sk?.current?.on('getExpiredPost', (data) => {
                console.log('[Expired]', data);
                if (data && data?.userId === currentUser?._id) {
                    dispatch(newNotification(data));
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    // add and get user when connected
    useEffect(() => {
        sk &&
            sk?.current?.on('getUsers', (users) => {
                // setOnlineUser(users);
                dispatch(onlineUsers(users));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        sk &&
            sk?.current?.on('getUsers', (users) => {
                dispatch(onlineUsers(users));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    useEffect(() => {
        sk &&
            sk?.current?.on('getUsers', (users) => {
                // setOnlineUser(users);
                dispatch(onlineUsers(users));
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inHome]);
    const slides = [
        { url: images.slider1, title: 'beach' },
        { url: images.slider2, title: 'boat' },
        { url: images.slider3, title: 'forest' },
        { url: images.slider4, title: 'city' },
        { url: images.slider5, title: 'italy' },
    ];
    return (
        <div className={cx('wrapper')}>
            <div className={cx('slider-container')}>
                <ImageSlider slides={slides} />
                <SearchHomePage />
            </div>
            <div className={cx('post-container')}>
                <ShowPost />
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    );
};

export default Home;
