import React, { useState, useRef, useCallback } from 'react'
import { BookSearch } from './components/BookSearch/BookSearch'
import BooksList from './components/BooksList/BooksList'
import { Preloader } from './components/Preloader/Preloader'
import { useBooksSearch } from './hooks/useBooksSearch'
import { IPageNumber } from './models/PageNumber/PageNumber'

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<IPageNumber>({ beg: 1, end: 1, action: 'next' })

  const { booksCollection, loading, hasMore } = useBooksSearch({ query, pageNumber })

  const setQueryHandler = (newQuery: string): void => {
    setPageNumber({ beg: 1, end: 1, action: 'next' })
    setQuery(newQuery)
  }

  const observer = useRef<IntersectionObserver | undefined>()
  const lastBookCardRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current != null) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prev) => ({ ...prev, end: prev.end + 1 }))
        console.log('visible')
      }
    })
    if (node != null) observer.current.observe(node)
  }, [loading, hasMore])

  return (
    <div className='App'>
      <BookSearch setQueryHandler={setQueryHandler} />
      <>
        {booksCollection.map((booksElement) => (
          <BooksList key={booksElement.page} lastBookCardRef={lastBookCardRef} booksData={booksElement.booksData} />
        ))}
      </>
      <Preloader loading={loading} />
    </div>
  )
}

export default App
