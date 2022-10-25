/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from 'react'
import axios, { Method, Canceler } from 'axios'
import { BooksData, BooksStorage } from '../models/BookData/BookData'
import { IPageData } from '../models/PageNumber/PageNumber'
import { InsertOrder, useLimitedLengthStorage } from './useLimitedLengthStorage'

const PAGE_LIMITATION = Number(process.env.REACT_APP_PAGE_LIMITATION)

interface IUseBooksSearch {
  query: string
  pageData: IPageData

}

interface RIuseBooksSearch {
  booksStorage: BooksStorage
  // booksCollection: BooksCollection
  hasMore: boolean
  loading: Loading
  error: FetchError
}

type FetchError = Error | null
type Loading = boolean

export const useBooksSearch = ({ query, pageData }: IUseBooksSearch): RIuseBooksSearch => {
  const { storage, addDataToStorage, eraseStorage } = useLimitedLengthStorage<BooksData>(PAGE_LIMITATION)
  const [error, setError] = useState<FetchError>(null)
  const [loading, setLoading] = useState<Loading>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const lastQuery = useRef<string>('')
  let collectionSize: number = 0

  useEffect(() => {
    let cancel: null | Canceler = null
    void (async () => {
      try {
        if (error == null) setError(null)
        if (query === '') return
        if (query !== lastQuery.current) { eraseStorage(); lastQuery.current = query; collectionSize = 0 }
        setLoading(true)
        const res = await axios({
          method: 'GET',
          url: 'http://openlibrary.org/search.json',
          params: { q: query, page: pageData.current },
          cancelToken: new axios.CancelToken(c => { cancel = c })
        })

        setLoading(false)
        if (res.status === 200) {
          const { docs }: { docs: BooksData } = res.data
          if (collectionSize === 0) collectionSize = docs.length
          const totalBooksInStorage = storage.size * collectionSize + docs.length
          setHasMore(totalBooksInStorage <= res.data.numFound)
          addDataToStorage({ id: pageData.current, data: docs, insertOrder: InsertOrder.AFTER })
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
  }, [query, pageData])

  return { booksStorage: storage, hasMore, loading, error }
}
