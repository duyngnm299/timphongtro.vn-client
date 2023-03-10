import SearchResult from '~/components/SearchResult';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SearchFilterPost } from '~/api';
import { currentCategory, filterResult } from '~/redux/slice/filterSlice';
function Apartment() {
    const dispatch = useDispatch();
    useEffect(() => {
        SearchFilterPost('category_name=Chung cư - căn hộ').then(
            (res) => dispatch(filterResult(res)),
            dispatch(currentCategory('Chung cư - căn hộ')),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <SearchResult />;
}

export default Apartment;
