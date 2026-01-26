import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import DoctorAgentCard from './DoctorAgentCard'

function DoctorsAgentList() {
  return (
    <div className='mt-10'>
      <h2 className='font-extrabold text-xl'>AI Specialist Doctors Agent</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-5">
        {AIDoctorAgents.map((doc: any, index)=>  (
            <div key = {index}>
                <DoctorAgentCard  doctor ={doc}/>
            </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsAgentList
