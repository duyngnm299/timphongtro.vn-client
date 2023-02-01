import SearchResult from '~/components/SearchResult';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SearchFilterPost } from '~/api';
import { currentCategory, filterResult } from '~/redux/slice/filterSlice';
function Office() {
    const dispatch = useDispatch();
    useEffect(() => {
        SearchFilterPost('category_name=Văn phòng').then(
            (res) => dispatch(filterResult(res)),
            dispatch(currentCategory('Văn phòng')),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <SearchResult />;
}

export default Office;
