import React, { useState, useRef, useCallback } from 'react'
import { BookSearch } from './components/Books/BookSearch/BookSearch'
import { BooksStorageDrawer } from './components/Books/BooksStorage/BooksStorageDrawer'
import { Preloader } from './components/Preloader/Preloader'
import { useBooksSearch } from './hooks/useBooksSearch'
import { IPageData } from './models/PageNumber/PageNumber'

const PAGE_LIMITATION = Number(process.env.REACT_APP_PAGE_LIMITATION)

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [pageData, setPageNumber] = useState<IPageData>({ current: 1, lastAction: 'next' })

  const { booksStorage, loading, hasMore } = useBooksSearch({ query, pageData })

  const setQueryHandler = (newQuery: string): void => {
    setPageNumber({ current: 1, lastAction: 'next' })
    setQuery(newQuery)
  }

  const observer = useRef<IntersectionObserver | undefined>()
  const lastBookCardRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current != null) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prev) => ({ current: prev.current + 1, lastAction: 'next' }))
      }
    })
    if (node != null) observer.current.observe(node)
  }, [loading, hasMore])

  const getFirstPageInBookStorage = useCallback(() => {
    if (booksStorage.size < PAGE_LIMITATION) return 1
    if (loading) return pageData.current - PAGE_LIMITATION
    else return pageData.current - PAGE_LIMITATION + 1
  }, [loading, booksStorage])

  return (
    <div className='App'>
      <BookSearch setQueryHandler={setQueryHandler} />
      {pageData.lastAction === 'prev' && <Preloader loading={loading} />}
      <BooksStorageDrawer booksStorage={booksStorage} lastBookCardRef={lastBookCardRef} getFirstPageInBookStorage={getFirstPageInBookStorage}/>
      {pageData.lastAction === 'next' && <Preloader loading={loading} />}
    </div>
  )
}

export default App
