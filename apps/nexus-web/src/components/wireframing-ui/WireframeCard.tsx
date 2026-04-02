import React from 'react'

export const WireframeCard = ({children} : {children: React.ReactNode}) => {
  return (
    <> 
    <div className="flex flex-col gap-2 p-4 rounded-2xl border-black border-2 bg-white text-black">
        {children}</div></>
  )
}
