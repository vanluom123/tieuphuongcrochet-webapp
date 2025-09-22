'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd'
import { SegmentedValue } from 'antd/es/segmented'
import { ALL_ITEM, ROUTE_PATH, TRANSLATION_STATUS } from '@/app/lib/constant'
import { useSession } from 'next-auth/react'
import { Category, DataTableState, DataType, initialListParams } from '@/app/lib/definitions'
import { fetchFreePatterns } from '@/app/lib/service/freePatternService'
import { handleTokenRefresh } from '@/app/lib/service/apiJwtService'
import { combineFilters } from '@/app/lib/filter-utils'
import HeaderPart from '@/app/components/header-part'
import ViewTable from '@/app/components/view-table'
import FreePatternFormModal from '@/app/components/profile/FreePatternFormModal'

interface FreePatternProps {
  categories: Category[]
  initialData: DataTableState
}

const FreePatterns = ({ categories, initialData }: FreePatternProps) => {
  const router = useRouter()
  const [state, setState] = useState<DataTableState>(initialData)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  })
  const [params, setParams] = useState(initialListParams)
  const [modalData, setModalData] = useState({
    open: false,
    id: '',
  })
  const memoizedParams = useMemo(() => params, [params])

  // Use session to track user changes
  const { data: session, status: sessionStatus } = useSession()

  // Helper function để load patterns
  const loadPatterns = useCallback(async (fetchParams: typeof params) => {
    try {
      const response = await fetchFreePatterns(fetchParams, { revalidate: 0 })
      return response
    } catch (error) {
      console.error('Error loading patterns:', error)
      throw error
    }
  }, [])

  const onPageChange = useCallback((current: number, pageSize: number) => {
    setParams((prev) => ({
      ...prev,
      pageNo: current - 1,
      pageSize: pageSize,
    }))
  }, [])

  const onSearchFreePatterns = useCallback((value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, search: value }
      setParams((preParams) => {
        return {
          ...preParams,
          filter: combineFilters({
            ...newFilters,
            searchFields: ['name', 'description', 'author'],
          }),
        }
      })
      return newFilters
    })
  }, [])

  const onTabChange = useCallback((key: React.Key) => {
    setParams((prev) => ({
      ...prev,
      categoryId: key === ALL_ITEM.key ? '' : (key as string),
    }))
  }, [])

  const onStatusFilter = useCallback((value: SegmentedValue) => {
    const status = value === TRANSLATION_STATUS.ALL ? '' : (value as string)
    setFilters((prev) => {
      const newFilters = { ...prev, status: status }
      setParams((preParams) => {
        return {
          ...preParams,
          filter: combineFilters({
            ...newFilters,
            searchFields: ['name', 'description', 'author'],
          }),
        }
      })
      return newFilters
    })
  }, [])

  const onRefreshData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      const response = await loadPatterns(memoizedParams)
      if (!response) throw new Error('No response from server')

      setState({
        loading: false,
        data: response.data || [],
        totalRecord: response.totalRecords || 0,
      })
    } catch (error) {
      console.error('Error fetching free patterns:', error)
      setState({ loading: false, data: [], totalRecord: 0 })
    }
  }, [memoizedParams, loadPatterns])

  useEffect(() => {
    // Delay fetch until session is determined (authenticated or unauthenticated)
    if (sessionStatus === 'loading') {
      return
    }

    const loadData = async () => {
      setState((prev) => ({ ...prev, loading: true }))
      try {
        const response = await loadPatterns(memoizedParams)
        if (!response) throw new Error('No response from server')

        setState({
          loading: false,
          data: response.data || [],
          totalRecord: response.totalRecords || 0,
        })
      } catch (error) {
        console.error('Error fetching free patterns:', error)
        setState({ loading: false, data: [], totalRecord: 0 })
      }
    }

    loadData()
  }, [
    memoizedParams,
    initialData,
    session?.user?.id,
    session?.user?.accessToken,
    sessionStatus,
    loadPatterns,
  ])

  const onAddPattern = useCallback(async () => {
    await handleTokenRefresh()
    setModalData({ open: true, id: '' })
  }, [])

  return (
    <div className="shop-page scroll-animate">
      <HeaderPart titleId="FreePattern.title" descriptionId="FreePattern.description" />
      <ViewTable
        mode="Pattern"
        onReadDetail={(id) => router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`)}
        dataSource={state.data}
        total={state.totalRecord}
        loading={state.loading}
        isShowTabs
        itemsTabs={categories as DataType[]}
        pageIndex={params.pageNo}
        pageSize={params.pageSize}
        onPageChange={onPageChange}
        onSearch={onSearchFreePatterns}
        onTabChange={onTabChange}
        onStatusFilter={onStatusFilter}
        isShowStatusFilter
      />
      <FloatButton
        type="primary"
        className="float-btn-right-bottom"
        icon={<PlusOutlined />}
        onClick={onAddPattern}
      />
      <FreePatternFormModal
        modalData={modalData}
        setModalData={setModalData}
        onRefreshData={onRefreshData}
      />
    </div>
  )
}

export default FreePatterns
