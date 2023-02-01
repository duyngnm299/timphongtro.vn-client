import classNames from 'classnames/bind';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminPostManagement.module.scss';
import AdminPostList from './components/AdminPostList';
import UnApprovedPost from './components/UnApprovedPost';
import { currentMenu } from '~/redux/slice/adminSlice';
import CreatePost from './components/CreatePost';
import { useEffect } from 'react';
import PostStatistics from './components/PostStatistics';

const cx = classNames.bind(styles);

function AdminPostManagement() {
    const dispatch = useDispatch();
    const crMenu = useSelector((state) => state.admin.currentMenu?.menu);
    const [showPostList, setShowPostList] = useState(false);
    const [showUnApprovedPost, setShowUnApprovedPost] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showStatisticsPost, setShowStatisticsPost] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);

    const menuItems = [
        {
            title: 'Danh sách bài đăng',
        },
        {
            title: 'Bài đăng chưa duyệt',
        },
        {
            title: 'Tạo bài đăng',
        },
        {
            title: 'Thống kê',
        },
    ];
    useEffect(() => {
        if (crMenu === 'list-post') {
            setShowUnApprovedPost(false);
            setShowPostList(true);
            setCurrentIndex(0);
            return;
        }
        if (crMenu === 'unapproved') {
            setShowUnApprovedPost(true);
            setShowPostList(false);
            setCurrentIndex(1);
            return;
        }
        if (crMenu === 'create-post') {
            setShowUnApprovedPost(false);
            setShowPostList(false);
            setShowCreatePost(true);
            setCurrentIndex(2);
            return;
        }
        if (crMenu === 'statistics-post') {
            setShowUnApprovedPost(false);
            setShowPostList(false);
            setShowCreatePost(false);
            setShowStatisticsPost(true)
            return
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (crMenu === 'list-post') {
            setShowUnApprovedPost(false);
            setShowPostList(true);
            setShowCreatePost(false);
            setCurrentIndex(0);
            return;
        }
        if (crMenu === 'unapproved') {
            setShowUnApprovedPost(true);
            setShowPostList(false);
            setShowCreatePost(false);

            setCurrentIndex(1);
            return;
        }
        if (crMenu === 'create-post') {
            setShowUnApprovedPost(false);
            setShowPostList(false);
            setShowCreatePost(true);
            setCurrentIndex(2);
            return;
        }
        if (crMenu === 'statistics-post') {
            setShowUnApprovedPost(false);
            setShowPostList(false);
            setShowCreatePost(false);
            setShowStatisticsPost(true)
            return
        }
    }, [crMenu]);
    const handleOnClickMenuItem = (i) => {
        setCurrentIndex(i);
        if (i === 0) {
            dispatch(currentMenu('list-post'));
            setShowUnApprovedPost(false);
            setShowPostList(true);
            setShowCreatePost(false);
            setShowStatisticsPost(false)

        } else if (i === 1) {
            dispatch(currentMenu('unapproved'));
            setShowUnApprovedPost(true);
            setShowPostList(false);
            setShowCreatePost(false);
            setShowStatisticsPost(false)

        } else if (i === 2) {
            dispatch(currentMenu('create-post'));
            setShowUnApprovedPost(false);
            setShowPostList(false);
            setShowStatisticsPost(false)
            setShowCreatePost(true);
        }
        else if (i === 3) {
            dispatch(currentMenu('statistics-post'));
            setShowUnApprovedPost(false);
            setShowPostList(false);
            setShowCreatePost(false);
            setShowStatisticsPost(true)
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('menu')}>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={cx('menu-link')}
                        onClick={() => handleOnClickMenuItem(index)}
                    >
                        <span
                            className={cx(
                                'menu-item',
                                currentIndex === index && 'active',
                            )}
                        >
                            {item.title}
                        </span>
                    </div>
                ))}
            </div>
            {showPostList && <AdminPostList />}
            {showUnApprovedPost && <UnApprovedPost />}
            {showCreatePost && <CreatePost />}
            {showStatisticsPost && <PostStatistics />}
        </div>
    );
}

export default AdminPostManagement;
