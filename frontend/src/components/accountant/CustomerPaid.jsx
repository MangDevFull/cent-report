import { useEffect, useState } from "react"
import { Spin, Pagination, Input, Select, Button, message, DatePicker } from "antd"
import { Row, Col } from "react-bootstrap"
import Table from "ant-responsive-table";
import axiosService from "../../utils/axios.config";
import { SearchOutlined, CloseOutlined, ProfileOutlined, MobileOutlined } from '@ant-design/icons';
import moment from 'moment'
import currencyConvert from '../../utils/currency';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-mm-DD';
const { RangePicker } = DatePicker;
export default function CustomerPaid() {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [sortBy, setSortBy] = useState("date_desc")
    const [startDate, setStartDate] = useState(dayjs().add(-7, 'd').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: "id",
            width: '2%',
            render: (y, record) => {
                const findIndex = data.findIndex(x => {
                    return x.id == y
                })
                return (<p>{findIndex + 1}</p>)
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Mã đơn từ',
            dataIndex: 'order_code',
            key: "order_code",
            width: '5%',
            render: (x, record) => {
                return (
                    <>
                        {x || ""}
                    </>
                )
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Ngày',
            dataIndex: 'order_at',
            key: "order_at",
            width: '10%',
            render: (x, record) => {
                return (
                    <>
                        {moment(new Date(x)).format('DD/MM/YYYY')}
                    </>
                )
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Telesale',
            width: '5%',
            dataIndex: "source_from",
            key: "source_from",
            render: (x, record) => {
                return (
                    <>
                        <p>{x || "Không có"}</p>
                    </>
                )
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Cashier',
            dataIndex: 'created_name',
            key: "created_name",
            with: "5%",
            render: (x, record) => {
                return (
                    <>
                        <p>{x}</p>
                    </>
                )
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            key: "customer",
            width: '10%',
            render: (x, record) => {
                return <p>{x.full_name}</p>
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'orderItem',
            key: "orderItem",
            width: '20%',
            render: (x, record) => {
                return <>
                    {x.map(y => {
                        return <p>{y.product_name}</p>
                    })}
                </>
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Nợ đầu kỳ',
            dataIndex: 'owedStart',
            key: "owedStart",
            width: '10%',
            render: (x, record) => {
                return <p>{currencyConvert(x)}</p>
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Phát sinh phải thu trong kỳ',
            dataIndex: 'addMore',
            key: "addMore",
            width: '10%',
            render: (x, record) => {
                return <p>{currencyConvert(x)}</p>
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Đã thanh toán trong kỳ',
            dataIndex: 'totalInDate',
            key: "totalInDate",
            width: '10%',
            render: (x, record) => {
                return <p>{currencyConvert(x)}</p>
            },
            showOnResponse: true,
            showOnDesktop: true
        },
        {
            title: 'Còn phải thu',
            dataIndex: 'money_owed',
            key: "money_owed",
            width: '10%',
            render: (x, record) => {
                return <p>{currencyConvert(x)}</p>
            },
            showOnResponse: true,
            showOnDesktop: true
        },
    ];
    const getData = async (limitFetch = 20, pageFetch = 1, sort = "date_desc",start="",end="") => {
        setIsLoading(true)
        try {
            const res = await axiosService(`reports/accountant/customer-paid?page=${pageFetch}&limit=${limitFetch}&startDate=${start}&endDate=${end}&sortBy=${sort}`)
            if (res.data.code === 200) {
                const { items, meta, } = res.data.data
                setData([...items])
                setTotal(meta.totalItems)
                setIsLoading(false)
            } else {
                console.log(res)
                message.error(res.data.message)
            }
        } catch (error) {
            console.error(error)
            message.error("Đã có lỗi xảy ra")
            setIsLoading(false)
        }
    }
    const onChangePagination = async (page, pageSize) => {
        await getData(pageSize, page,sortBy,startDate,endDate)
        setPage(page)
        setLimit(pageSize)
        window.scrollTo(0, 0)
    }
    useEffect(() => {
        async function fetchData() {
            await getData(limit,page,sortBy,startDate,endDate)
        }
        fetchData()
    }, [])
    const handleFilter = async () => {
        await getData(limit, page, sortBy,startDate,endDate)
    }
    const clearFilter = async () => {
        setLimit(20)
        setPage(1)
        setSortBy("date_desc")
        setEndDate(dayjs().format('YYYY-MM-DD'))
        setStartDate(dayjs().add(-7, 'd').format('YYYY-MM-DD'))
        await getData(20, 1, "date_desc",dayjs().add(-7, 'd').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD'))
    }
    const onChangeSelectSortBy = (value) => {
        setSortBy(value)
    }
    const onChangeDate = (x, y) => {
        setStartDate(y[0])
        setEndDate(y[1])
    }
    const rangePresets = [
        {
          label: 'Last 7 Days',
          value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
          label: 'Last 14 Days',
          value: [dayjs().add(-14, 'd'), dayjs()],
        },
        {
          label: 'Last 30 Days',
          value: [dayjs().add(-30, 'd'), dayjs()],
        },
        {
          label: 'Last 90 Days',
          value: [dayjs().add(-90, 'd'), dayjs()],
        },
      ];
    return (
        <Spin tip="Đang tải. Xin vui lòng chờ" size="large" spinning={isLoading}>
            <Row>
                <Col xxl={4} xs={6} >
                    <span>Khoảng thời gian:</span>
                    <br></br>
                    <RangePicker presets={rangePresets} className="w-100" onChange={onChangeDate}
                        defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
                    />
                </Col>
                <Col xxl={4} xs={6}>
                    <span>Sắp xếp theo:</span>
                    <br></br>
                    <Select
                        value={sortBy}
                        className='w-100'
                        onChange={onChangeSelectSortBy}
                        options={[
                            {
                                label: "Thời gian tạo gần nhất",
                                value: "date_desc"
                            },
                            {
                                label: 'Thời gian tạo xa nhất',
                                value: 'date_asc',
                            },
                        ]}
                    />
                </Col>
                <Col xxl={4} xs={12} >
                    <span></span>
                    <br></br>
                    <div className='d-flex'>
                        <Button type="primary" className='mx-2' icon={<SearchOutlined />} onClick={handleFilter}>
                            Tìm kiếm
                        </Button>
                        <Button onClick={clearFilter} type="primary" danger icon={<CloseOutlined />}>
                            Xoá
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row className='mt-5'>
                <Col xs={12} className="d-flex justify-content-end px-4">
                    <p>Hiển thị <span className='text-success fw-bold'>{data.length}</span> trên <span className='text-warning fw-bold'>{total}</span>
                        {/* Tổng số tiền nợ: <span className='text-danger'>{currencyConvert(sumOwed)}</span> .Tổng số: <span className='text-primary'>{currencyConvert(sum)}</span> */}
                    </p>
                </Col>
            </Row>
            <Row className='mt-0'>
                <Col xs={12} className="w-100">
                    <Table
                        antTableProps={{
                            showHeader: true,
                            columns,
                            dataSource: data,
                            pagination: false
                        }}
                        mobileBreakPoint={768}
                    />
                </Col>
                <Col xs={12} className="mt-5">
                    <div className='d-flex justify-content-end'>
                        <Pagination current={page} pageSize={limit} total={total} onChange={onChangePagination} />
                    </div>
                </Col>
            </Row>
        </Spin>
    )
}