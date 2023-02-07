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

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getConvOfUser, getUser } from '~/api';
import { currentMenu } from '~/redux/slice/menuSlice';
import Notifications from './components/Notifications';
import MessageBox from './components/MessageBox';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

const navbar_items = [
    { title: 'Phòng trọ', to: config.routes.motel },
    { title: 'Nhà nguyên căn', to: config.routes.house },
    { title: 'Văn phòng', to: config.routes.office },
    { title: 'Chung cư - căn hộ', to: config.routes.apartment },
    { title: 'Mặt bằng', to: config.routes.ground },
    { title: 'Tìm người ở ghép', to: config.routes.findroomates },
];

function Header() {
    const [showSaved, setShowSaved] = useState(false);
    const [savedItem, setSavedItem] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const savePost = useSelector((state) => state.post?.saved?.changeSaved);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const fullName = currentUser?.fullName;
    const udtUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );
    const udtFullName = udtUser?.fullName;
    const newMsg = useSelector((state) => state.message.message?.msg);
    console.log(newMsg);
    useEffect(() => {
        currentUser &&
            getUser(currentUser?._id).then((res) => {
                console.log(res?.user?.savedPost);
                setSavedItem(res?.user?.savedPost);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log(savedItem);
    useEffect(() => {
        currentUser &&
            getUser(currentUser?._id).then((res) => {
                setSavedItem(res?.user?.savedPost);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savePost]);

    useEffect(() => {
        currentUser &&
            getConvOfUser(currentUser._id)
                .then((res) => setConversation(res.conversation))
                .catch((err) => console.log(err));
    }, [currentUser]);

    const handleOnClick = () => {
        currentUser && dispatch(currentMenu('new_post'));
    };
    const handleOnClickNavbarItem = (item, index) => {
        navigate(item.to);
        setCurrentIndex(index);
    };
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('right-header')}>
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
                                            index === currentIndex &&
                                                'navbar-item-active',
                                        )}
                                    >
                                        {item.title}
                                    </li>
                                </div>
                            ))}
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
                            <MessageBox data={conversation} />
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
