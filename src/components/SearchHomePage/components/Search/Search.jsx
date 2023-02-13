import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Search.module.scss';
import { AiOutlineSearch } from 'react-icons/ai';
import { useDebounce } from '~/hooks';
import RenderSearchResult from './RenderSearchResult';
import { SearchFilterPost } from '~/api';
import { useSelector, useDispatch } from 'react-redux';
import { searchLink, searchText } from '~/redux/slice/filterSlice';
import { Link } from 'react-router-dom';
import config from '~/config';
import { filterResult } from '~/redux/slice/filterSlice';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);
function Search({ className }) {
    const dispatch = useDispatch();
    const currentCategory = useSelector(
        (state) => state.filter.category?.currentCategory,
    );
    const currentDistrict = useSelector(
        (state) => state.filter.district?.currentDistrict,
    );
    const priceGte = useSelector((state) => state.filter.price?.priceGte);
    const priceLte = useSelector((state) => state.filter.price?.priceLte);
    const areaGte = useSelector((state) => state.filter.area?.areaGte);
    const areaLte = useSelector((state) => state.filter.area?.areaLte);

    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const inputRef = useRef();
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!debouncedValue) {
            setSearchResult([]);
            return;
        }
        dispatch(searchText(debouncedValue));
        setLoading(true);
        SearchFilterPost(`title=${debouncedValue}`).then((res) => {
            setSearchResult(res.post);
            setLoading(false);
            setShowResult(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);
    const handleInputChange = (searchValue) => {
        if (searchValue.startsWith(' ')) {
            return;
        }
        setSearchValue(searchValue);
    };
    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };
    const handleSearch = () => {
        if (
            !searchValue &&
            !currentCategory &&
            !currentDistrict &&
            !priceGte &&
            !areaGte
        ) {
            setShowLoadingModal(true);
            dispatch(searchLink(null));
            SearchFilterPost().then((res) => {
                setShowLoadingModal(false);
                dispatch(filterResult(res));
            });
            return;
        }
        if (
            searchValue ||
            currentCategory ||
            currentDistrict ||
            areaGte ||
            priceGte
        ) {
            setShowLoadingModal(true);
            dispatch(
                searchLink(
                    `title=${searchValue ? searchValue : ''}&category_name=${
                        currentCategory ? currentCategory.category_name : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${priceGte ? priceGte : ''}&price_lte=${
                        priceLte ? priceLte : ''
                    }&areaGte=${areaGte ? areaGte : ''}&areaLte=${
                        areaLte ? areaLte : ''
                    }`,
                ),
            );
            SearchFilterPost(
                `title=${searchValue ? searchValue : ''}&category_name=${
                    currentCategory ? currentCategory : ''
                }&district=${
                    currentDistrict ? currentDistrict : ''
                }&price_gte=${priceGte ? priceGte : ''}&price_lte=${
                    priceLte ? priceLte : ''
                }&areaGte=${areaGte ? areaGte : ''}&areaLte=${
                    areaLte ? areaLte : ''
                }`,
            ).then((res) => {
                setShowLoadingModal(false);
                dispatch(filterResult(res));
            });
            return;
        }
    };
    console.log('[showLoadingModal]', showLoadingModal);
    return (
        // Thêm thẻ div để Tippy không warning
        <div>
            <HeadlessTippy
                interactive
                appendTo={() => document.body}
                // visible
                visible={searchValue.length > 0 && showResult}
                placement="bottom"
                render={(attrs) => (
                    <div
                        className={cx(
                            'search-result',
                            className && 'search-bar-result',
                        )}
                        tabIndex="-1"
                        {...attrs}
                    >
                        {showLoadingModal && <Loading />}
                        {debouncedValue && (
                            <PopperWrapper className={cx('popper')}>
                                {searchValue.length > 0 && searchResult[0] ? (
                                    <h4 className={cx('search-title')}>
                                        Đề xuất
                                    </h4>
                                ) : (
                                    ''
                                )}
                                {searchResult[0] ? (
                                    <RenderSearchResult
                                        data={searchResult}
                                        value={searchValue}
                                        className={className && className}
                                    />
                                ) : (
                                    <div className={cx('no-result')}>
                                        <span>Không có kết quả phù hợp</span>
                                    </div>
                                )}
                            </PopperWrapper>
                        )}
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search', className && 'search-bar')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Tìm nhanh. VD: Phòng trọ Lê Duẩn"
                        spellCheck={false}
                        // onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}

                    {loading && (
                        <FontAwesomeIcon
                            className={cx('loading')}
                            icon={faSpinner}
                        />
                    )}

                    <Link to={config.routes.searchResult}>
                        <button
                            className={cx('btn-search')}
                            onClick={handleSearch}
                        >
                            <span className={cx('icon-search')}>
                                <AiOutlineSearch />
                            </span>
                            <span className={cx('search-text')}>Tìm kiếm</span>
                        </button>
                    </Link>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
