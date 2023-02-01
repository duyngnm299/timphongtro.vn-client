import classNames from 'classnames/bind';
import styles from './MemberStatistics.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useState } from 'react';
import Chart from '../../../HomeAdmin/components/Chart';
import { useEffect } from 'react';
import { filterUserByDate, filterUserByMonth } from '~/api';

const cx = classNames.bind(styles);

function MemberStatistics() {
    const selectionItems = ['Theo ngày', 'Theo tháng'];
    const [selectionInputValue, setSelectionInputValue] = useState('Theo ngày');
    const [showSelection, setShowSelection] = useState(false);
    const [listPost, setListPost] = useState([]);
    useEffect(() => {
        if (selectionInputValue === 'Theo ngày') {
            filterUserByDate().then((res) => {
                setListPost(res);
            });
            return;
        }
        if (selectionInputValue === 'Theo tháng') {
            filterUserByMonth().then((res) => setListPost(res?.result));
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (selectionInputValue === 'Theo ngày') {
            filterUserByDate().then((res) => {
                setListPost(res);
            });
            return;
        }
        if (selectionInputValue === 'Theo tháng') {
            filterUserByMonth().then((res) => setListPost(res?.result));
            return;
        }
    }, [selectionInputValue]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('selection')}>
                    <label htmlFor="input">Số lượng thành viên</label>
                    <div className={cx('input-wrapper')}>
                        <input
                            type="text"
                            id="input"
                            className={cx('input-selection')}
                            value={selectionInputValue}
                            readOnly
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSelection(!showSelection);
                            }}
                        />
                        <MdOutlineKeyboardArrowDown
                            className={cx('icon-selection')}
                        />
                        {showSelection && (
                            <div className={cx('selection-list')}>
                                {selectionItems.map((item, index) => (
                                    <p
                                        className={cx('selection-item')}
                                        key={index}
                                        onClick={() => {
                                            setSelectionInputValue(item);
                                            setShowSelection(false);
                                        }}
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <Chart
                    title="Số lượng thành viên"
                    data={listPost}
                    dataKey="count"
                    name="_id"
                    member={true}
                />
            </div>
        </div>
    );
}

export default MemberStatistics;
