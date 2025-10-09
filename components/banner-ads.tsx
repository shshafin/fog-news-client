"use client";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { IAd } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";
import Link from "next/link";

function BannerAddPage() {
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
          const startDate = new Date(ads.startDate);
          const endDate = new Date(ads.endDate);

          return (
            ads.type === "banner" &&
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
    <div className="px-4 sm:px-6 lg:px-0">
      {showAdd?._id && (
        <div className="mt-5 mx-auto w-full max-w-[800px] h-40 sm:h-48 md:h-52 lg:h-56 rounded-lg overflow-hidden shadow-lg">
          <Link
            href={`${showAdd?.targetUrl}`}
            target="_blank">
            <img
              src={
                showAdd.imageUrl
                  ? getImageUrl(showAdd?.imageUrl)
                  : "/placeholder.svg"
              }
              alt={showAdd?.title}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>
      )}
    </div>
  );
}

export default BannerAddPage;
