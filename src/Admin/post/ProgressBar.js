import React, { useEffect } from 'react'

const ProgressBar = ({p}) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--p', p + "px");
  }, [p])
  if (!p) return;
  return (
    <div className="progress-bar">
      <div>
        {p}
      </div>
    </div>
  )
}

export default ProgressBar