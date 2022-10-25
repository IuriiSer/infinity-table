/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { memo } from 'react'
import { BooksData, BookData } from '../../../models/BookData/BookData'
import { BookCard } from '../BookCard/BookCard'

interface IBooksList {
  booksData: BooksData
  lastBookCardRef?: (node: HTMLDivElement) => void
}

const BooksList: React.FC<IBooksList> = ({ booksData, lastBookCardRef }: IBooksList) => {
  return (
    <div className='row'>
      <div className='col s12 m8 offset-m2 l6 offset-l3'>
        {booksData.map((bookData: BookData, i: number) => {
          if (lastBookCardRef != null && i === booksData.length - 30) {
            return (
              <React.Fragment key={bookData.key}>
                 <BookCard bookData={bookData} />
                 <div ref={lastBookCardRef} className='observer-anchor' />
               </React.Fragment>
            )
          }
          return (
            <BookCard key={bookData.key} bookData={bookData} />
          )
        })}
      </div>
    </div>
  )
}

export default memo(BooksList)
