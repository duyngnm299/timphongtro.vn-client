import classNames from 'classnames/bind';
import styles from './Contact.module.scss';
import images from '~/assets/images';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { createConversation, getPostListOfUser, getUser } from '~/api';
import config from '~/config';
import { currentConversation } from '~/redux/slice/messageSlice';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Contact() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );

    const crPost = useSelector(
        (state) => state.post?.post?.currentPost?.createdBy[0],
    );

    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const [listPostOfUser, setListPostOfUser] = useState([]);
    const [totalPost, setTotalPost] = useState(0);
    const [userPost, setUserpost] = useState('');
    console.log(totalPost);
    useEffect(() => {
        crPost && getUser(crPost).then((res) => setUserpost(res.user));
        crPost &&
            getPostListOfUser(`createdBy=${crPost}`).then((res) => {
                setTotalPost(res.pagination.total);
                setListPostOfUser(res.post);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function formatNumber(entry = '', hide = false) {
        const match = entry
            .replace(/\D+/g, '')
            .replace(/^1/, '')
            .match(/([^\d]*\d[^\d]*){1,10}$/)[0];
        const part1 = match.length > 2 ? `${match.substring(0, 4)}` : match;
        const part2 = match.length > 3 ? ` ${match.substring(4, 7)}` : '';
        const part3 =
            match.length > 6
                ? hide
                    ? ` ***`
                    : ` ${match.substring(7, 10)}`
                : '';
        return `${part1}${part2}${part3}`;
    }
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
        });
    };
    const handleSendMessage = () => {
        if (!currentUser) {
            alert(
                'Bạn chưa đăng nhập',
                'error',
                'Vui lòng đăng nhập để gửi tin nhắn!',
            );
            return;
        }
        if (crPost === currentUser?._id) {
            return;
        }
        const data = { senderId: currentUser?._id, receiverId: crPost };
        currentUser &&
            createConversation(data).then((res) => {
                dispatch(currentConversation(res.savedConversation));
                navigate('/tat-ca-tin-nhan');
            });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('contact')}>
                <div className={cx('avatar')}>
                    <Link to={config.routes.postListOfUser + `/${crPost}`}>
                        <img
                            src={
                                userPost?.profilePicture
                                    ? HOST_NAME + userPost?.profilePicture
                                    : images.defaultAvt
                            }
                            alt=""
                            className={cx('avatar-img')}
                        />
                    </Link>
                </div>
                <div className={cx('created-by')}>
                    <span className={cx('text')}>Được đăng bởi</span>
                    <Link to={config.routes.postListOfUser + `/${crPost}`}>
                        <p className={cx('username')}>
                            {userPost?.fullName || userPost?.username}
                        </p>
                        {listPostOfUser.length > 1 && (
                            <p className={cx('see-more')}>
                                Xem thêm {totalPost} tin khác
                            </p>
                        )}
                    </Link>
                </div>
                <div className={cx('info-contact')}>
                    <div
                        className={cx('contact-phone')}
                        onClick={() => setShowPhoneNumber(true)}
                    >
                        <span className={cx('phone')}>
                            {userPost?.phoneNumber
                                ? showPhoneNumber
                                    ? formatNumber(userPost?.phoneNumber)
                                    : formatNumber(
                                          userPost?.phoneNumber,
                                          true,
                                      ) + ' · Hiện số'
                                : 'Chưa cập nhật'}
                        </span>
                    </div>
                    <div
                        // to={config.routes.message}
                        className={cx(
                            'contact-email',
                            crPost && crPost === currentUser?._id && 'disabled',
                        )}
                    >
                        <span
                            className={cx('email')}
                            onClick={handleSendMessage}
                        >
                            Gửi tin nhắn
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
