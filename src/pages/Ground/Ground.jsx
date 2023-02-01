import SearchResult from '~/components/SearchResult';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SearchFilterPost } from '~/api';
import { currentCategory, filterResult } from '~/redux/slice/filterSlice';
function Ground() {
    const dispatch = useDispatch();
    useEffect(() => {
        SearchFilterPost('category_name=Mặt bằng&status=approved').then(
            (res) => dispatch(filterResult(res)),
            dispatch(currentCategory('Mặt bằng')),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <SearchResult />;
}

export default Ground;
