import React from 'react'
import { BookData } from '../../models/BookData/BookData'

interface IBookCard {
  bookData: BookData
}

export const BookCard: React.FC<IBookCard> = ({ bookData }: IBookCard) => {
  console.log(`render bookCard with key ${bookData.key}`)

  return (
    <div>{bookData.title}</div>
  )
}
