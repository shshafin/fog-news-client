"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp } from "lucide-react";
import axios from "axios";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";

// Modal Component
const Modal = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-3xl w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Stock Data</h3>
          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((stock: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-md"
            >
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg">
                  {stock["TRADING CODE"]}
                </h3>
                <div
                  className={`text-sm mt-2 text-start ${
                    parseFloat(stock["% CHANGE"]) > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {parseFloat(stock["% CHANGE"]) > 0 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {stock["% CHANGE"]}%
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="block">LTP*: {stock["LTP*"]}</span>
                  <span className="block">High: {stock["HIGH"]}</span>
                  <span className="block">Low: {stock["LOW"]}</span>
                  <span className="block">Volume: {stock["VOLUME"]}</span>
                  <span className="block">Trade: {stock["TRADE"]}</span>
                  <span className="block">YCP*: {stock["YCP*"]}</span>
                  <span className="block">
                    Value (mn): {stock["VALUE (mn)"]}
                  </span>
                  <span className="block">% Change: {stock["% CHANGE"]}%</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {stock["TRADE"]} trades
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ShareMarketFullPage() {
  const [marketData, setMarketData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SHARE_API}`
        );
        setMarketData(response.data.data); // Assuming the response data contains the market data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMarketData();
  }, []);

  const handleSeeMoreClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!marketData) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <main className="min-h-screen bg-background">
        <Header />
        {marketData.length <= 0 ? (
          <div>No Data Found</div>
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <span className="border-l-4 border-red-600 pl-2">
                  {"Share Market"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dse">
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {marketData.map((stock: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-md"
                    >
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-lg">
                          {stock["TRADING CODE"]}
                        </h3>
                        <div
                          className={`text-sm mt-2 text-start ${
                            parseFloat(stock["% CHANGE"]) > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {parseFloat(stock["% CHANGE"]) > 0 ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                          {stock["% CHANGE"]}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="block">LTP*: {stock["LTP*"]}</span>
                          <span className="block">High: {stock["HIGH"]}</span>
                          <span className="block">Low: {stock["LOW"]}</span>
                          <span className="block">
                            Volume: {stock["VOLUME"]}
                          </span>
                          <span className="block">Trade: {stock["TRADE"]}</span>
                          <span className="block">YCP*: {stock["YCP*"]}</span>
                          <span className="block">
                            Value (mn): {stock["VALUE (mn)"]}
                          </span>
                          <span className="block">
                            % Change: {stock["% CHANGE"]}%
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stock["TRADE"]} trades
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Footer />
      </main>
    </Suspense>
  );
}
