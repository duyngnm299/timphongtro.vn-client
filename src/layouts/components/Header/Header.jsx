import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';

// import HeadLess from '@tippyjs/react/headless';

import 'tippy.js/dist/tippy.css';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import Image from '~/components/Image';
import Saved from '~/components/Popper/Saved';
// import Search from '../Search';
import config from '~/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { AiOutlineMenu } from 'react-icons/ai';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '~/api';
import { currentMenu } from '~/redux/slice/menuSlice';
import Notifications from './components/Notifications';
import MessageBox from './components/MessageBox';
import { FiMoreHorizontal } from 'react-icons/fi';
import MenuList from './components/MenuList';
import { GoPrimitiveDot } from 'react-icons/go';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

const navbar_items = [
    { title: 'Phòng trọ', to: config.routes.motel },
    { title: 'Nhà nguyên căn', to: config.routes.house },
    { title: 'Văn phòng', to: config.routes.office },
    { title: 'Mặt bằng', to: config.routes.ground },
    { title: 'Chung cư - căn hộ', to: config.routes.apartment },
    { title: 'Tìm người ở ghép', to: config.routes.findroomates },
];

function Header() {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const udtUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );
    const newNtf = useSelector(
        (state) => state.notification.notification?.newNtf,
    );
    const [showSaved, setShowSaved] = useState(false);
    const [savedItem, setSavedItem] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [showMoreItem, setShowMoreItem] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showIconNtf, setShowIconNtf] = useState(false);
    const savePost = useSelector((state) => state.post?.saved?.changeSaved);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fullName = currentUser?.fullName;

    const udtFullName = udtUser?.fullName;
    // set notification message

    useEffect(() => {
        currentUser &&
            getUser(currentUser?._id).then((res) => {
                console.log(res?.user?.savedPost);
                setSavedItem(res?.user?.savedPost);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        currentUser &&
            getUser(currentUser?._id).then((res) => {
                setSavedItem(res?.user?.savedPost);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savePost]);
    useEffect(() => {
        if (newNtf) {
            setShowIconNtf(true);
        } else {
            setShowIconNtf(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newNtf]);
    const handleOnClick = () => {
        currentUser && dispatch(currentMenu('new_post'));
    };
    const handleOnClickNavbarItem = (item, index) => {
        navigate(item.to);
        setCurrentIndex(index);
    };

    const handleShowMenu = () => {
        setShowMenu(true);
    };

    const hideMenu = (childData) => {
        setShowMenu(childData);
    };
    return (
        <header className={cx('wrapper')}>
            <div className={cx('header-small')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img className={cx('logo-img')} src={images.logo} alt="" />
                </Link>
                <div className={cx('menu-button')} onClick={handleShowMenu}>
                    <AiOutlineMenu className={cx('menu-icon')} />
                    {showIconNtf && (
                        <GoPrimitiveDot className={cx('ntf-icon')} />
                    )}
                </div>
            </div>
            {showMenu && (
                <div className={cx('menu-list')}>
                    <MenuList hideMenu={hideMenu} />
                </div>
            )}
            <div className={cx('inner')}>
                <div className={cx('left-header')}>
                    <Link to={config.routes.home} className={cx('logo-link')}>
                        <img
                            className={cx('logo-img')}
                            src={images.logo}
                            alt=""
                        />{' '}
                    </Link>
                    {/* <Search /> */}
                    <nav className={cx('navbar')}>
                        <ul className={cx('navbar-list')}>
                            {navbar_items.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() =>
                                        handleOnClickNavbarItem(item, index)
                                    }
                                >
                                    <li
                                        className={cx(
                                            'navbar-item',
                                            (index === 4 || index === 5) &&
                                                'hide-last-item',
                                            index === currentIndex &&
                                                'navbar-item-active',
                                        )}
                                    >
                                        {item.title}
                                    </li>
                                </div>
                            ))}
                            <div
                                className={cx('more-wrapper')}
                                onMouseEnter={() => {
                                    setShowMoreItem(true);
                                }}
                                onMouseLeave={() => {
                                    setShowMoreItem(false);
                                }}
                            >
                                <FiMoreHorizontal className={cx('more-icon')} />
                                {showMoreItem && (
                                    <div className={cx('more-list')}>
                                        <Link
                                            to={navbar_items[4]?.to}
                                            className={cx('more-item')}
                                        >
                                            {navbar_items[4]?.title}
                                        </Link>
                                        <Link
                                            to={navbar_items[5]?.to}
                                            className={cx('more-item')}
                                        >
                                            {navbar_items[5]?.title}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </ul>
                    </nav>
                </div>
                <div className={cx('action')}>
                    {currentUser ? (
                        <>
                            <Tippy
                                content="Tin đã lưu"
                                delay={(0, 200)}
                                placement="bottom"
                            >
                                <div>
                                    <Saved
                                        items={savedItem}
                                        show={showSaved}
                                        hide={() => {
                                            setShowSaved(false);
                                        }}
                                    >
                                        <button
                                            className={cx('action-btn')}
                                            onClick={() => {
                                                setShowSaved(!showSaved);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                className={cx('icon')}
                                            />
                                            {savedItem?.length > 0 && (
                                                <span
                                                    className={cx(
                                                        'saved-count',
                                                    )}
                                                >
                                                    {savedItem.length}
                                                </span>
                                            )}
                                        </button>
                                    </Saved>
                                </div>
                            </Tippy>
                            <Notifications />
                            <div
                                onClick={() => {
                                    // setNtfMessage(false);
                                }}
                            >
                                <MessageBox />
                            </div>
                            <Menu>
                                <div className={cx('user-wrapper')}>
                                    <Image
                                        className={cx('user-avatar')}
                                        src={
                                            udtUser?.profilePicture
                                                ? udtUser?.profilePicture.includes(
                                                      'https://lh3',
                                                  )
                                                    ? udtUser?.profilePicture
                                                    : `${HOST_NAME}/${udtUser?.profilePicture}`
                                                : currentUser?.profilePicture
                                                ? currentUser?.profilePicture.includes(
                                                      'https://lh3',
                                                  )
                                                    ? currentUser?.profilePicture
                                                    : `${HOST_NAME}/${currentUser?.profilePicture}`
                                                : images.defaultAvt
                                        }
                                        alt="avatar"
                                        // Link ảnh gốc lỗi => set ảnh khác khác ảnh no Image
                                        fallBack={images.defaultAvt}
                                    />

                                    <span className={cx('username')}>
                                        Hi,{' '}
                                        {udtUser
                                            ? udtFullName
                                                ? udtFullName
                                                : udtUser?.username
                                            : fullName
                                            ? fullName
                                            : currentUser?.username}
                                    </span>
                                </div>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Link to={config.routes.login}>
                                <Button primary>Đăng nhập</Button>
                            </Link>
                        </>
                    )}

                    <Link
                        to={
                            currentUser
                                ? config.routes.post
                                : config.routes.login
                        }
                    >
                        <Button onClick={handleOnClick} text>
                            Đăng tin
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
