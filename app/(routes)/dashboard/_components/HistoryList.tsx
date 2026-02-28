"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import AddNewSessionDialog from './AddNewSessionDialog';
import axios from 'axios';
import HistoryTable from './HistoryTable';

function HistoryList() {
    const [historyList, setHistoryList] = useState([]);

    const GetHistory = async () => {
      const result = await axios.get("/api/session-chat?sessionId=all");
      const data = await result.data;
      console.log(result.data);
      setHistoryList(data);
    };

    useEffect(() => {
      GetHistory();
    }, []);

  return (
    <div className='mt-12'>
      {historyList.length == 0?
        <div className='flex items-center flex-col justify-center p-7 border-2 border-dashed rounded-2xl'>
            <Image src={"/medical-assistance.png"} alt='empty' width={150} height={150}/>
            <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
            <p className='text-center text-neutral-600 dark:text-neutral-400'>You have not had any consultations yet. Start a new consultation to see your history here.</p>
            <AddNewSessionDialog />
        </div>
        :
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      }
    </div>
  )
}

export default HistoryList
