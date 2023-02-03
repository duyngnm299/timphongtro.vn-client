import React from 'react';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import PostInfo from './PostInfo';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { currentMenu } from '~/redux/slice/menuSlice';
const cx = classNames.bind(styles);

function Post() {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (
            !currentUser?.fullName ||
            !currentUser?.phoneNumber ||
            !currentUser?.address
        ) {
            alert('Vui lòng cập nhật đầy đủ thông tin cá nhân!', 'error', '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const alert = (title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">Xác nhận</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(config.routes.profile + `/${currentUser?._id}`);
                dispatch(currentMenu('change_profile'));
            }
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <PostInfo />
            </div>
        </div>
    );
}

export default Post;
