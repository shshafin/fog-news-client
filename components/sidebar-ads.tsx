"use client";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { IAd } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";

function SideBarAddPage() {
  const [showAdd, setShowAdd] = useState<IAd>({} as IAd);
  const { data: adsData, refetch: adsFetch } = useApi<IAd[]>(
    ["advertisement"],
    `/advertisement`
  );
  useEffect(() => {
    const fetchData = async () => {
      await adsFetch();
      if (adsData) {
        const now = new Date();
        const matchAds = adsData.filter((ads) => {
          // Parse startDate and endDate to Date objects
          const startDate = new Date(ads.startDate);
          const endDate = new Date(ads.endDate);

          // Filter ads that are of type "popup", active, and within the date range
          return (
            ads.type === "sidebar" &&
            ads.status === "active" &&
            startDate <= now &&
            endDate >= now
          );
        });
        if (matchAds.length > 0) {
        
          setShowAdd(matchAds[0]);
        }
      }
    };
    fetchData();
  }, [adsData]);
  return (
    <div>
      {" "}
      {showAdd?._id && (
        <div className="p-4 w-full h-fit">
          {/* <h3 className="text-lg font-bold mb-4">{showAdd?.title}</h3> */}
          {/* Hover effect: description will appear */}
          {/* <p className="p-2">{showAdd.description}</p> */}
          {/* Wrap the image with a Link component */}
          <a
            href={`${showAdd?.targetUrl}`} // Ensure the URL has 'https://'
            target={showAdd.target || "_blank"} // Default to '_blank' if no target is set
            rel="noopener noreferrer" // For security reasons when opening in a new tab
            className="relative"
          >
            <img
              src={
                showAdd.imageUrl
                  ? getImageUrl(showAdd?.imageUrl)
                  : "/placeholder.svg"
              }
              alt={showAdd?.title}
              className="object-cover w-full h-full rounded-lg transition-transform duration-300"
            />
          </a>
        </div>
      )}
    </div>
  );
}

export default SideBarAddPage;
