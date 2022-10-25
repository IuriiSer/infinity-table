import React from 'react'

interface IBookSearch {
  setQueryHandler: (newQuery: string) => void
}

export const BookSearch: React.FC<IBookSearch> = ({ setQueryHandler }: IBookSearch) => {
  return (
    <div className='row'>
      <div className='input-field col s12 m6 offset-m3'>
        <i className='material-icons prefix'>book</i>
        <input id='icon_prefix' type='text' className='validate' onChange={(e) => setQueryHandler(e.target.value)}/>
        <label htmlFor='icon_prefix'>Search query...</label>
      </div>
    </div>
  )
}
