import classNames from 'classnames/bind';
import styles from './Notifications.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import images from '~/assets/images';
import { GoPrimitiveDot } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import {
    getNotificationOfUser,
    readAllNotification,
    updateSeenNoti,
} from '~/api';
import { newNotification } from '~/redux/slice/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { BsCheckAll } from 'react-icons/bs';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';

// import it first.
import vi from 'timeago.js/lib/lang/vi';
import config from '~/config';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function Notifications() {
    timeago.register('vi', vi);
    const newNtf = useSelector(
        (state) => state.notification.notification?.newNtf,
    );
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [listNotifications, setListNotifications] = useState([]);
    const [showIcon, setShowIcon] = useState(false);
    const [seen, setSeen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showTippyTooltip, setShowTippyTooltip] = useState(false);
    console.log(showTooltip);
    useEffect(() => {
        getNotificationOfUser(currentUser?._id).then((res) =>
            setListNotifications(res?.notifications),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        newNtf && setShowIcon(true);
        getNotificationOfUser(currentUser?._id).then((res) =>
            setListNotifications(res?.notifications),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newNtf]);
    useEffect(() => {
        getNotificationOfUser(currentUser?._id).then((res) =>
            setListNotifications(res?.notifications),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seen]);
    const handleOnClickItem = (item) => {
        navigate(config.routes.postlist + `/${currentUser?._id}`);
        updateSeenNoti(item?._id).then((res) => setSeen(!seen));
    };

    const handleReadAll = () => {
        readAllNotification(currentUser?._id).then((res) => setSeen(!seen));
    };
    const renderItems = () => {
        return (
            <div
                className={cx('content-wrapper')}
                onMouseEnter={() => setShowTippyTooltip(false)}
                onMouseLeave={() => setShowTippyTooltip(true)}
            >
                <div className={cx('heading')}>
                    <span className={cx('heading-text')}>Thông báo</span>

                    <BsCheckAll
                        className={cx('read-all')}
                        onClick={handleReadAll}
                        // onFocus={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onMouseEnter={() => setShowTooltip(true)}
                    />
                    {showTooltip && (
                        <span className={cx('read-all-text')}>
                            Đánh dấu là đã đọc
                        </span>
                    )}
                </div>
                <div className={cx('notification-list')}>
                    {listNotifications?.length > 0 ? (
                        <>
                            {listNotifications?.map((item, index) => (
                                <div
                                    key={index}
                                    className={cx('notification-item')}
                                    onClick={() => handleOnClickItem(item)}
                                >
                                    <div className={cx('left')}>
                                        <img
                                            src={
                                                HOST_NAME +
                                                    '/' +
                                                    item?.imagePath ||
                                                images.defaultAvt
                                            }
                                            alt=""
                                            className={cx('img')}
                                        />
                                    </div>
                                    <div className={cx('right')}>
                                        <p className={cx('notification-text')}>
                                            {item?.title}
                                        </p>
                                        <p className={cx('time')}>
                                            <TimeAgo
                                                datetime={item?.createdAt}
                                                locale="vi"
                                            />
                                        </p>
                                        {!item.seen ? (
                                            <GoPrimitiveDot
                                                className={cx('icon-new')}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className={cx('empty-noti')}>
                            <img
                                src={images.emptyNoti}
                                alt=""
                                className={cx('empty-noti-img')}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderResult = (attrs) => (
        <div className={cx('message-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('message-popper')}>
                <div className={cx('message-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );
    const handleOnClickNotiButton = () => {
        setShowNotifications(!showNotifications);
        setShowIcon(false);
        dispatch(newNotification(null));
    };
    return (
        <Tippy
            className={cx('tippy-content')}
            content={showTippyTooltip ? 'Thông báo' : null}
            disabled={showTippyTooltip ? false : true}
            delay={(0, 200)}
            placement="bottom"
        >
            <div>
                <HeadlessTippy
                    // visible
                    visible={showNotifications}
                    delay={[0, 1000]}
                    offset={[90, 8]}
                    interactive
                    placement="bottom-end"
                    render={renderResult}
                    onClickOutside={() => setShowNotifications(false)}
                >
                    <div className={cx('ntf-button-wrapper')}>
                        <button
                            className={cx('action-btn')}
                            onClick={handleOnClickNotiButton}
                        >
                            <FontAwesomeIcon
                                icon={faBell}
                                className={cx('icon')}
                            />
                        </button>
                        {showIcon && <GoPrimitiveDot className={cx('badge')} />}
                    </div>
                </HeadlessTippy>
            </div>
        </Tippy>
    );
}

export default Notifications;
