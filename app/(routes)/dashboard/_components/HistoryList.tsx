"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';

function HistoryList() {
    const [historyList, setHistoryList] = useState([]);
  return (
    <div className='mt-12'>
      {historyList.length == 0?
        <div className='flex items-center flex-col justify-center p-7 border-2 border-dashed rounded-2xl'>
            <Image src={"/medical-assistance.png"} alt='empty' width={150} height={150}/>
            <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
            <p className='text-center text-neutral-600 dark:text-neutral-400'>You have not had any consultations yet. Start a new consultation to see your history here.</p>
            <Button className='mt-3.5'>+ Start New Consultation</Button>
        </div>
        :
        <div>
          List
        </div>
      }
    </div>
  )
}

export default HistoryList
