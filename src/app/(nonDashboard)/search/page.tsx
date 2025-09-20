import { Suspense } from 'react'
import SearchContent from './SearchContent'

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}

export default SearchPage
