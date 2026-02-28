import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
type Props = {
    historyList: SessionDetail[]
}
import moment from "moment";

function HistoryTable({ historyList }: Props) {
  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">AI Medical Specialist</TableHead>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {historyList.map((record: SessionDetail, index: number) => (
                <TableRow key={record.sessionId}>
                    <TableCell className="font-medium">{record.selectedDoctor?.specialist || "Unknown Specialist"}</TableCell>
                    <TableCell>{record.notes}</TableCell>
                    <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
                    <TableCell className="text-right">
                        {/* <a href={`/dashboard/history/${record.sessionId}`} className="text-blue-500 hover:underline">View Details</a> */}
                        <Button variant= {'link'} size = {'sm'} className="cursor-pointer">View Details</Button>
                    </TableCell>
                </TableRow>
            ))}

          {/* <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
