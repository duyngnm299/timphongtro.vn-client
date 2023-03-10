import React from 'react';
import classNames from 'classnames/bind';
import styles from './AdminLogin.module.scss';
import Button from '~/components/Button';
import config from '~/config';
import { FiLock } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { adminLogin } from '~/api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import {
    adminLoginSuccess,
    rememberAccountAdmin,
} from '~/redux/slice/adminSlice';
import images from '~/assets/images';
import Loading from '~/components/Loading';
// import GoogleLogin from 'react-google-login';
const cx = classNames.bind(styles);

function AdminLogin() {
    const rmbUsername = useSelector(
        (state) => state.admin.rememberAccount?.username,
    );
    const rmbPassword = useSelector(
        (state) => state.admin.rememberAccount?.password,
    );

    const [username, setUsername] = useState(rmbUsername ? rmbUsername : '');
    const [password, setPassword] = useState(rmbPassword ? rmbPassword : '');
    const [message, setMessage] = useState(false);
    const [rememberChecked, setRememberChecked] = useState(
        rmbUsername ? true : false,
    );
    const [showPassword, setShowPassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUsernameChange = (value) => {
        setUsername(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: username,
            password: password,
        };
        if (!username || !password || password.length < 8) {
            setMessage(true);
            return;
        }
        setShowLoading(true);
        try {
            adminLogin(user).then((res) => {
                if (res?.response?.data?.message === "User don't exist!") {
                    alert(
                        '????ng nh???p th???t b???i',
                        'error',
                        'T??n t??i kho???n kh??ng t???n t???i!',
                    );
                    setShowLoading(false);
                    return;
                }
                if (res?.response?.data?.message === 'Incorrect password!') {
                    alert(
                        '????ng nh???p th???t b???i',
                        'error',
                        'M???t kh???u kh??ng ch??nh x??c',
                    );
                    setShowLoading(false);
                    return;
                }
                if (res?.response?.data?.message === 'You are not an admin') {
                    alert(
                        '????ng nh???p th???t b???i',
                        'error',
                        'B???n kh??ng ph???i l?? qu???n tr??? vi??n!',
                    );
                    setShowLoading(false);
                    return;
                }
                console.log(res);
                setShowLoading(false);
                alert(
                    '????ng nh???p th??nh c??ng',
                    'success',
                    `Ch??o m???ng ${username} ?????n v???i website Timphongtro.vn!`,
                );
                dispatch(adminLoginSuccess(res));
                if (rememberChecked) {
                    dispatch(rememberAccountAdmin([username, password]));
                } else {
                    dispatch(rememberAccountAdmin());
                }
            });
        } catch (error) {
            // console.log(error.response.data.message);
        }
    }
    // Alert Success
    const alert = (title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">X??c nh???n</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then((result) => {
            if (result.isConfirmed && type === 'success') {
                navigate(config.routes.admin);
            }
        });
    };

    const handleRememberAccount = () => {
        setRememberChecked(!rememberChecked);
    };
    console.log(rememberChecked);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content-wrapper')}>
                <div className={cx('content')}>
                    {showLoading && <Loading />}
                    <div className={cx('picture')}>
                        <div className={cx('logo')}>
                            <img
                                src={images.logo}
                                alt="logo"
                                className={cx('logo-img')}
                            />
                        </div>
                        <div className={cx('img-below')}>
                            <img
                                src={images.imgLogin}
                                alt="imgLogin"
                                className={cx('imgLogin')}
                            />
                        </div>
                        <span className={cx('text-login')}>
                            Timphongtro.vn d???n l???i
                        </span>
                    </div>

                    <div className={cx('auth')}>
                        <h4 className={cx('welcome')}>Trang ????ng nh???p</h4>
                        <h1 className={cx('title')}>D??nh cho qu???n tr??? vi??n</h1>
                        <form className="form-login">
                            <div className={cx('input-wrapper')}>
                                <div className={cx('input-icon')}>
                                    <AiOutlineUser />
                                </div>
                                <input
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                    value={username}
                                    className={cx(
                                        'input',
                                        !username && message && 'invalid',
                                    )}
                                    type="text"
                                    placeholder="T??n t??i kho???n ho???c email"
                                    onChange={(e) => {
                                        handleUsernameChange(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={cx('input-wrapper')}>
                                <div className={cx('input-icon')}>
                                    <FiLock />
                                </div>
                                <input
                                    value={password}
                                    className={cx(
                                        'input',
                                        !password && message && 'invalid',
                                    )}
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="M???t kh???u"
                                    onChange={(e) => {
                                        handlePasswordChange(e.target.value);
                                    }}
                                />
                                {!showPassword ? (
                                    <div
                                        className={cx('show-pass')}
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <AiOutlineEye />
                                    </div>
                                ) : (
                                    <div
                                        className={cx('show-pass')}
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <AiOutlineEyeInvisible />
                                    </div>
                                )}
                            </div>
                            {message && (
                                <span className={cx('message')}>
                                    {!username || !password
                                        ? 'T??i kho???n ho???c m???t kh???u kh??ng ???????c ????? tr???ng!'
                                        : password.length > 0 &&
                                          password.length < 8
                                        ? 'M???t kh???u ph???i c?? ??t nh???t 8 k?? t???'
                                        : ''}
                                </span>
                            )}
                            <Button
                                type="submit"
                                primary
                                className={cx('login-btn')}
                                onClick={handleSubmit}
                            >
                                ????ng nh???p
                            </Button>
                        </form>
                        <div className={cx('remember-forgot')}>
                            <div className={cx('remember')}>
                                <input
                                    className={cx('checkbox')}
                                    type="checkbox"
                                    name="rememberAccount"
                                    id="rememberAccount"
                                    checked={rememberChecked}
                                    onChange={handleRememberAccount}
                                />
                                <label
                                    htmlFor="rememberAccount"
                                    className={cx('remember-text')}
                                >
                                    Nh??? t??i kho???n
                                </label>
                            </div>
                            <Link to={config.routes.adminForgotPassword}>
                                <div className={cx('forgot')}>
                                    <span className={cx('forgot-text')}>
                                        Qu??n m???t kh???u?
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className={cx('or')}>
                            <div className={cx('line')}></div>
                            <div className={cx('or-text')}>
                                <div className={cx('text')}>Ho???c</div>
                            </div>
                        </div>

                        <div className={cx('register-text')}>
                            <span className={cx('nm-text')}>
                                Ch??a c?? t??i kho???n?
                                <Link to={config.routes.adminRegister}>
                                    <span className={cx('hl-text')}>
                                        {' '}
                                        ????ng k??{' '}
                                    </span>
                                </Link>
                                t???i ????y
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
