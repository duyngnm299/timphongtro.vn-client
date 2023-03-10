import SearchResult from '~/components/SearchResult';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SearchFilterPost } from '~/api';
import { currentCategory, filterResult } from '~/redux/slice/filterSlice';
function Motel() {
    const dispatch = useDispatch();
    useEffect(() => {
        SearchFilterPost('category_name=Phòng trọ').then(
            (res) => dispatch(filterResult(res)),
            dispatch(currentCategory('Phòng trọ')),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <SearchResult />;
}

export default Motel;
