import React from 'react'
import { lineSpinner } from 'ldrs'

lineSpinner.register()
const Loading = (props) => {
  return (
    



<l-line-spinner
  size={props.size}
  stroke="3"
  speed="1" 
  color="white" 
></l-line-spinner>
    
  )
}

export default Loading
