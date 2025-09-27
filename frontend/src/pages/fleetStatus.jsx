import React from 'react'

function FleetStatus() {

  return (
    <>
        <div className='flex flex-col '>
            <div className='bg-blue-200'>truck 1</div>
                <div className='bg-yellow-200 flex flex-row '>
                    <div className='mx-1.5'>status: good</div>
                    <div className='mx-1.5'>current miles:18000</div>
                    <div className='mx-1.5'>fuel</div>
                </div>


            <div className='bg-blue-200'>truck 2</div>
            <div className='bg-blue-200'>truck 3</div>
            <div className='bg-blue-200'>truck 4</div>
        </div>

      
    </>
  )
}

export default FleetStatus
