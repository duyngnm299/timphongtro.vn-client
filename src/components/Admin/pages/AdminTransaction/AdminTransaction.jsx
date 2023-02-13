import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '~/components/Loading';
import { currentMenu } from '~/redux/slice/adminSlice';
import styles from './AdminTransaction.module.scss';
import RevenueManagement from './components/RevenueManagement';
import TransactionList from './components/TransactionList';
const cx = classNames.bind(styles);
function AdminTransaction() {
    const dispatch = useDispatch();
    const crMenu = useSelector((state) => state.admin.currentMenu?.menu);
    const loading = useSelector((state) => state.admin.loading?.current);
    const [showTransactionList, setShowTransactionList] = useState(false);
    const [showRevenue, setShowRevenue] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(
        (crMenu === 'list_transaction' && 0) || 0,
    );
    const [showLoading, setShowLoading] = useState(false);
    useEffect(() => {
        if (loading === 'list_transaction') {
            setShowLoading(true);
        } else {
            setShowLoading(false);
        }
    }, []);
    useEffect(() => {
        if (loading !== 'list_transaction') {
            setShowLoading(false);
        }
    }, [loading]);
    console.log(crMenu);
    useEffect(() => {
        setShowTransactionList(true);
        if (crMenu === 'list_transaction') {
            setCurrentIndex(0);
            setShowTransactionList(true);
            setShowRevenue(false);

            return;
        }
        if (crMenu === 'revenue') {
            setCurrentIndex(1);
            setShowRevenue(true);
            setShowTransactionList(false);
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (crMenu === 'list_transaction') {
            setCurrentIndex(0);
            setShowTransactionList(true);
            setShowRevenue(false);

            return;
        }
        if (crMenu === 'revenue') {
            setCurrentIndex(1);
            setShowRevenue(true);
            setShowTransactionList(false);

            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crMenu]);
    const menuItems = [
        {
            title: 'Danh sách giao dịch',
        },
        {
            title: 'Thống kê',
        },
    ];
    const handleOnClickMenuItem = (index) => {
        setCurrentIndex(index);
        if (index === 0) {
            dispatch(currentMenu('list_transaction'));
            setShowTransactionList(true);
            setShowRevenue(false);
        } else if (index === 1) {
            dispatch(currentMenu('revenue'));
            setShowRevenue(true);
            setShowTransactionList(false);
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
            {showTransactionList && <TransactionList />}
            {showRevenue && <RevenueManagement />}
        </div>
    );
}

export default AdminTransaction;
