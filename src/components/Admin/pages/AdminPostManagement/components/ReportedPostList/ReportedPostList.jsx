import classNames from 'classnames/bind';
import styles from './ReportedPostList.module.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import {
    deletedPost,
    getAllReported,
    getDetailReported,
    getUser,
    deletedReportedPost,
    deleteReportedPostOfUser,
    getReportedByPostId,
} from '~/api';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsPhone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { BiPencil } from 'react-icons/bi';
import images from '~/assets/images';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;
const cx = classNames.bind(styles);
function ReportedPostList() {
    const [listReported, setListReported] = useState([]);
    const [deletedReported, setDeletedReported] = useState(false);
    const [showDetailReported, setShowDetailReported] = useState(false);
    const [detailReported, setDetailReported] = useState([]);
    const [userReported, setUserReported] = useState([]);

    useEffect(() => {
        getAllReported().then((res) => setListReported(res?.reported));
    }, []);

    useEffect(() => {
        getAllReported().then((res) => setListReported(res?.reported));
    }, [deletedReported]);
    const columns = [
        {
            field: 'createdAt',
            headerName: 'Ngày tháng',
            type: 'String',
            width: 100,
            valueGetter: (params) => {
                var options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                };
                const d = new Date(params.row.createdAt);
                return d.toLocaleDateString('vni', options);
            },
        },
        { field: 'postCode', headerName: 'Mã bài đăng', width: 120 },
        {
            field: 'titlePost',
            headerName: 'Tiêu đề',
            width: 240,
        },
        {
            field: 'descReport',
            headerName: 'Nội dung',
            type: 'String',
            width: 200,
            valueGetter: (params) => `${params.row.descReport}`,
        },
        {
            field: 'userFullName',
            headerName: 'Người báo cáo',
            type: 'String',
            width: 150,
        },

        {
            field: 'action',
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className={cx('action')}>
                        <button
                            className={cx('edit-btn')}
                            onClick={() => handleDetailReported(params.row)}
                        >
                            {' '}
                            <BiPencil className={cx('icon')} />
                            <span className={cx('text')}>Chi tiết</span>
                        </button>

                        <button
                            className={cx('delete-btn')}
                            onClick={() => handleDeletedPost(params.row)}
                        >
                            <AiOutlineDelete className={cx('icon')} />{' '}
                            <span className={cx('text')}>Xóa bài viết</span>
                        </button>
                        <button
                            className={cx('delete-reported-btn')}
                            onClick={() => handleDeleteReported(params.row)}
                        >
                            <AiOutlineDelete className={cx('icon')} />{' '}
                            <span className={cx('text')}>Xóa báo cáo</span>
                        </button>
                    </div>
                );
            },
        },
    ];
    const handleDeletedPost = (item) => {
        alert2(item, true, 'Bạn có muốn xóa không?', '', '');
    };
    const handleDeleteReported = (item) => {
        alert2(item, false, 'Bạn có muốn xóa không?', '', '');
    };
    const handleDetailReported = (item) => {
        console.log(item);
        getDetailReported(item?._id).then((res) => {
            setDetailReported(res?.reported);
            setShowDetailReported(true);
        });
        getUser(item?.createdBy).then((res) => setUserReported(res?.user));
    };
    const alert = (title, type) => {
        Swal.fire({
            title: `<h2 class="notify-title" style="font-weight: normal">${title}</h2>`,
            icon: type,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">Xác nhận</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        });
    };
    const alert2 = (item, isPost, title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title" style="font-weight: normal">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            showCancelButton: true,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">Xóa</p>',
            cancelButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">Hủy</p>',
            customClass: {
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
            },
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (isPost) {
                    await deletedPost(item?.idPost);
                    const res = await getReportedByPostId(item?.idPost);
                    await res.reported.map((item) =>
                        deletedReportedPost(item?._id),
                    );
                    setDeletedReported(!deletedReported);
                    alert('Xóa thành công!', 'success');
                } else {
                    await deletedReportedPost(item?._id);
                    const data = JSON.stringify({ postId: item?.idPost });
                    await deleteReportedPostOfUser(item?.createdBy, data);
                    setDeletedReported(!deletedReported);
                    alert('Xóa thành công!', 'success');
                }
            }
        });
    };
    const handleBack = () => {
        setShowDetailReported(false);
    };
    const CustomToolbar = () => {
        return (
            <div className={cx('toolbar')}>
                <span className={cx('title-toolbar')}>
                    DANH SÁCH BÀI ĐĂNG BỊ BÁO XẤU
                </span>
                <div className={cx('export')}>
                    <GridToolbar />
                </div>
            </div>
        );
    };

    const theme = createTheme(
        {
            palette: {
                primary: { main: '#1976d2' },
            },
        },
        viVN,
    );
    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: 'calc(100vh - 92px)',
                    padding: '24px',
                    paddingTop: '70px',
                }}
            >
                {showDetailReported ? (
                    <div className={cx('detail-reported')}>
                        <button className={cx('btn-back')} onClick={handleBack}>
                            Quay lại
                        </button>
                        <div className={cx('content')}>
                            <div className={cx('left-wrapper')}>
                                <div className={cx('left')}>
                                    <h1 className={cx('title')}>
                                        Người báo cáo
                                    </h1>

                                    <div className={cx('avatar-and-name')}>
                                        <img
                                            src={
                                                userReported?.profilePicture
                                                    ? `${HOST_NAME}/${userReported?.profilePicture}`
                                                    : images.defaultAvt
                                            }
                                            alt="avt"
                                            className={cx('avatar')}
                                        />
                                        <span className={cx('fullName')}>
                                            {detailReported?.userFullName}
                                        </span>
                                    </div>
                                    <div className={cx('info')}>
                                        {detailReported?.userPhoneNumber && (
                                            <div className={cx('phone')}>
                                                <span
                                                    className={cx('icon-info')}
                                                >
                                                    <BsPhone />
                                                </span>
                                                <span
                                                    className={cx('text-info')}
                                                >
                                                    {
                                                        detailReported?.userPhoneNumber
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {detailReported?.userEmail && (
                                            <div className={cx('phone')}>
                                                <span
                                                    className={cx('icon-info')}
                                                >
                                                    <CiMail />
                                                </span>
                                                <span
                                                    className={cx('text-info')}
                                                >
                                                    {detailReported?.userEmail}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={cx('right-wrapper')}>
                                <h1 className={cx('title')}>
                                    Nội dung báo cáo
                                </h1>
                                <div className={cx('content-reported')}>
                                    {detailReported?.descReport.map(
                                        (item, index) => (
                                            <p
                                                key={index}
                                                className={cx('reported-item')}
                                            >
                                                <span className={cx('dot')}>
                                                    ·
                                                </span>
                                                {item}
                                            </p>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <ThemeProvider theme={theme}>
                        <DataGrid
                            sx={{
                                '& .css-1jbbcbn-MuiDataGrid-columnHeaderTitle':
                                    {
                                        fontWeight: '700 !important',
                                    },
                                '& .css-levciy-MuiTablePagination-displayedRows':
                                    {
                                        fontSize: '1.4rem',
                                    },
                                '& .css-1j9kmqg-MuiDataGrid-toolbarContainer': {
                                    display: 'block',
                                    float: 'right',
                                },
                                '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root:nth-of-type(1)':
                                    {
                                        display: 'none',
                                    },
                                '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root:nth-of-type(2)':
                                    {
                                        display: 'none',
                                    },
                                '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root:nth-of-type(3)':
                                    {
                                        display: 'none',
                                    },
                                '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root':
                                    {
                                        fontSize: '1.2rem',
                                        fontFamily: 'var(--font-family)',
                                    },
                                '& .css-f3jnds-MuiDataGrid-columnHeaders': {
                                    borderTop:
                                        '1px solid rgba(224, 224, 224, 1);',
                                },
                                '& .css-i4bv87-MuiSvgIcon-root': {
                                    width: '1.4em',
                                    height: '1.4em',
                                },
                                '& .css-17jjc08-MuiDataGrid-footerContainer': {
                                    maxHeight: '40px',
                                },
                            }}
                            disableSelectionOnClick
                            rows={listReported}
                            columns={columns}
                            pageSize={listReported.length}
                            rowsPerPageOptions={[listReported.length]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            className={cx('list-user')}
                            style={{ fontSize: '1.4rem', textAlign: 'left' }}
                            components={{
                                Toolbar: CustomToolbar,
                                viVN,
                            }}
                        />
                    </ThemeProvider>
                )}
            </div>
        </>
    );
}

export default ReportedPostList;
