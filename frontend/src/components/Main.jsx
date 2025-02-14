import React from 'react'
import Navbar from './Navbar'


const Main1 = ({child}) => {
    // props should be is paased in  curly braces
  return (
    <div>
        <Navbar/>
        <div className="main-content">
          {child}
        </div>
    </div>
  )
}

export default Main1