import React from 'react'
import { BookData } from '../../../models/BookData/BookData'

interface IBookCard {
  bookData: BookData
}

export const BookCard: React.FC<IBookCard> = ({ bookData }: IBookCard) => {
  return (
    <div>{bookData.title}</div>
  )
}
