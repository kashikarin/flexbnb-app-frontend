import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getFilterFromSearchParams } from '../services/order'
import { getExistingProperties } from '../services/util.service'
import { useSelector } from 'react-redux'
import { setFilterOrdersBy } from '../store/actions/order.actions'

export function useOrderFilterSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  // const [filterOrdersBy, setFilterOrdersBy] = useState(getFilterFromSearchParams(searchParams))
  const filterOrdersBy = useSelector(state => state.orderModule.filterOrdersBy)
//   useEffect(() => {
//     const parsed = getFilterFromSearchParams(searchParams)
//     setFilterOrdersBy(parsed)
// }, [searchParams])

  useEffect(() => {
    setFilterOrdersBy(getFilterFromSearchParams(searchParams))
  }, [searchParams])

  function setExistOrderFilterSearchParams(newFilterOrdersBy) {
    setSearchParams(getExistingProperties(newFilterOrdersBy))
    setFilterOrdersBy(newFilterOrdersBy)
  }

  return { filterOrdersBy, setExistOrderFilterSearchParams }
}
