import classNames from 'classnames/bind';
import styles from './HaveSidebarLayout.module.scss';
import Sidebar from '~/layouts/components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import config from '~/config';

const cx = classNames.bind(styles);

function HaveSidebarLayout({ children }) {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const udtUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser && !udtUser) {
            navigate(config.routes.login);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('side-bar')}>
                    <Sidebar />
                </div>
                <div className={cx('content')}>{children}</div>
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    );
}

export default HaveSidebarLayout;
