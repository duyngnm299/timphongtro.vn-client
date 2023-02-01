import SearchResult from '~/components/SearchResult';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SearchFilterPost } from '~/api';
import { currentCategory, filterResult } from '~/redux/slice/filterSlice';
function FindRoomates() {
    const dispatch = useDispatch();
    useEffect(() => {
        SearchFilterPost('category_name=Tìm người ở ghép').then(
            (res) => dispatch(filterResult(res)),
            dispatch(currentCategory('Tìm người ở ghép')),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <SearchResult />;
}

export default FindRoomates;
