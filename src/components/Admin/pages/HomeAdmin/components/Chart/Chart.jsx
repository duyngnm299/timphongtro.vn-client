import classNames from 'classnames/bind';
import styles from './Chart.module.scss';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
const cx = classNames.bind(styles);

function Chart({ title, data, dataKey, name, revenue, member }) {
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };

    const formatterY = (item) => {
        const res = revenue
            ? `${formatCash(item.toString())} VND`
            : member
            ? Math.ceil(item) + ' thành viên'
            : item + ' bài';
        return res;
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h4 className={cx('title-text')}>{title}</h4>
            </div>
            <div className={cx('chart')}>
                <ResponsiveContainer width="100%" aspect={4 / 1}>
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 20,
                            bottom: 5,
                            left: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={name ? name : 'name'}
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            style={{ fontSize: '14px' }}
                            width={120}
                            stroke="black"
                            tickFormatter={formatterY}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke="#8884d8"
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Chart;
