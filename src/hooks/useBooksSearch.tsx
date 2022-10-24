/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from 'react'
import axios, { Method, Canceler } from 'axios'
import { BooksData } from '../models/BookData/BookData'

interface IuseBooksSearch {
  query: string
  pageNumber: number

}

interface RIuseBooksSearch {
  booksData: BooksData
  error: FetchError
  loading: Loading
}

type FetchError = Error | null
type Loading = boolean

export const useBooksSearch = ({ query, pageNumber }: IuseBooksSearch): RIuseBooksSearch => {
  const [booksData, setBooksData] = useState<BooksData>([])
  const [error, setError] = useState<FetchError>(null)
  const [loading, setLoading] = useState<Loading>(false)
  const lastQuery = useRef<string>('')

  useEffect(() => {
    let cancel: null | Canceler = null
    void (async () => {
      try {
        if (error == null) setError(null)
        if (query === '') return
        if (!query.startsWith(lastQuery.current)) setBooksData([])
        lastQuery.current = query
        setLoading(true)
        const res = await axios({
          method: 'GET',
          url: 'http://openlibrary.org/search.json',
          params: { q: query, page: pageNumber },
          cancelToken: new axios.CancelToken(c => { cancel = c })
        })
        setLoading(false)
        if (res.status === 200) {
          const { docs }: { docs: BooksData | null } = res.data
          if (docs != null) setBooksData((prev) => [...prev, ...docs])
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

  return { booksData, loading, error }
}
