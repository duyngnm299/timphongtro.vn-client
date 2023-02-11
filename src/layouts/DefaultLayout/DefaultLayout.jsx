import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import styles from './DefaultLayout.module.scss';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
const cx = classNames.bind(styles);
function DefaultLayout({ sk, children }) {
    const [arrivalMessage, setArrivalMessage] = useState([]);
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    useEffect(() => {
        currentUser &&
            sk &&
            sk?.current?.on('getMessage', (data) => {
                if (data && data?.receiverId === currentUser?._id) {
                    setArrivalMessage({
                        sender: data.senderId,
                        text: data.text,
                        seen: false,
                        createdAt: Date.now(),
                        receiver: data.receiverId,
                    });
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        currentUser &&
            sk &&
            sk?.current?.on('getMessage', (data) => {
                if (data && data?.receiverId === currentUser?._id) {
                    setArrivalMessage({
                        sender: data.senderId,
                        text: data.text,
                        seen: false,
                        createdAt: Date.now(),
                        receiver: data.receiverId,
                    });
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return (
        <div className={cx('wrapper')}>
            <Header arrivalMessage={arrivalMessage && arrivalMessage} />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
