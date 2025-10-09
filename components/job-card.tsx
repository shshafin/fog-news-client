// components/JobCard.tsx
import React from "react";
import { Card } from "./ui/card";
import Link from "next/link";
import { getImageUrl } from "@/hooks/useGetImage";
import Image from "next/image";

const JobCard = ({ job }: { job: any }) => {
  return (
    <Card className="overflow-hidden p-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold ">{job.title}</p>
          <p className="text-sm font-semibold text-gray-700">{job.company}</p>
        </div>
        <div className="text-gray-500 w-12 h-12 rounded-md text-xs">
          <img
            className="w-12 h-12 rounded-full object-center"
            src={getImageUrl(job?.image)}
            alt={job?.name}
          />
          {/* <Image
            src={job.image ? getImageUrl(job.image) : "/placeholder.svg"}
            alt={job.title}
            fill
            className="w-full h-full object-center"
          /> */}
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-700">
        <div className="text-gray-500 text-sm">{job.location}</div>
        <div className="mt-1 font-semibold text-lg">{job.salary}</div>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm">
        <p>{job.applicationDeadline.slice(0, 10)}</p>
        <Link
          href={`/jobs/${job._id}`}
          className="text-black bg-gray-400 py-1 px-2 rounded-lg font-semibold"
        >
          View details
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;
