"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard'
import { Circle, PhoneCall, PhoneOff } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

import Vapi from '@vapi-ai/web';

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdBy: string;
  createdOn: string;
}

function MedicalVoiceAgent() {
  const {sessionId} = useParams()
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();

  const [callStarted, setCallStarted] = useState(false);

  const [vapiInstance, setVapiInstance] = useState<any>();
  
  const [currentRole, setCurrentRole] = useState<string | null>();

  const [liveTranscript, setLiveTranscript] = useState<string>();

  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);

  useEffect(() => {
    sessionId && getSessionDetails();
  }, [sessionId])


  const getSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId="+sessionId)
    console.log(result.data)
    setSessionDetail(result.data)
  }

  const startCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
    // Listen for events
    vapi.on("call-start", () => {
      (console.log("Call started"), setCallStarted(true));
    });
    vapi.on("call-end", () => {
      (console.log("Call ended"), setCallStarted(false));
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const {role, transcriptType, transcript} = message;
        console.log(`${message.role}: ${message.transcript}`);
        if(transcriptType == 'partial'){
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if(transcriptType == 'final') {
          setMessages(prev => [...(prev || []), {role, text: transcript}]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

        vapiInstance.on("speech-start", () => {
          console.log("Assistant started speaking");
          setCurrentRole("Assistant");
        });
        vapiInstance.on("speech-end", () => {
          console.log("Assistant stopped speaking");
          setCurrentRole("User");
        });
  };

    const endCall = () => {
      if(!vapiInstance) return;
      console.log("Ending call...");
      vapiInstance.stop();

      vapiInstance.off("call-start");
      vapiInstance.off("call-end");
      vapiInstance.off("message");
      
      setCallStarted(false);
      setVapiInstance(null);
    };

  return (
    <div className='p-7 border-2 rounded-2xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className={`h-4 w-4 rounded-full ${callStarted ? "fill-green-500" : "fill-red-500"}`}/>{callStarted ? "Connected..." : "Not Connected"}</h2>
        <h2 className='font-bold text-2xl text-gray-600'>00:00</h2>
      </div>
      {sessionDetail && <div className='flex items-center flex-col mt-10'>
          <Image src = {sessionDetail?.selectedDoctor?.image || '/doctor-placeholder.png'} alt= {sessionDetail?.selectedDoctor?.specialist || ''} width={120} height={120} className='h-25 w-25 object-cover rounded-full'/>
          <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
          <p className='text-sm text-gray-600'>AI Medical Voice Agent</p>

          <div className='mt-32 overflow-y-auto flex flex-col items-center px-10 md:px-20 lg:px-52 xl:px-72'>
            {messages?.slice(-4).map((msg, index)=> (
              <h2 className='text-gray-500 p-2' key={index}>{msg.role}: {msg.text}</h2>
            ))}
            {liveTranscript&&liveTranscript.length>0&&<h2 className='text-lg'>{currentRole}: {liveTranscript}</h2>}
          </div>


          {!callStarted? <Button className='mt-20 cursor-pointer' onClick={startCall}> <PhoneCall/> Start Session </Button>: <Button variant="destructive" className='mt-20 cursor-pointer' onClick={endCall}> <PhoneOff/> End Session </Button>}
      </div>}
    </div>
  )
}

export default MedicalVoiceAgent
