import classNames from 'classnames/bind';
import styles from './StatisticalSummary.module.scss';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import {
    filterAllTransactionByMonth,
    filterPostByMonth,
    filterUserByMonth,
} from '~/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { currentMenu } from '~/redux/slice/adminSlice';
import config from '~/config';
const cx = classNames.bind(styles);

function StatisticalSummary() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [listRevenue, setListRevenue] = useState([]);
    const [listNewUser, setListNewUser] = useState([]);
    const [listPost, setListPost] = useState([]);
    const [rateRevenue, setRateRevenue] = useState(0);
    const [rateNewUser, setRateNewUser] = useState(0);
    const [ratePost, setRatePost] = useState(0);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    useEffect(() => {
        filterAllTransactionByMonth().then((res) => setListRevenue(res.result));
        filterUserByMonth().then((res) => setListNewUser(res.result));
        filterPostByMonth().then((res) => setListPost(res.result));
    }, []);
    useEffect(() => {
        listRevenue.length &&
            setRateRevenue(
                ((listRevenue[listRevenue?.length - 1].totalTransaction -
                    listRevenue[listRevenue?.length - 2].totalTransaction) /
                    listRevenue[listRevenue?.length - 2].totalTransaction) *
                    100,
            );
    }, [listRevenue]);
    useEffect(() => {
        listNewUser.length &&
            setRateNewUser(
                ((listNewUser[listNewUser?.length - 1].count -
                    listNewUser[listNewUser?.length - 2].count) /
                    listNewUser[listNewUser?.length - 2].count) *
                    100,
            );
    }, [listNewUser]);
    useEffect(() => {
        listPost.length &&
            setRatePost(
                ((listPost[listPost?.length - 1]?.count -
                    listPost[listPost?.length - 2]?.count) /
                    listPost[listPost?.length - 2]?.count) *
                    100,
            );
    }, [listPost]);

    const handleOnClickRevenue = () => {
        dispatch(currentMenu('revenue'));
        navigate(config.routes.adminTransaction);
    };
    const handleOnClickMember = () => {
        dispatch(currentMenu('statistics-member'));
        navigate(config.routes.membermng);
    };
    const handleOnClickPost = () => {
        dispatch(currentMenu('statistics-post'));
        navigate(config.routes.adminPostMng);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('revenue')} onClick={handleOnClickRevenue}>
                    <p className={cx('title')}>Doanh thu</p>
                    <div className={cx('revenue-data')}>
                        <div className={cx('left')}>
                            <span className={cx('left-text')}>
                                {listRevenue.length &&
                                    parseFloat(
                                        formatCash(
                                            listRevenue[
                                                listRevenue.length - 1
                                            ].totalTransaction.toString(),
                                        ),
                                    ).toFixed(2)}
                            </span>
                            <span className={cx('unit')}>tri???u</span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('dot')}>??</span>
                            <span className={cx('right-text')}>
                                {rateRevenue.toFixed(2) + ' %'}
                            </span>
                            {rateRevenue > 0 ? (
                                <span className={cx('icon', 'up')}>
                                    <AiOutlineArrowUp />
                                </span>
                            ) : rateRevenue < 0 ? (
                                <span className={cx('icon', 'down')}>
                                    <AiOutlineArrowDown />
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <span className={cx('text')}>So v???i th??ng tr?????c</span>
                </div>
                <div className={cx('revenue')} onClick={handleOnClickMember}>
                    <p className={cx('title')}>S??? l?????ng th??nh vi??n m???i</p>
                    <div className={cx('revenue-data')}>
                        <div className={cx('left')}>
                            <span className={cx('left-text')}>
                                {listNewUser?.length &&
                                    listNewUser[listNewUser?.length - 1]?.count}
                            </span>
                            <span className={cx('unit')}>th??nh vi??n</span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('dot')}>??</span>
                            <span className={cx('right-text')}>
                                {rateNewUser.toFixed(2)} %
                            </span>
                            {rateNewUser > 0 ? (
                                <span className={cx('icon', 'up')}>
                                    <AiOutlineArrowUp />
                                </span>
                            ) : rateRevenue < 0 ? (
                                <span className={cx('icon', 'down')}>
                                    <AiOutlineArrowDown />
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <span className={cx('text')}>So v???i th??ng tr?????c</span>
                </div>
                <div className={cx('revenue')} onClick={handleOnClickPost}>
                    <p className={cx('title')}>S??? l?????ng b??i ????ng</p>
                    <div className={cx('revenue-data')}>
                        <div className={cx('left')}>
                            <span className={cx('left-text')}>
                                {listPost?.length &&
                                    listPost[listPost?.length - 1]?.count}
                            </span>
                            <span className={cx('unit')}>b??i ????ng</span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('dot')}>??</span>
                            <span className={cx('right-text')}>
                                {ratePost.toFixed(2)} %
                            </span>
                            {ratePost > 0 ? (
                                <span className={cx('icon', 'up')}>
                                    <AiOutlineArrowUp />
                                </span>
                            ) : rateRevenue < 0 ? (
                                <span className={cx('icon', 'down')}>
                                    <AiOutlineArrowDown />
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <span className={cx('text')}>So v???i th??ng tr?????c</span>
                </div>
            </div>
        </div>
    );
}

export default StatisticalSummary;
