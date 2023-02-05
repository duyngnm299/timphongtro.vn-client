import classNames from 'classnames/bind';
import styles from './DetailDescribe.module.scss';
import ImageSlider from '~/components/ImageSlider';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { BiArea, BiDollarCircle } from 'react-icons/bi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { TbBed, TbSofa } from 'react-icons/tb';
import { MdApartment } from 'react-icons/md';
import { GrRestroom } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import Mapbox from '~/components/Mapbox';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineReportProblem, MdReportProblem } from 'react-icons/md';
import { savedPostItemChange } from '~/redux/slice/postSlice';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    updateUserSavePost,
    deleteSavePost,
    getUser,
    createReportedPost,
    deletedReportedPost,
    updateUserReportedPost,
    deleteReportedPostOfUser,
    getReportedByPostId,
} from '~/api';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as HeartIcon } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const cx = classNames.bind(styles);
const selectionItems = [
    { text: 'Địa chỉ bài đăng', isChecked: false },
    { text: 'Các thông tin về: giá, diện tích, mô tả ...', isChecked: false },
    { text: 'Trùng với tin rao khác', isChecked: false },
    { text: 'Không liên lạc được', isChecked: false },
    { text: 'Tin không có thật', isChecked: false },
];
function DetailDescribe() {
    const currentUser = useSelector(
        (state) => state.auth?.login?.currentUser?.user,
    );
    const removed = useSelector((state) => state.post?.removed);
    const crPost = useSelector((state) => state.post?.post?.currentPost);
    const des = crPost?.describe && JSON.parse(crPost?.describe);
    const dispatch = useDispatch();
    const [savedPost, setSavedPost] = useState(false);
    const [showModalReport, setShowModalReport] = useState(false);
    const [describeReport, setDescribeReport] = useState('');
    const [listItemChecked, setListItemChecked] = useState([]);
    const [fullName, setFullName] = useState(currentUser?.fullName || '');
    const [phoneNumber, setPhoneNumber] = useState(
        currentUser?.phoneNumber || '',
    );
    const [email, setEmail] = useState(currentUser?.email || '');
    const [submitReport, setSubmitReport] = useState(false);
    const [idReported, setIdReported] = useState('');
    const [reported, setReported] = useState(false);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    const alert = (title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">Xác nhận</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        });
    };
    useEffect(() => {
        currentUser &&
            getUser(currentUser?._id).then((res) => {
                let temp = res.user.savedPost.some(
                    (item) => item._id === crPost._id,
                );
                if (temp) {
                    return setSavedPost(true);
                } else {
                    return setSavedPost(false);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (savedPost) {
            const data = JSON.stringify({ saved: crPost });
            currentUser &&
                updateUserSavePost(currentUser?._id, data).then((res) => {
                    dispatch(savedPostItemChange());
                    console.log(res);
                });
        } else {
            const data = crPost && JSON.stringify({ postId: crPost._id });
            currentUser &&
                deleteSavePost(currentUser?._id, data).then((res) => {
                    dispatch(savedPostItemChange());
                    console.log(res);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedPost]);
    useEffect(() => {
        if (removed.postId === crPost?._id) {
            setSavedPost(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removed.isRemove]);

    useEffect(() => {
        getUser(currentUser?._id).then((res) => {
            if (res?.user?.reportedPost.length) {
                let result = res?.user?.reportedPost?.find(
                    (item) => item?._id === crPost?._id,
                );
                if (result) {
                    setReported(true);
                }
            }
        });
        getReportedByPostId(crPost?._id).then((res) => {
            let temp = res?.reported.filter(
                (item) => item?.createdBy === currentUser?._id,
            );
            console.log(temp);
            setIdReported(temp[0]?._id);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const data = {
            idPost: crPost?._id,
            postCode: crPost?.postCode,
            titlePost: crPost?.title,
            descReport: listItemChecked,
            createdBy: currentUser?._id,
            userFullName: fullName,
            userEmail: email,
            userPhoneNumber: phoneNumber,
        };
        listItemChecked.length &&
            createReportedPost(data).then((res) => {
                setIdReported(res?.reported?._id);
                updateUserReportedPost(currentUser?._id, crPost);
                setShowModalReport(false);
                alert(
                    'Báo cáo thành công',
                    'success',
                    'Chúng tôi đã nhận được báo cáo của bạn và sẽ xử lý sớm nhất có thể.',
                );
                setListItemChecked([]);
                setDescribeReport('');
                setReported(true);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitReport]);
    console.log('id reported: ', idReported);
    const handleSavePost = () => {
        if (!currentUser) {
            alert(
                'Lưu tin không thành công',
                'error',
                'Vui lòng đăng nhập để lưu tin!',
            );
            return;
        }
        setSavedPost(!savedPost);
    };

    const handleReportPost = () => {
        if (!currentUser) {
            alert(
                'Báo cáo không thành công',
                'error',
                'Vui lòng đăng nhập để báo cáo!',
            );
            return;
        }
        setShowModalReport(true);
    };
    const handleCloseModal = () => {
        setShowModalReport(false);
        setListItemChecked([]);
        setDescribeReport('');
    };
    const handleChangeDescribeReport = (e) => {
        setDescribeReport(e.target.value);
    };

    const handleChangeSelection = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setListItemChecked((prev) => [...prev, value]);
        } else {
            const arr = listItemChecked.filter((item) => item !== value);
            setListItemChecked(arr);
        }
    };

    const handleSubmitReport = () => {
        if (!describeReport && !listItemChecked.length) {
            alert(
                'Báo cáo tin đăng không thành công',
                'error',
                'Vui lòng nhập nội dung báo cáo!',
            );
            setShowModalReport(false);
            return;
        }
        describeReport &&
            setListItemChecked((prev) => [...prev, describeReport]);
        setSubmitReport(!submitReport);
    };
    const handleUnReportPost = () => {
        const data = JSON.stringify({ postId: crPost?._id });
        deleteReportedPostOfUser(currentUser?._id, data).then((res) =>
            console.log(res),
        );
        deletedReportedPost(idReported).then((res) => {
            console.log(res);
            setReported(false);
        });
    };
    return (
        <div className={cx('detail-content')}>
            <div className={cx('image-slider')}>
                {crPost && (
                    <ImageSlider
                        slides={crPost?.images}
                        imgBottom={true}
                        className={cx('slider-detail-post')}
                    />
                )}
            </div>
            <div className={cx('detail-describe')}>
                <div className={cx('header')}>
                    <div className={cx('title-container')}>
                        <h1 className={cx('title')}>{crPost?.title}</h1>
                        <p className={cx('sub-title')}>
                            {`${crPost?.ward}, ${crPost?.district}, ${crPost?.province}`}
                        </p>
                    </div>
                    <div className={cx('info')}>
                        <div className={cx('left-info')}>
                            <div className={cx('left-info-item')}>
                                <p className={cx('left-info-item-title')}>
                                    Mức giá
                                </p>
                                <p className={cx('left-info-item-text')}>
                                    {crPost?.price &&
                                        `${parseFloat(
                                            formatCash(
                                                crPost?.price?.toString(),
                                            ),
                                        ).toFixed(1)} triệu`}
                                </p>
                            </div>
                            <div className={cx('left-info-item')}>
                                <p className={cx('left-info-item-title')}>
                                    Diện tích
                                </p>
                                <p className={cx('left-info-item-text')}>
                                    {crPost?.area} m²
                                </p>
                            </div>
                            {des?.bedroom > 0 && (
                                <div className={cx('left-info-item')}>
                                    <p className={cx('left-info-item-title')}>
                                        Phòng ngủ
                                    </p>
                                    <p className={cx('left-info-item-text')}>
                                        {des?.bedroom} PN
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className={cx('right-info')}>
                            {crPost?.createdBy[0] !== currentUser?._id ? (
                                reported ? (
                                    <Tippy
                                        content="Hủy báo xấu"
                                        delay={(0, 200)}
                                        placement="top"
                                    >
                                        <div
                                            className={cx('report')}
                                            onClick={handleUnReportPost}
                                        >
                                            <MdReportProblem
                                                className={cx('icon-report')}
                                            />
                                        </div>
                                    </Tippy>
                                ) : (
                                    <Tippy
                                        content="Báo xấu tin đăng"
                                        delay={(0, 200)}
                                        placement="top"
                                    >
                                        <div
                                            className={cx('report')}
                                            onClick={handleReportPost}
                                        >
                                            <MdOutlineReportProblem
                                                className={cx('icon-report')}
                                            />
                                        </div>
                                    </Tippy>
                                )
                            ) : (
                                <div
                                    className={cx('saved-disabled')}
                                    onClick={handleReportPost}
                                >
                                    <MdOutlineReportProblem
                                        className={cx('disabled')}
                                    />
                                </div>
                            )}

                            <Tippy
                                content="Lưu tin"
                                delay={(0, 200)}
                                placement="top"
                            >
                                {crPost?.createdBy[0] !== currentUser?._id ? (
                                    <div
                                        className={cx('saved')}
                                        onClick={handleSavePost}
                                    >
                                        {savedPost ? (
                                            <FontAwesomeIcon
                                                icon={HeartIcon}
                                                className={cx('icon-saved')}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                className={cx(
                                                    'icon-saved',
                                                    crPost?.createdBy[0] ===
                                                        currentUser?._id &&
                                                        'disabled',
                                                )}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className={cx('saved-disabled')}
                                        onClick={handleSavePost}
                                    >
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className={cx('disabled')}
                                        />
                                    </div>
                                )}
                            </Tippy>
                        </div>
                    </div>
                </div>
                <div className={cx('info-describe')}>
                    <h4 className={cx('title-info-describe')}>
                        Thông tin mô tả
                    </h4>
                    <div className={cx('detail-info-describe')}>
                        {des?.describe}
                    </div>
                </div>

                <div className={cx('features-describe')}>
                    <h4 className={cx('title-features-describe')}>
                        Đặc điểm bất động sản
                    </h4>
                    <p className={cx('post-type')}>
                        Loại tin đăng: Cho thuê{' '}
                        {crPost && crPost.category_name.toLocaleLowerCase()}
                    </p>
                    <div className={cx('details-features-describe')}>
                        <div className={cx('row-item', 'row-item-left')}>
                            <span className={cx('icon-container')}>
                                <BiArea className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>Diện tích</span>
                            <span className={cx('text-value')}>
                                {crPost?.area} m²
                            </span>
                        </div>
                        <div className={cx('row-item')}>
                            <span className={cx('icon-container')}>
                                <BiDollarCircle className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>Mức giá</span>
                            <span className={cx('text-value')}>
                                {crPost?.price &&
                                    `${parseFloat(
                                        formatCash(crPost?.price?.toString()),
                                    ).toFixed(1)} triệu/tháng`}
                            </span>
                        </div>
                        {des?.bedroom > 0 && (
                            <div className={cx('row-item', 'row-item-left')}>
                                <span className={cx('icon-container')}>
                                    <TbBed className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Số phòng ngủ
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.bedroom} phòng
                                </span>
                            </div>
                        )}
                        {des?.restroom > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <GrRestroom className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Số toilet
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.restroom} phòng
                                </span>
                            </div>
                        )}
                        {des?.floor > 0 && (
                            <div className={cx('row-item', 'row-item-left')}>
                                <span className={cx('icon-container')}>
                                    <MdApartment className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Số tầng
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.floor} tầng
                                </span>
                            </div>
                        )}
                        {des?.furniture > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <TbSofa className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Nội thất
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.furniture}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('map')}>
                <h4 className={cx('title-info-describe')}>Xem trên bản đồ</h4>
                <Mapbox
                    className={cx('mapbox-details-post')}
                    searchAddress={crPost?.address}
                />
            </div>
            {showModalReport && (
                <div className={cx('modal')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <span className={cx('modal-header-title')}>
                                Báo cáo tin đăng có thông tin không đúng
                            </span>
                            <IoCloseOutline
                                className={cx('close')}
                                onClick={handleCloseModal}
                            />
                        </div>
                        <div className={cx('modal-body')}>
                            <span className={cx('body-title')}>Lý do</span>
                            <div className={cx('selection')}>
                                {selectionItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={cx('selection-item')}
                                    >
                                        <input
                                            value={item.text}
                                            name={index}
                                            type="checkbox"
                                            id={`selection-input${index}`}
                                            className={cx('checkbox')}
                                            onChange={handleChangeSelection}
                                        />
                                        <label
                                            htmlFor={`selection-input${index}`}
                                            className={cx('label')}
                                        >
                                            {item.text}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className={cx('more-report')}>
                                <span className={cx('more-report-title')}>
                                    Phản hồi khác
                                </span>
                                <textarea
                                    value={describeReport}
                                    className={cx('more-report-text')}
                                    placeholder="Nhập nội dung"
                                    onChange={handleChangeDescribeReport}
                                ></textarea>
                            </div>
                            <div className={cx('info-reporter')}>
                                <span className={cx('more-report-title')}>
                                    Thông tin của bạn
                                </span>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        value={fullName}
                                        type="text"
                                        placeholder="Họ và tên"
                                        className={cx('input-reporter')}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                    />
                                    {fullName && (
                                        <FontAwesomeIcon
                                            icon={faCircleXmark}
                                            className={cx('deleted-text')}
                                            onClick={() => setFullName('')}
                                        />
                                    )}
                                </div>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        value={phoneNumber}
                                        type="number"
                                        placeholder="Số điện thoại"
                                        className={cx('input-reporter')}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                    {phoneNumber && (
                                        <FontAwesomeIcon
                                            icon={faCircleXmark}
                                            className={cx('deleted-text')}
                                            onClick={() => setPhoneNumber('')}
                                        />
                                    )}
                                </div>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        value={email}
                                        type="email"
                                        placeholder="Email"
                                        className={cx('input-reporter')}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    {email && (
                                        <FontAwesomeIcon
                                            icon={faCircleXmark}
                                            className={cx('deleted-text')}
                                            onClick={() => setEmail('')}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={cx('footer')}>
                            <button
                                className={cx('btn-submit')}
                                onClick={handleSubmitReport}
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailDescribe;
