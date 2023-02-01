import classNames from 'classnames/bind';
import styles from './Notifications.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function Notifications() {
    const renderItems = () => {
        return <></>;
    };

    const renderResult = (attrs) => (
        <div className={cx('message-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('message-popper')}>
                <div className={cx('message-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    return (
        <Tippy
            className={cx('tippy-content')}
            content="Thông báo"
            delay={(0, 200)}
            placement="bottom"
        >
            <div>
                <HeadlessTippy
                    // visible
                    visible={false}
                    delay={[0, 1000]}
                    offset={[90, 8]}
                    interactive
                    placement="bottom-end"
                    render={renderResult}
                    // onClickOutside={() => setShowCategory(false)}
                >
                    <button className={cx('action-btn')}>
                        <FontAwesomeIcon icon={faBell} className={cx('icon')} />
                    </button>
                </HeadlessTippy>
            </div>
        </Tippy>
    );
}

export default Notifications;
