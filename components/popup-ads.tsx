"use client";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { IAd } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";
import Link from "next/link";

function PopupAd() {
  const [showAd, setShowAd] = useState<IAd | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: adsData, refetch: adsFetch } = useApi<IAd[]>(
    ["advertisement"],
    `/advertisement`
  );

  useEffect(() => {
    const fetchData = async () => {
      const isPopupShown = localStorage.getItem("popupShown");
      if (isPopupShown) return;

      await adsFetch();

      if (adsData) {
        const now = new Date();
        const matchAds = adsData.filter((ads) => {
          const startDate = new Date(ads.startDate);
          const endDate = new Date(ads.endDate);

          return (
            ads.type === "popup" &&
            ads.status === "active" &&
            startDate <= now &&
            endDate >= now
          );
        });

        if (matchAds.length > 0) {
          setShowAd(matchAds[0]);

          setTimeout(() => setIsVisible(true), 2000);
          localStorage.setItem("popupShown", "true");
        }
      }
    };

    fetchData();
  }, [adsData, adsFetch]);

  const handleClose = () => setIsVisible(false);

  return (
    <>
      {isVisible && showAd?._id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-md sm:max-w-lg rounded-lg overflow-hidden shadow-2xl transform transition-transform duration-300 hover:scale-105">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition">
              ×
            </button>

            {/* Ad content */}
            <Link
              href={`${showAd?.targetUrl}`}
              target="_blank">
              <img
                src={
                  showAd.imageUrl
                    ? getImageUrl(showAd?.imageUrl)
                    : "/placeholder.svg"
                }
                alt={showAd?.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default PopupAd;
