"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Loader, Loader2Icon } from 'lucide-react'

export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId?: string;
    subscriptionRequired: string;
}

type props = {
    doctor: doctorAgent
}
function DoctorAgentCard({doctor}: props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const {has} = useAuth();
  //@ts-ignore
  const paidUser = has && has({plan: 'pro'})
  const onStartConsultation = async () => {
    setLoading(true);
    //save info to db
    const result = await axios.post('/api/session-chat', {
      notes: "New Consultation",
      selectedDoctor: doctor,
    });
    console.log("Session Creation Result:", result.data);
    if(result.data?.sessionId){
      console.log("Session Created with ID:", result.data.sessionId);
      //route to conversation session page
      router.push("/dashboard/medical-agent/"+result.data.sessionId)
    }
    setLoading(false);
  }
  return (
    <div className='relative'>
      {doctor.subscriptionRequired && <Badge className='absolute m-2 right-0'>Premium</Badge>}
      <Image src={doctor.image} alt={doctor.specialist} width={200} height={300} className='w-full h-62.5 object-cover rounded-xl'/>
      <h2 className='font-bold mt-1'>{doctor.specialist}</h2>
      <p className='line-clamp-2 text-sm text-gray-500'>{doctor.description}</p>
      <Button className='w-full mt-2 cursor-pointer' onClick={onStartConsultation} disabled={!paidUser && !!doctor.subscriptionRequired}>Consult Now {loading?<Loader2Icon className='animate-spin'/>:<IconArrowRight/>}</Button>
    </div>
  )
}

export default DoctorAgentCard
