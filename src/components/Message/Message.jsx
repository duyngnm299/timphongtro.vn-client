import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './Message.module.scss';
import { SearchIcon } from '../Icons';
import { MdInfoOutline } from 'react-icons/md';
import { IoSend } from 'react-icons/io5';
import MessageItem from './MessageItem';
import Conversation from './Conversation';
import { useState, useEffect, useRef } from 'react';
import { addMessage, getConvOfUser, getMessages, getUser } from '~/api';
import { useSelector } from 'react-redux';
import { GoPrimitiveDot } from 'react-icons/go';
import { BiArrowBack } from 'react-icons/bi';

import { useDispatch } from 'react-redux';

import { newMessage } from '~/redux/slice/messageSlice';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { userId } from '~/redux/slice/authSlice';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Message({ sk }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usId = useSelector((state) => state.auth.user?.userId);
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const currentConversation = useSelector(
        (state) => state.message.conversation?.conv,
    );
    const currentPost = useSelector((state) => state.post?.post?.currentPost);

    const [conversation, setConversation] = useState([]);
    const [currentChat, setCurrentChat] = useState(
        currentConversation && currentConversation,
    );
    const listOnlineUsers = useSelector(
        (state) => state.message.online?.listUsers,
    );
    const [showSendCurrentPost, setShowSendCurrentPost] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [showOnlineIcon, setShowOnlineIcon] = useState([]);
    const [theirUser, setTheirUser] = useState(null);
    const [entering, setEntering] = useState(false);
    const [enteringText, setEnteringText] = useState('');
    const [sendMsg, setSendMsg] = useState(false);
    const [sendCrPost, setSendCrPost] = useState(false);
    const [arrivalPostMessage, setArrivalPostMessage] = useState(null);
    const [inMsg, setInMsg] = useState(false);
    const [width, setWidth] = useState(0);
    const [showChat, setShowChat] = useState(false);
    const [showConversation, setShowConversation] = useState(false);
    useEffect(() => {
        const updateWindowWidth = () => {
            const newWidth = window.innerWidth;
            if (newWidth < 601) {
                setWidth(1);
                setShowConversation(true);
            } else {
                setWidth(0);
            }
            console.log('updating width');
        };
        updateWindowWidth();
        // console.log(window?.innerWidth);
        window.addEventListener('DOMContentLoaded', updateWindowWidth);
        return () =>
            window.removeEventListener('DOMContentLoaded', updateWindowWidth);
    }, []);
    useEffect(() => {
        const updateWindowWidth = () => {
            const newWidth = window.innerWidth;
            if (newWidth < 601) {
                setWidth(1);
                setShowConversation(true);
            } else {
                setWidth(0);
            }
            console.log('updating width');
        };
        updateWindowWidth();
        // console.log(window?.innerWidth);
        // window.addEventListener('DOMContentLoaded', updateWindowWidth)
        window.addEventListener('resize', updateWindowWidth);
        return () => window.removeEventListener('resize', updateWindowWidth);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window?.innerWidth]);
    const scrollRef = useRef();
    useEffect(() => {
        setInMsg(!inMsg);
        sk &&
            sk?.current?.on('getMessage', (data) => {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    seen: false,
                    createdAt: Date.now(),
                    receiver: data.receiverId,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        sk &&
            sk?.current?.on('getMessage', (data) => {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    seen: false,
                    createdAt: Date.now(),
                    receiver: data.receiverId,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendMsg]);
    useEffect(() => {
        sk &&
            sk?.current?.on('getCurrentPost', (data) => {
                setArrivalPostMessage({
                    sender: data.senderId,
                    post: data.post,
                    seen: false,
                    createdAt: Date.now(),
                    receiver: data.receiverId,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sk &&
            sk?.current?.on('getCurrentPost', (data) => {
                setArrivalPostMessage({
                    sender: data.senderId,
                    post: data.post,
                    seen: false,
                    createdAt: Date.now(),
                    receiver: data.receiverId,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendCrPost]);

    // set list message
    useEffect(() => {
        arrivalPostMessage &&
            currentChat?.members.includes(arrivalPostMessage.sender) &&
            arrivalPostMessage &&
            setMessages((prev) => [...prev, arrivalPostMessage]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrivalPostMessage]);

    // Show button send info post
    useEffect(() => {
        if (
            currentPost &&
            usId &&
            currentConversation &&
            currentConversation.members.includes(currentPost?.createdBy[0]) &&
            currentPost?.createdBy[0] === usId
        ) {
            setShowSendCurrentPost(true);
        } else {
            setShowSendCurrentPost(false);
        }
        if (!usId) {
            setShowSendCurrentPost(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            currentPost &&
            usId &&
            currentChat &&
            currentChat.members.includes(currentPost?.createdBy[0]) &&
            currentPost?.createdBy[0] === usId
        ) {
            console.log(
                currentChat.members.includes(currentPost?.createdBy[0]) &&
                    currentPost?.createdBy[0] === usId,
            );
            setShowSendCurrentPost(true);
        } else {
            setShowSendCurrentPost(false);
        }
        if (!usId) {
            setShowSendCurrentPost(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat]);
    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrivalMessage]);

    // get all conversations of user
    useEffect(() => {
        currentUser &&
            getConvOfUser(currentUser._id).then((res) =>
                setConversation((prev) => [...prev, res?.conversation]),
            );
    }, [currentUser]);
    // get messages of conversation
    useEffect(() => {
        currentChat &&
            getMessages(currentChat._id).then((res) =>
                setMessages(res.message),
            );
        const theirId = currentChat?.members.find(
            (user) => user !== currentUser?._id,
        );
        const result =
            listOnlineUsers &&
            listOnlineUsers.find((item) => item.userId === theirId);
        if (result) {
            setShowOnlineIcon(true);
        } else {
            setShowOnlineIcon(false);
        }
        currentChat &&
            getUser(theirId)
                .then((res) => setTheirUser(res.user))
                .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat, currentUser]);
    useEffect(() => {
        const result =
            listOnlineUsers &&
            listOnlineUsers.find((item) => item.userId === theirUser?._id);
        if (result) {
            setShowOnlineIcon(true);
        } else {
            setShowOnlineIcon(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const result =
            listOnlineUsers &&
            listOnlineUsers.find((item) => item.userId === theirUser?._id);
        if (result) {
            setShowOnlineIcon(true);
        } else {
            setShowOnlineIcon(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOnlineUsers]);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessages.length > 0) {
            const data = {
                sender: currentUser._id,
                text: newMessages,
                conversationId: currentChat._id,
            };
            const receiverId = currentChat.members.find(
                (member) => member !== currentUser._id,
            );
            sk.current.emit('sendMessage', {
                senderId: currentUser._id,
                receiverId,
                text: newMessages,
            });
            setSendMsg(!sendMsg);

            // add message to db
            addMessage(data)
                .then(
                    (res) => setMessages([...messages, res.savedMessage]),
                    setNewMessages(''),
                )
                .catch((err) => console.log(err));
            return;
        }
    };
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleOnClick = () => {
        dispatch(newMessage());
        const receiverId = currentChat.members.find(
            (member) => member !== currentUser._id,
        );
        sk.current.emit('seenMessage', {
            receiverId,
            senderId: currentUser?._id,
        });
    };

    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter' && newMessages.length > 0) {
            setSendMsg(!sendMsg);
            const data = {
                sender: currentUser._id,
                text: newMessages,
                conversationId: currentChat._id,
            };
            const receiverId = currentChat.members.find(
                (member) => member !== currentUser._id,
            );
            sk.current.emit('sendMessage', {
                senderId: currentUser._id,
                receiverId,
                text: newMessages,
            });
            sk.current.emit('seenMessage', {
                receiverId,
                senderId: currentUser?._id,
            });
            dispatch(
                newMessage({
                    senderId: currentUser._id,
                    receiverId,
                    text: newMessages,
                }),
            );

            // add message to db
            addMessage(data)
                .then(
                    (res) => setMessages([...messages, res.savedMessage]),
                    setNewMessages(''),
                )
                .catch((err) => console.log(err));
            return;
        }
    };

    const handleMouseDown = () => {
        setEntering(!entering);
        const receiverId = currentChat.members.find(
            (member) => member !== currentUser._id,
        );
        sk.current.emit(
            'entering',
            receiverId,
            currentUser.fullName || currentUser.username,
        );
        dispatch(
            newMessage({
                senderId: currentUser._id,
                receiverId,
                text: newMessages,
            }),
        );
        sk.current.emit('seenMessage', {
            receiverId,
            senderId: currentUser?._id,
        });
    };
    useEffect(() => {
        sk &&
            sk?.current?.on('notifyEntering', (receiverId, sender) => {
                receiverId === currentUser?._id &&
                    setEnteringText(`${sender} đang nhập...`);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entering]);

    const handleMouseBlur = () => {
        setEnteringText('');
    };
    const handleSendCurrentPost = () => {
        // dispatch(newMessage());
        setSendCrPost(!sendCrPost);
        setShowSendCurrentPost(false);
        const data = {
            sender: currentUser._id,
            post: currentPost,
            conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find(
            (member) => member !== currentUser._id,
        );
        sk.current.emit('sendCurrentPost', {
            senderId: currentUser._id,
            receiverId,
            post: currentPost,
        });

        // add message to db
        addMessage(data)
            .then(
                (res) => setMessages([...messages, res.savedMessage]),
                setNewMessages(''),
            )
            .catch((err) => console.log(err));
        return;
    };

    const handleOnClickAvatar = () =>
        theirUser &&
        navigate(config.routes.postListOfUser + `/${theirUser?._id}`);
    theirUser && dispatch(userId(theirUser?._id));
    return (
        <div className={cx('wrapper')}>
            {width === 1 ? (
                <div>
                    {showConversation && (
                        <div className={cx('list-message')}>
                            <div className={cx('header')}>
                                <h1 className={cx('title')}>Tin nhắn</h1>
                                <div className={cx('search-message')}>
                                    <SearchIcon className={cx('icon-search')} />
                                    <input
                                        type="text"
                                        className={cx('search-input')}
                                        placeholder="Tìm kiếm tin nhắn"
                                    />
                                </div>
                            </div>
                            {conversation &&
                                conversation[0]?.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (width === 1) {
                                                setShowConversation(false);
                                                setShowChat(true);
                                            }
                                            setCurrentChat(item);
                                        }}
                                    >
                                        <Conversation
                                            data={item}
                                            userId={item?.members?.filter(
                                                (id) => id !== currentUser?._id,
                                            )}
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                    {showChat && (
                        <div className={cx('chat-box-wrapper')}>
                            <div className={cx('chat-box')}>
                                {currentChat ? (
                                    <>
                                        <div className={cx('header-chat-box')}>
                                            <div className={cx('header-left')}>
                                                <div
                                                    className={cx('back')}
                                                    onClick={() => {
                                                        if (width === 1) {
                                                            setShowConversation(
                                                                true,
                                                            );
                                                            setShowChat(false);
                                                        }
                                                    }}
                                                >
                                                    <BiArrowBack
                                                        className={cx(
                                                            'icon-back',
                                                        )}
                                                    />
                                                </div>
                                                <div
                                                    className={cx(
                                                        'user-avatar',
                                                    )}
                                                    onClick={
                                                        handleOnClickAvatar
                                                    }
                                                >
                                                    <div
                                                        className={cx(
                                                            'avatar-chat-box',
                                                        )}
                                                    >
                                                        <img
                                                            src={
                                                                theirUser
                                                                    ? `${HOST_NAME}/${theirUser.profilePicture}`
                                                                    : images.defaultAvt
                                                            }
                                                            alt=""
                                                            className={cx(
                                                                'img-chat-box',
                                                            )}
                                                        />
                                                        {showOnlineIcon && (
                                                            <GoPrimitiveDot
                                                                className={cx(
                                                                    'online-icon',
                                                                )}
                                                            />
                                                        )}
                                                    </div>
                                                    <div
                                                        className={cx(
                                                            'full-name',
                                                        )}
                                                    >
                                                        {theirUser &&
                                                            theirUser.fullName}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={cx(
                                                    'info-icon-container',
                                                )}
                                            >
                                                <MdInfoOutline
                                                    className={cx('info-icon')}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={cx('message-container')}
                                            onClick={handleOnClick}
                                        >
                                            {messages.map((item, index) => (
                                                <div
                                                    key={index}
                                                    ref={scrollRef}
                                                >
                                                    <MessageItem
                                                        theirUser={
                                                            theirUser &&
                                                            theirUser
                                                        }
                                                        message={item}
                                                        own={
                                                            currentUser &&
                                                            item?.sender ===
                                                                currentUser?._id
                                                        }
                                                    />
                                                </div>
                                            ))}
                                            {enteringText.length ? (
                                                <p className={cx('entering')}>
                                                    {enteringText}
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                        </div>

                                        <div className={cx('bottom')}>
                                            <div className={cx('text-send')}>
                                                <input
                                                    type="text"
                                                    className={cx('text-input')}
                                                    placeholder="Nhập tin nhắn"
                                                    onChange={(e) =>
                                                        setNewMessages(
                                                            e.target.value,
                                                        )
                                                    }
                                                    value={newMessages}
                                                    onKeyDown={handleOnKeyDown}
                                                    onMouseDown={
                                                        handleMouseDown
                                                    }
                                                    onBlur={handleMouseBlur}
                                                    onFocus={() =>
                                                        dispatch(newMessage())
                                                    }
                                                />
                                                {showSendCurrentPost && (
                                                    <button
                                                        className={cx(
                                                            'send-crPost',
                                                        )}
                                                        onClick={
                                                            handleSendCurrentPost
                                                        }
                                                    >
                                                        Gửi bài viết
                                                    </button>
                                                )}
                                                <button
                                                    className={cx('icon-send')}
                                                    onClick={handleSendMessage}
                                                >
                                                    <IoSend />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <span className={cx('no-current-chat')}>
                                        Mở cuộc hội thoại để bắt đầu trò chuyện
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className={cx('list-message')}>
                        <div className={cx('header')}>
                            <h1 className={cx('title')}>Tin nhắn</h1>
                            <div className={cx('search-message')}>
                                <SearchIcon className={cx('icon-search')} />
                                <input
                                    type="text"
                                    className={cx('search-input')}
                                    placeholder="Tìm kiếm tin nhắn"
                                />
                            </div>
                        </div>
                        {conversation &&
                            conversation[0]?.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrentChat(item)}
                                >
                                    <Conversation
                                        data={item}
                                        userId={item?.members?.filter(
                                            (id) => id !== currentUser?._id,
                                        )}
                                    />
                                </div>
                            ))}
                    </div>
                    <div className={cx('chat-box-wrapper')}>
                        <div className={cx('chat-box')}>
                            {currentChat ? (
                                <>
                                    <div className={cx('header-chat-box')}>
                                        <div
                                            className={cx('user-avatar')}
                                            onClick={handleOnClickAvatar}
                                        >
                                            <div
                                                className={cx(
                                                    'avatar-chat-box',
                                                )}
                                            >
                                                <img
                                                    src={
                                                        theirUser
                                                            ? `${HOST_NAME}/${theirUser.profilePicture}`
                                                            : images.defaultAvt
                                                    }
                                                    alt=""
                                                    className={cx(
                                                        'img-chat-box',
                                                    )}
                                                />
                                                {showOnlineIcon && (
                                                    <GoPrimitiveDot
                                                        className={cx(
                                                            'online-icon',
                                                        )}
                                                    />
                                                )}
                                            </div>
                                            <div className={cx('full-name')}>
                                                {theirUser &&
                                                    theirUser.fullName}
                                            </div>
                                        </div>
                                        <div
                                            className={cx(
                                                'info-icon-container',
                                            )}
                                        >
                                            <MdInfoOutline
                                                className={cx('info-icon')}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={cx('message-container')}
                                        onClick={handleOnClick}
                                    >
                                        {messages.map((item, index) => (
                                            <div key={index} ref={scrollRef}>
                                                <MessageItem
                                                    theirUser={
                                                        theirUser && theirUser
                                                    }
                                                    message={item}
                                                    own={
                                                        currentUser &&
                                                        item?.sender ===
                                                            currentUser?._id
                                                    }
                                                />
                                            </div>
                                        ))}
                                        {enteringText.length ? (
                                            <p className={cx('entering')}>
                                                {enteringText}
                                            </p>
                                        ) : (
                                            ''
                                        )}
                                    </div>

                                    <div className={cx('bottom')}>
                                        <div className={cx('text-send')}>
                                            <input
                                                type="text"
                                                className={cx('text-input')}
                                                placeholder="Nhập tin nhắn"
                                                onChange={(e) =>
                                                    setNewMessages(
                                                        e.target.value,
                                                    )
                                                }
                                                value={newMessages}
                                                onKeyDown={handleOnKeyDown}
                                                onMouseDown={handleMouseDown}
                                                onBlur={handleMouseBlur}
                                                onFocus={() =>
                                                    dispatch(newMessage())
                                                }
                                            />
                                            {showSendCurrentPost && (
                                                <button
                                                    className={cx(
                                                        'send-crPost',
                                                    )}
                                                    onClick={
                                                        handleSendCurrentPost
                                                    }
                                                >
                                                    Gửi bài viết
                                                </button>
                                            )}
                                            <button
                                                className={cx('icon-send')}
                                                onClick={handleSendMessage}
                                            >
                                                <IoSend />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <span className={cx('no-current-chat')}>
                                    Mở cuộc hội thoại để bắt đầu trò chuyện
                                </span>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Message;
