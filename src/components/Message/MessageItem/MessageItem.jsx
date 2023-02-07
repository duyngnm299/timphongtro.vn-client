import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './MessageItem.module.scss';
// import { format } from 'timeago.js';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';

// import it first.
import vi from 'timeago.js/lib/lang/vi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { currentPost } from '~/redux/slice/postSlice';
import config from '~/config';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function MessageItem({ theirUser, message, own }) {
    // console.log(message);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    timeago.register('vi', vi);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    const handleOnClickCurrentPost = () => {
        message?.post && dispatch(currentPost(message?.post));
        message?.post &&
            navigate(config.routes.detailPage + `/${message?.post?._id}`);
    };
    return (
        <div className={cx('message-item', own && 'message-own')}>
            {!own && (
                <div className={cx('msg-avatar')}>
                    <img
                        src={
                            theirUser
                                ? `${HOST_NAME}/${theirUser.profilePicture}`
                                : images.defaultAvt
                        }
                        alt=""
                        className={cx('msg-img')}
                    />
                </div>
            )}

            <div className={cx('message-text', own && 'text-own')}>
                {message?.text ? (
                    <>
                        <span className={cx('msg-text')}>{message.text}</span>
                        <span className={cx('time', own && 'time-own')}>
                            <TimeAgo datetime={message.createdAt} locale="vi" />
                        </span>
                    </>
                ) : (
                    <div
                        className={cx('post-message')}
                        onClick={handleOnClickCurrentPost}
                    >
                        <div className={cx('left')}>
                            <img
                                src={
                                    message?.post &&
                                    `${HOST_NAME}/${message?.post?.images[0]?.imagePath}`
                                }
                                alt=""
                                className={cx('image-post')}
                            />
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('msg-title')}>
                                {message?.post?.title && message?.post?.title}
                            </span>
                            <span className={cx('msg-address')}>
                                {message?.post?.address}
                            </span>
                            <span className={cx('msg-price')}>
                                {message?.post?.price &&
                                    formatCash(
                                        message?.post?.price.toString(),
                                    )}{' '}
                                VND
                            </span>
                            <span
                                className={cx(
                                    own ? 'time-post-own' : 'time-post',
                                )}
                            >
                                <TimeAgo
                                    datetime={message.createdAt}
                                    locale="vi"
                                />
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageItem;
