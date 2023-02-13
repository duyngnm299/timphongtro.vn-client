import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './NewUsers.module.scss';
import { AiFillEye } from 'react-icons/ai';
import { useEffect } from 'react';
import { getUserNewest } from '~/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { currentMenu, editedUser } from '~/redux/slice/adminSlice';
import config from '~/config';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function NewUsers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [listUser, setListUser] = useState([]);
    useEffect(() => {
        getUserNewest().then((res) => setListUser(res.result));
    }, []);

    const handleDetailUser = (item) => {
        dispatch(currentMenu('list_user'));
        dispatch(editedUser(item));
        navigate(config.routes.detailMember + `/${item._id}`);
    };
    return (
        <div className={cx('wrapper')}>
            <h4 className={cx('title')}>Thành viên mới</h4>
            <ul className={cx('new-user-list')}>
                {listUser?.length &&
                    listUser.map((item, index) => (
                        <li className={cx('new-user-item')} key={index}>
                            <div className={cx('info-container')}>
                                <img
                                    src={
                                        item?.profilePicture
                                            ? `${HOST_NAME}/${item?.profilePicture}`
                                            : images.defaultAvt
                                    }
                                    alt=""
                                    className={cx('avatar')}
                                />
                                <div className={cx('info')}>
                                    <span className={cx('username')}>
                                        {item?.fullName || item?.username}
                                    </span>
                                    <span className={cx('email')}>
                                        {item?.email}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={cx('see-info')}
                                onClick={() => handleDetailUser(item)}
                            >
                                <span className={cx('icon')}>
                                    <AiFillEye />
                                </span>
                                <span className={cx('text')}>Thông tin</span>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default NewUsers;
