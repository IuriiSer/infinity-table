import React from 'react'

interface IPreloader {
  loading: boolean
}

export const Preloader: React.FC<IPreloader> = ({ loading }: IPreloader) => {
  return (
    <>
      {loading && (
        <div className='row'>
          <div className="col s6 offset-s3 m4 offset-m4 l2 offset-l5">
              <div className="progress">
                <div className="indeterminate" />
              </div>
          </div>
        </div>
      )}
    </>
  )
}
