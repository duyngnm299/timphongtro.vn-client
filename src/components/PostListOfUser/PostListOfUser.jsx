import classNames from 'classnames/bind';
import styles from './PostListOfUser.module.scss';
import images from '~/assets/images';
import { BiPhoneCall } from 'react-icons/bi';
import { getPostListOfUser, getUser } from '~/api';
import { Link } from 'react-router-dom';
import config from '~/config';
import { useDispatch, useSelector } from 'react-redux';
import { currentPost } from '~/redux/slice/postSlice';
import ImageSlider from '../ImageSlider';
import Button from '../Button';
import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import Footer from '~/layouts/components/Footer';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

const cx = classNames.bind(styles);
function PostListOfUser() {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const crPost = useSelector(
        (state) => state.post?.post?.currentPost?.createdBy[0],
    );
    const [allPost, setAllPost] = useState([]);
    const [savePost, setSavePost] = useState({});
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState([]);
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);

    console.log(totalPage);
    const limit = 8;
    useEffect(() => {
        getUser(crPost).then((res) => setUser(res.user));
        getPostListOfUser(`createdBy=${crPost}`)
            .then((res) => {
                console.log(res.pagination);
                setTotalPage(Math.ceil(res?.pagination?.total / limit));
                setAllPost(res?.post);
                if (currentUser?._id) {
                    getUser(currentUser._id).then((res) => {
                        res?.user?.savedPost.filter((item) =>
                            setSavePost({ ...savePost, [item._id]: true }),
                        );
                    });
                }
            })
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnClick = (item) => {
        dispatch(currentPost(item));
    };

    const handleOnClickMore = () => {
        let nextPage = currentPage + 1;
        if (totalPage - nextPage >= 0) {
            getPostListOfUser(`createdBy=${crPost}&page=${nextPage}`).then(
                (res) =>
                    res?.post.map((item) =>
                        setAllPost((prevState) => [...prevState, item]),
                    ),
            );
            setCurrentPage(nextPage);
            return;
        }
        if (totalPage - nextPage < 0) {
            getPostListOfUser(`createdBy=${crPost}`).then((res) =>
                setAllPost(res?.post),
            );
            setCurrentPage(1);
            return;
        }
    };
    const currentDate = new Date();
    const date_diff_indays = function (date1, date2) {
        const dt1 = new Date(date1);
        const dt2 = new Date(date2);
        return Math.floor(
            (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
                (1000 * 60 * 60 * 24),
        );
    };
    const handleDate = (createdAt) => {
        const createdDate = new Date(createdAt);
        const result = date_diff_indays(createdDate, currentDate);
        const a = Math.floor(result / 30);
        if (result === 0) {
            return 'Hôm nay';
        }
        if (a < 1) {
            return result + ' ngày trước';
        }
        if (a > 12 && a < 24) {
            return '1 năm trước';
        }
        if (a >= 24) {
            return '2 năm trước';
        }

        if (a > 1 && a < 12) {
            return a + ' tháng trước';
        }
    };

    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + ',') + prev;
            });
    };

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
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('info')}>
                    <div className={cx('left')}>
                        <div className={cx('avatar')}>
                            <img
                                src={
                                    user?.profilePicture
                                        ? `${HOST_NAME}/${user?.profilePicture}`
                                        : images.defaultAvt
                                }
                                alt=""
                                className={cx('avatar-img')}
                            />
                        </div>
                        <span className={cx('full-name')}>
                            {user?.fullName || user?.username}
                        </span>
                    </div>
                    <div className={cx('right')}>
                        <div
                            className={cx('phone')}
                            onClick={() => setShowPhoneNumber(true)}
                        >
                            <BiPhoneCall className={cx('icon')} />

                            <span>
                                {user?.phoneNumber
                                    ? showPhoneNumber
                                        ? formatNumber(user?.phoneNumber)
                                        : formatNumber(
                                              user?.phoneNumber,
                                              true,
                                          ) + ' · Hiện số'
                                    : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cx('post-list')}>
                    <h2 className={cx('heading')}>Danh sách tin đăng</h2>
                    <div className={cx('post-container')}>
                        {allPost?.map((item, index) => (
                            <Link
                                key={index}
                                to={config.routes.detailPage + `/${item._id}`}
                            >
                                <div
                                    className={cx('post-item')}
                                    onClick={() => handleOnClick(item)}
                                >
                                    <div className={cx('image-container')}>
                                        <ImageSlider
                                            className={cx('show-post-slider')}
                                            slides={item && item.images}
                                            showPost={true}
                                        />
                                    </div>
                                    <div className={cx('describe')}>
                                        <p className={cx('title')}>
                                            {item.title}
                                        </p>
                                        <div className={cx('price-area')}>
                                            <span className={cx('price')}>
                                                {formatCash(`${item.price}`)}{' '}
                                            </span>
                                            <span className={cx('unit')}>
                                                VND
                                            </span>
                                            <span className={cx('dot')}>·</span>
                                            <span className={cx('area')}>
                                                {item.area}
                                            </span>
                                            <span className={cx('unit')}>
                                                m²
                                            </span>
                                        </div>
                                        <p className={cx('address')}>
                                            {`${item?.district}, ${item?.province}`}
                                        </p>
                                        <div className={cx('date-save')}>
                                            <p className={cx('date')}>
                                                {handleDate(item.createdAt)}
                                            </p>

                                            <p className={cx('save')}>
                                                {item.postType}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {totalPage > 1 && (
                        <div className={cx('more-post')}>
                            <Button
                                className={cx('more-btn')}
                                outline
                                rightIcon={
                                    totalPage > currentPage ? (
                                        <MdKeyboardArrowDown />
                                    ) : (
                                        <MdKeyboardArrowUp />
                                    )
                                }
                                more={true}
                                onClick={handleOnClickMore}
                            >
                                {totalPage > currentPage
                                    ? 'Mở rộng'
                                    : 'Thu gọn'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    );
}

export default PostListOfUser;
