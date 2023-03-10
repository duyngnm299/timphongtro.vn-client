import classNames from 'classnames/bind';
import styles from './PreviewDetailDescribe.module.scss';
import ImageSlider from '~/components/ImageSlider';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { BiArea, BiDollarCircle } from 'react-icons/bi';

import { TbBed, TbSofa } from 'react-icons/tb';
import { MdApartment } from 'react-icons/md';
import { GrRestroom } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import Mapbox from '~/components/Mapbox';

import { savedPostItemChange } from '~/redux/slice/postSlice';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserSavePost, deleteSavePost, getUser } from '~/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import {
    faHeart as HeartIcon,
    faExclamation,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function PreviewDetailDescribe() {
    const removed = useSelector((state) => state.post?.removed);
    const crPost = useSelector((state) => state.post?.previewPost?.post);
    const des = crPost?.describe && JSON.parse(crPost?.describe);
    const dispatch = useDispatch();
    const [savedPost, setSavedPost] = useState(false);
    const currentUser = useSelector(
        (state) => state.auth?.login?.currentUser?.user,
    );
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
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
    return (
        <div className={cx('detail-content')}>
            <div className={cx('image-slider')}>
                {crPost && (
                    <ImageSlider
                        slides={crPost?.images}
                        imgBottom={true}
                        className={cx('slider-detail-post')}
                        previewPost={true}
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
                                    M???c gi??
                                </p>
                                <p className={cx('left-info-item-text')}>
                                    {crPost?.price &&
                                        `${parseFloat(
                                            formatCash(
                                                crPost?.price?.toString(),
                                            ),
                                        ).toFixed(1)} tri???u`}
                                </p>
                            </div>
                            <div className={cx('left-info-item')}>
                                <p className={cx('left-info-item-title')}>
                                    Di???n t??ch
                                </p>
                                <p className={cx('left-info-item-text')}>
                                    {crPost?.area} m??
                                </p>
                            </div>
                            {des?.bedroom > 0 && (
                                <div className={cx('left-info-item')}>
                                    <p className={cx('left-info-item-title')}>
                                        Ph??ng ng???
                                    </p>
                                    <p className={cx('left-info-item-text')}>
                                        {des?.bedroom} PN
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className={cx('right-info')}>
                            <div className={cx('report')}>
                                <FontAwesomeIcon
                                    icon={faExclamation}
                                    className={cx('icon-report')}
                                />
                            </div>

                            <div className={cx('saved')}>
                                {savedPost ? (
                                    <FontAwesomeIcon
                                        icon={HeartIcon}
                                        className={cx('icon-saved')}
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className={cx('icon-saved')}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('info-describe')}>
                    <h4 className={cx('title-info-describe')}>
                        Th??ng tin m?? t???
                    </h4>
                    <div className={cx('detail-info-describe')}>
                        {des?.describe}
                    </div>
                </div>

                <div className={cx('features-describe')}>
                    <h4 className={cx('title-features-describe')}>
                        ?????c ??i???m b???t ?????ng s???n
                    </h4>
                    <p className={cx('post-type')}>
                        Lo???i tin ????ng: Cho thu??{' '}
                        {crPost && crPost.category_name.toLocaleLowerCase()}
                    </p>
                    <div className={cx('details-features-describe')}>
                        <div className={cx('row-item', 'row-item-left')}>
                            <span className={cx('icon-container')}>
                                <BiArea className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>Di???n t??ch</span>
                            <span className={cx('text-value')}>
                                {crPost?.area} m??
                            </span>
                        </div>
                        <div className={cx('row-item')}>
                            <span className={cx('icon-container')}>
                                <BiDollarCircle className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>M???c gi??</span>
                            <span className={cx('text-value')}>
                                {crPost?.price &&
                                    `${parseFloat(
                                        formatCash(crPost?.price?.toString()),
                                    ).toFixed(1)} tri???u/th??ng`}
                            </span>
                        </div>
                        {des?.bedroom > 0 && (
                            <div className={cx('row-item', 'row-item-left')}>
                                <span className={cx('icon-container')}>
                                    <TbBed className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    S??? ph??ng ng???
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.bedroom} ph??ng
                                </span>
                            </div>
                        )}
                        {des?.restroom > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <GrRestroom className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    S??? toilet
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.restroom} ph??ng
                                </span>
                            </div>
                        )}
                        {des?.floor > 0 && (
                            <div className={cx('row-item', 'row-item-left')}>
                                <span className={cx('icon-container')}>
                                    <MdApartment className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    S??? t???ng
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.floor} t???ng
                                </span>
                            </div>
                        )}
                        {des?.furniture > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <TbSofa className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    N???i th???t
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
                <h4 className={cx('title-info-describe')}>Xem tr??n b???n ?????</h4>
                <Mapbox searchAddress={crPost?.address} previewPost={true} />
            </div>
        </div>
    );
}

export default PreviewDetailDescribe;
