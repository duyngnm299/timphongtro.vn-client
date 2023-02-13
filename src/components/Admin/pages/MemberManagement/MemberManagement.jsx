import classNames from 'classnames/bind';
import styles from './MemberManagement.module.scss';
import UserList from './components/UserList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import AddUser from './components/addUser';
import { currentMenu } from '~/redux/slice/adminSlice';
import MemberStatistics from './components/MemberStatistics';
import Loading from '~/components/Loading';
const cx = classNames.bind(styles);

function MemberManagement() {
    const dispatch = useDispatch();
    const crMenu = useSelector((state) => state.admin.currentMenu?.menu);
    const loading = useSelector((state) => state.admin.loading?.current);
    console.log(loading);
    const [showUserList, setShowUserList] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showMemberStatistics, setShowMemberStatistics] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(
        (crMenu === 'list_user' && 0) || 0,
    );
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        if (loading === 'list_user') {
            setShowLoading(true);
        } else {
            setShowLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (loading !== 'list_user') {
            setShowLoading(false);
        }
    }, [loading]);
    useEffect(() => {
        setShowUserList(true);
        if (crMenu === 'list_user') {
            setCurrentIndex(0);
            setShowUserList(true);
            setShowAddUser(false);
            setShowMemberStatistics(false);
            return;
        }
        if (crMenu === 'add-user') {
            setCurrentIndex(1);
            setShowAddUser(true);
            setShowUserList(false);
            setShowMemberStatistics(false);
            return;
        }
        if (crMenu === 'statistics-member') {
            setCurrentIndex(2);
            setShowAddUser(false);
            setShowUserList(false);
            setShowMemberStatistics(true);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (crMenu === 'list_user') {
            setShowUserList(true);
            setShowAddUser(false);
            setCurrentIndex(0);
            setShowMemberStatistics(false);
            dispatch(currentMenu(null));
            return;
        }
        if (crMenu === 'add-user') {
            setShowAddUser(true);
            setShowUserList(false);
            setCurrentIndex(1);
            dispatch(currentMenu(null));
            setShowMemberStatistics(false);
            return;
        }
        if (crMenu === 'statistics-member') {
            setCurrentIndex(2);
            setShowAddUser(false);
            setShowUserList(false);
            setShowMemberStatistics(true);
            dispatch(currentMenu(null));
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crMenu]);

    const menuItems = [
        {
            title: 'Danh sách thành viên',
        },
        {
            title: 'Thêm thành viên mới',
        },
        {
            title: 'Thống kê',
        },
    ];
    const handleOnClickMenuItem = (index) => {
        setCurrentIndex(index);
        if (index === 0) {
            dispatch(currentMenu('list_user'));
            setShowUserList(true);
            setShowAddUser(false);
        } else if (index === 1) {
            dispatch(currentMenu('add-user'));
            setShowAddUser(true);
            setShowUserList(false);
        } else if (index === 2) {
            dispatch(currentMenu('statistics-member'));
            setShowAddUser(false);
            setShowUserList(false);
            setShowMemberStatistics(true);
        }
    };
    return (
        <div className={cx('wrapper')}>
            {showLoading && <Loading />}
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
            {showUserList && <UserList />}
            {showAddUser && <AddUser />}
            {showMemberStatistics && <MemberStatistics />}
        </div>
    );
}

export default MemberManagement;
