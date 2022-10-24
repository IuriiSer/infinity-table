import React, { useEffect, useState } from 'react'
import { BookSearch } from './components/BookSearch/BookSearch'

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('')

  const setQueryHandler = (newQuery: string): void => {
    setQuery(newQuery)
  }

  useEffect(() => {
    console.log('file: App.tsx ~ line 7 ~ query', query)
  }, [query])

  return (
    <div className='App'>
      <BookSearch setQueryHandler={setQueryHandler}/>
    </div>
  )
}

export default App
