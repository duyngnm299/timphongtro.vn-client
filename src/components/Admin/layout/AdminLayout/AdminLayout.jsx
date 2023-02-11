import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const cx = classNames.bind(styles);
function AdminLayout({ children, sk }) {
    console.log('[AdminSocket]: ', sk);
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <Sidebar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default AdminLayout;
