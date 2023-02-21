import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import images from '~/assets/images';
import styles from './MenuList.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { BiMessageDetail } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { BsMenuUp } from 'react-icons/bs';
import config from '~/config';
import { HiOutlineHome } from 'react-icons/hi';
import { MdPassword } from 'react-icons/md';

import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { currentMenu } from '~/redux/slice/menuSlice';
import { createAxios } from '~/createInstances';
import { logOut } from '~/api';
import { useState } from 'react';
import Notifications from '../Notifications';
import Saved from '~/components/Popper/Saved';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function MenuList(props) {
    const udtUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );
    const currentUser = useSelector((state) => state.auth.login?.currentUser);
    const id = currentUser?.user?._id;
    const accessToken = currentUser?.accessToken;
    const refreshToken = currentUser?.refreshToken;
    console.log(accessToken);
    console.log(refreshToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSavedPost, setShowSavedPost] = useState(false);
    let axiosJWT = createAxios(currentUser, dispatch);
    console.log(axiosJWT);
    const handleLogout = () => {
        logOut(dispatch, navigate, accessToken, refreshToken, axiosJWT);
    };
    const menu_items = [
        {
            icon: <HiOutlineHome />,
            title: 'Trang chủ',
            to: config.routes.home,
        },
        {
            icon: <BsMenuUp />,
            title: 'Quản lý bài đăng',
            to: config.routes.postlist + `/${id}`,
        },
        {
            icon: <FontAwesomeIcon icon={faHeart} />,
            title: 'Tin đã lưu',
            to: config.routes.postlist + `/${id}`,
        },
        {
            icon: <BiMessageDetail />,
            title: 'Tin nhắn',
            to: config.routes.message,
        },
        {
            icon: <HiOutlineHome />,
            title: 'Phòng trọ',
            to: config.routes.motel,
        },
        {
            icon: <HiOutlineHome />,
            title: 'Nhà nguyên căn',
            to: config.routes.house,
        },
        {
            icon: <HiOutlineHome />,
            title: 'Văn phòng',
            to: config.routes.office,
        },
        {
            icon: <HiOutlineHome />,
            title: 'Mặt bằng',
            to: config.routes.ground,
        },
        {
            icon: <HiOutlineHome />,
            title: 'Chung cư - căn hộ',
            to: config.routes.apartment,
        },
        {
            icon: <HiOutlineHome />,
            title: 'Tìm người ở ghép',
            to: config.routes.findroomates,
        },
        {
            icon: <HiOutlineHome />,
            title: 'Nạp tiền',
            to: config.routes.payment + `/${id}`,
        },
        {
            icon: <MdPassword />,
            title: 'Thay đổi mật khẩu',
            to: config.routes.password + `/${id}`,
        },
        {
            icon: <FiLogOut />,
            title: 'Đăng xuất',
        },
    ];
    const menuRef = useRef();
    const handleOnClickOutside = (e) => {
        const { target } = e;
        if (menuRef.current === null) {
            sendDataToParent();
            return;
        }
        if (menuRef.current === undefined) {
            sendDataToParent();
            return;
        }
        if (!menuRef.current.contains(target)) {
            sendDataToParent();
            return;
        }
    };
    const sendDataToParent = () => {
        props.hideMenu(false);
    };
    return (
        <div className={cx('wrapper')} onClick={handleOnClickOutside}>
            <div
                ref={menuRef}
                className={cx('content')}
                onClick={(e) => e.stopPropagation()}
            >
                {currentUser ? (
                    <div className={cx('info-and-ntf')}>
                        <div
                            className={cx('info')}
                            onClick={() => {
                                sendDataToParent();
                                navigate(config.routes.profile + `/${id}`);
                            }}
                        >
                            <img
                                src={
                                    udtUser?.profilePicture
                                        ? udtUser?.profilePicture.includes(
                                              'https://lh3',
                                          )
                                            ? udtUser?.profilePicture
                                            : `${HOST_NAME}/${udtUser?.profilePicture}`
                                        : currentUser?.user?.profilePicture
                                        ? currentUser?.user?.profilePicture.includes(
                                              'https://lh3',
                                          )
                                            ? currentUser?.user?.profilePicture
                                            : `${HOST_NAME}/${currentUser?.user?.profilePicture}`
                                        : images.defaultAvt
                                }
                                className={cx('avatar')}
                                alt=""
                            />
                            <span className={cx('fullName')}>
                                {udtUser
                                    ? udtUser?.fullName
                                        ? udtUser?.fullName
                                        : udtUser?.username
                                    : currentUser?.user?.fullName
                                    ? currentUser?.user?.fullName
                                    : currentUser?.user?.username}
                            </span>
                        </div>
                        <div className={cx('ntf')}>
                            <Notifications menu={true} />
                        </div>
                    </div>
                ) : (
                    <div className={cx('auth')}>
                        <div className={cx('sign-in')}>
                            <button
                                className={cx('btn-sign-in')}
                                onClick={() => {
                                    sendDataToParent();
                                    navigate(config.routes.login);
                                }}
                            >
                                Đăng nhập
                            </button>
                        </div>
                        <div className={cx('sign-out')}>
                            <button
                                className={cx('btn-sign-out')}
                                onClick={() => {
                                    sendDataToParent();
                                    navigate(config.routes.register);
                                }}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                )}
                <div className={cx('button-wrapper')}>
                    <button
                        className={cx(
                            currentUser?.user ? 'btn-post' : 'btn-normal',
                        )}
                        onClick={() => navigate(config.routes.post)}
                    >
                        Đăng tin
                    </button>
                </div>
                <div className={cx('menu-list')}>
                    {menu_items.map((item, index) => (
                        <Link
                            key={index}
                            to={item?.to}
                            className={cx('menu-item')}
                            onClick={() => {
                                if (index === menu_items?.length - 1) {
                                    handleLogout();
                                }

                                dispatch(currentMenu('post_list'));
                                sendDataToParent();
                            }}
                        >
                            <span className={cx('menu-item-icon')}>
                                {item?.icon}
                            </span>
                            <span className={cx('menu-item-text')}>
                                {item?.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MenuList;
