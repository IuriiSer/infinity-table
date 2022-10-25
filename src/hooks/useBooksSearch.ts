/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from 'react'
import axios, { Method, Canceler } from 'axios'
import { BooksData, BooksCollection } from '../models/BookData/BookData'
import { IPageNumber } from '../models/PageNumber/PageNumber'

interface IuseBooksSearch {
  query: string
  pageNumber: IPageNumber

}

interface RIuseBooksSearch {
  booksCollection: BooksCollection
  hasMore: boolean
  loading: Loading
  error: FetchError
}

type FetchError = Error | null
type Loading = boolean

export const useBooksSearch = ({ query, pageNumber }: IuseBooksSearch): RIuseBooksSearch => {
  const [booksCollection, setBooksCollection] = useState<BooksCollection>([])
  const [error, setError] = useState<FetchError>(null)
  const [loading, setLoading] = useState<Loading>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const lastQuery = useRef<string>('')

  useEffect(() => {
    let cancel: null | Canceler = null
    void (async () => {
      try {
        if (error == null) setError(null)
        if (query === '') return
        if (query !== lastQuery.current) { setBooksCollection([]); lastQuery.current = query }
        setLoading(true)
        const page = pageNumber.action === 'next' ? pageNumber.end : pageNumber.beg
        const res = await axios({
          method: 'GET',
          url: 'http://openlibrary.org/search.json',
          params: { q: query, page },
          cancelToken: new axios.CancelToken(c => { cancel = c })
        })
        setLoading(false)

        if (res.status === 200) {
          const { docs }: { docs: BooksData } = res.data
          const totalBooks = booksCollection.reduce((totalBooks, booksElement) => totalBooks + booksElement.booksData.length, 0)
          setHasMore(totalBooks + docs.length <= res.data.numFound)
          setBooksCollection((prev) => prev.concat({ booksData: docs, page }))
        }
      } catch (err) {
        if (err instanceof axios.AxiosError) return
        setLoading(false)
        if (err instanceof Error) {
          setError(err)
          console.log(err.message)
        }
      }
    })()
    return () => { if (cancel != null) cancel() }
  }, [query, pageNumber])

  return { booksCollection, hasMore, loading, error }
}
