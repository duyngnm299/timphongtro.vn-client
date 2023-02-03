import classNames from 'classnames/bind';
import styles from './PostStatistics.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useRef, useState } from 'react';
import Chart from '../../../HomeAdmin/components/Chart';
import { useEffect } from 'react';
import {
    filterPostByCategory,
    filterPostByDate,
    filterPostByDistrict,
    filterPostByMonth,
} from '~/api';

const cx = classNames.bind(styles);

function PostStatistics() {
    const selectionItems = [
        'Theo ngày',
        'Theo tháng',
        'Theo khu vực',
        'Theo thể loại',
    ];
    const [selectionInputValue, setSelectionInputValue] = useState('Theo ngày');
    const [showSelection, setShowSelection] = useState(false);
    const [listPost, setListPost] = useState([]);
    const selectionRef = useRef();
    useEffect(() => {
        if (selectionInputValue === 'Theo ngày') {
            filterPostByDate().then((res) => {
                setListPost(res);
            });
            return;
        }
        if (selectionInputValue === 'Theo tháng') {
            filterPostByMonth().then((res) => setListPost(res?.result));
            return;
        }
        if (selectionInputValue === 'Theo khu vực') {
            filterPostByDistrict().then((res) => setListPost(res?.result));
            return;
        }
        if (selectionInputValue === 'Theo thể loại') {
            filterPostByCategory().then((res) => setListPost(res?.result));
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (selectionInputValue === 'Theo ngày') {
            filterPostByDate().then((res) => {
                setListPost(res);
            });
            return;
        }
        if (selectionInputValue === 'Theo tháng') {
            filterPostByMonth().then((res) => setListPost(res?.result));
            return;
        }
        if (selectionInputValue === 'Theo khu vực') {
            filterPostByDistrict().then((res) => setListPost(res?.result));
            return;
        }
        if (selectionInputValue === 'Theo thể loại') {
            filterPostByCategory().then((res) => setListPost(res?.result));
            return;
        }
    }, [selectionInputValue]);

    const handleClickOutside = (e) => {
        const { target } = e;
        if (selectionRef.current === null) {
            setShowSelection(false);
            return;
        }
        if (selectionRef.current === undefined) {
            setShowSelection(false);
            return;
        }
        if (!selectionRef.current.contains(target)) {
            setShowSelection(false);
            return;
        }
    };
    return (
        <div className={cx('wrapper')} onClick={handleClickOutside}>
            <div className={cx('content')}>
                <div className={cx('selection')}>
                    <label htmlFor="input">Số lượng bài viết</label>
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
                    title="Số lượng bài viết"
                    data={listPost}
                    dataKey="count"
                    name="_id"
                />
            </div>
        </div>
    );
}

export default PostStatistics;
