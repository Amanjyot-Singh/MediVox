import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'

export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId?: string;
}

type props = {
    doctor: doctorAgent
}
function DoctorAgentCard({doctor}: props) {
  return (
    <div>
      <Image src={doctor.image} alt={doctor.specialist} width={200} height={300} className='w-full h-62.5 object-cover rounded-xl'/>
      <h2 className='font-bold mt-1'>{doctor.specialist}</h2>
      <p className='line-clamp-2 text-sm text-gray-500'>{doctor.description}</p>
      <Button className='w-full mt-2 cursor-pointer'>Consult Now <IconArrowRight/></Button>
    </div>
  )
}

export default DoctorAgentCard
