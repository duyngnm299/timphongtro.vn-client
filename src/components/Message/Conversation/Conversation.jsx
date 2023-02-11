import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import images from '~/assets/images';
import styles from './Conversation.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getNewestMessage, getUser } from '~/api';
import { GoPrimitiveDot } from 'react-icons/go';
import { newMessage } from '~/redux/slice/messageSlice';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Conversation({ data, userId }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const newMsg = useSelector((state) => state.message.message?.msg);
    const listOnlineUsers = useSelector(
        (state) => state.message.online?.listUsers,
    );

    const [user, setUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [inConv, setInconv] = useState(false);
    const [newestMsg, setNewestMsg] = useState([]);
    const [textBold, setTextBold] = useState(false);
    useEffect(() => {
        setInconv(!inConv);
        data &&
            getNewestMessage(data?._id).then((res) =>
                setNewestMsg(res?.message),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        data &&
            getNewestMessage(data?._id).then((res) =>
                setNewestMsg(res?.message),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMsg]);
    useEffect(() => {
        if (newMsg && newMsg?.senderId === userId[0]) {
            setShowIcon(true);
            setTextBold(true);
        }
        if (!newMsg) {
            setShowIcon(false);
            setTextBold(false);
        }
        // else {
        //     setTextBold(false);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // set show notify icon
    useEffect(() => {
        if (newMsg && user && newMsg?.senderId === userId[0]) {
            setShowIcon(true);
            setTextBold(true);
        }
        // else {
        //     setTextBold(false);
        // }
        if (!newMsg) {
            setShowIcon(false);
            setTextBold(false);
        }
        // if (!newMsg) {
        //     setShowIcon(false);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMsg]);

    // set user
    useEffect(() => {
        const theirId = data.members.find((item) => item !== currentUser?._id);
        theirId && getUser(theirId).then((res) => setUser(res.user));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // set online user
    useEffect(() => {
        const result =
            listOnlineUsers &&
            listOnlineUsers.find((item) => item.userId === user?._id);
        if (result) {
            setOnlineUser(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const result =
            listOnlineUsers &&
            listOnlineUsers.find((item) => item.userId === user?._id);
        if (result) {
            setOnlineUser(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOnlineUsers]);
    useEffect(() => {
        const us = data.members.find((item) => item !== currentUser?._id);
        const result =
            listOnlineUsers &&
            listOnlineUsers.find((item) => item.userId === us);
        if (result) {
            setOnlineUser(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inConv]);
    const handleSeenMessage = () => {
        if (newMsg && user && newMsg?.senderId === userId[0]) {
            dispatch(newMessage());
            setShowIcon(false);
        }
        if (!newMsg) {
            setShowIcon(false);
        }
    };
    return (
        <>
            <div
                className={cx('list-message-item')}
                onClick={handleSeenMessage}
            >
                <div className={cx('avatar')}>
                    <img
                        src={
                            user?.profilePicture
                                ? `${HOST_NAME}/${user.profilePicture}`
                                : images.defaultAvt
                        }
                        alt=""
                        className={cx('img')}
                    />
                    {onlineUser && (
                        <GoPrimitiveDot className={cx('online-icon')} />
                    )}
                </div>
                <div className={cx('info')}>
                    <div className={cx('username')}>
                        <span>{user && user?.fullName}</span>
                    </div>
                    {newestMsg?.length > 0 && (
                        <div
                            className={cx(
                                'message',
                                textBold ? 'text-bold' : '',
                            )}
                        >
                            <span className={cx('name-small')}>
                                {newestMsg.length &&
                                user &&
                                newestMsg[0].sender === user?._id
                                    ? user?.fullName
                                    : 'Bạn'}
                                :
                            </span>
                            <span className={cx('new-msg')}>
                                {newestMsg[0]?.text || 'đã gửi một bài viết'}
                            </span>
                        </div>
                    )}
                </div>
                {showIcon && (
                    <div className={cx('notify-icon')}>
                        <GoPrimitiveDot className={cx('icon')} />
                    </div>
                )}
            </div>
        </>
    );
}

export default Conversation;
