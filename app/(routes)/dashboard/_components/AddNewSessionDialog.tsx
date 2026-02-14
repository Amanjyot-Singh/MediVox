"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import axios from "axios";
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";
import { Loader2 } from "lucide-react";
import SuggestedDoctorCard from "./SuggestedDoctorCard";

function AddNewSessionDialog() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();

  const onClickNext = async () => {
    try {
      setLoading(true);

      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      // console.log("Suggested Doctors:", result.data.data);
      setSuggestedDoctors(result.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const onStartConsultation = async () => {
    setLoading(true);
    //save info to db
    const result = await axios.post('/api/session-chat', {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    console.log("Session Creation Result:", result.data);
    if(result.data?.sessionId){
      console.log("Session Created with ID:", result.data.sessionId);
      //route to conversation session page
    }
    setLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mt-3.5">+ Start New Consultation</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>

          <DialogDescription asChild>
            {!Array.isArray(suggestedDoctors) || suggestedDoctors.length === 0 ? (
              <div>
                <h2>Add Symptoms or Any Other Details</h2>
                <Textarea
                  placeholder="Add Your Details Here..."
                  className="h-37.5 mt-2.5"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-sm font-semibold">Select Doctor</h2>
              <div className="grid grid-cols-3 gap-5">
                {suggestedDoctors.map((doctor, index) => (
                  // <DoctorAgentCard key={index} doctor={doctor} />
                  <SuggestedDoctorCard key={index} doctorAgent={doctor} SetSelectedDoctor={setSelectedDoctor} SelectedDoctor={selectedDoctor}/>
                ))}
              </div>
            </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {suggestedDoctors.length === 0 ? (
            <Button disabled={!note || loading} onClick={onClickNext}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Next <IconArrowNarrowRight />
                </>
              )}
            </Button>
          ) : (
            <Button disabled={loading || !selectedDoctor} onClick={()=> onStartConsultation()}>
              Start Consultation <IconArrowNarrowRight />
                {/* <Loader2 className="animate-spin" /> */}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
