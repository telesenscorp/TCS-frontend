import React from 'react'
import Text from '../Text'
import {ReactComponent as ErrorSvg} from "../../assets/warning.svg"


const Error = ({dropzoneError}) => {
  return (
    <div className='dropzone-error'>
      <ErrorSvg/>
      <Text type="Overline">{dropzoneError}</Text>
    </div>
  )
}

export default Error 