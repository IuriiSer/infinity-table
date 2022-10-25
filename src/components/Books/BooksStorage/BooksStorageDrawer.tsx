import React from 'react'
import { BooksStorage } from '../../../models/BookData/BookData'
import BooksList from '../BooksList/BooksList'

interface IBooksStorage {
  booksStorage: BooksStorage
  getFirstPageInBookStorage: () => number
  lastBookCardRef: (node: HTMLDivElement) => void
}

export const BooksStorageDrawer: React.FC<IBooksStorage> = ({ booksStorage, getFirstPageInBookStorage, lastBookCardRef }: IBooksStorage) => {
  const firstPageInBookStorage = getFirstPageInBookStorage()
  return (
    <>
    {Array.from({ length: booksStorage.size }, (_, i) => {
      const page = firstPageInBookStorage + i
      const booksData = booksStorage.get(page)
      if (booksData == null) return (<></>)
      if (i === booksStorage.size - 1) return (<BooksList key={page} lastBookCardRef={lastBookCardRef} booksData={booksData} />)
      return (<BooksList key={page} booksData={booksData} />)
    })}
  </>
  )
}
