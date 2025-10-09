// "use client";

// import { useLanguage } from "../providers/language-provider";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import Link from "next/link";
// import { useCallback, useEffect, useMemo, useState, memo } from "react";
// import { VideoPlayer } from "./video-player";
// import { useApi } from "@/hooks/useApi";
// import { IMultimedia } from "@/lib/content-models";
// import { ChevronLeft, ChevronRight, Loader2, Play, Video } from "lucide-react";

// interface MultimediaProps {
//   currentPath?: string;
// }

// // Optimized skeleton component
// const VideoSkeleton = memo(() => (
//   <Card className="overflow-hidden border-0 shadow-lg">
//     <CardContent className="p-0">
//       <div className="relative">
//         <Skeleton className="aspect-video w-full" />
//         {/* Play button skeleton */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <Skeleton className="w-12 h-12 rounded-full" />
//         </div>
//       </div>
//       <div className="p-4 space-y-2">
//         <Skeleton className="h-5 w-full" />
//         <Skeleton className="h-4 w-3/4" />
//       </div>
//     </CardContent>
//   </Card>
// ));

// VideoSkeleton.displayName = "VideoSkeleton";

// // Optimized video card wrapper
// const VideoCard = memo(
//   ({ video, index }: { video: IMultimedia; index: number }) => {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//       <Card
//         className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-card"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}>
//         <CardContent className="p-0">
//           <div className="relative">
//             <VideoPlayer video={video} />

//             {/* Enhanced overlay for better visual appeal */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//             {/* Enhanced play button overlay */}
//             {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
//               <div
//                 className={`
//               flex items-center justify-center rounded-full bg-red-600/90 backdrop-blur-sm text-white transition-all duration-300
//               ${isHovered ? "w-16 h-16 scale-110" : "w-12 h-12"}
//             `}>
//                 <Play
//                   className={`fill-current ${
//                     isHovered ? "w-6 h-6" : "w-5 h-5"
//                   }`}
//                 />
//               </div>
//             </div> */}
//           </div>

//           {/* Enhanced title section */}
//           <div className="p-4">
//             <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-red-600 transition-colors duration-200 leading-tight">
//               {video.title}
//             </h3>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }
// );

// VideoCard.displayName = "VideoCard";

// // Enhanced header component
// const MultimediaHeader = memo(
//   ({
//     title,
//     isFull,
//     isLoading,
//     videosCount,
//   }: {
//     title: string;
//     isFull: boolean;
//     isLoading: boolean;
//     videosCount: number;
//   }) => (
//     <div className="flex justify-between items-center mb-8">
//       <div className="flex items-center gap-4">
//         <div className="flex items-center gap-3">
//           <div className="w-1 h-12 bg-gradient-to-b from-red-600 to-red-500 rounded-full"></div>
//           <div>
//             <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
//               {title}
//               {!isLoading && videosCount > 0 && (
//                 <div className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
//                   <Video className="w-3 h-3" />
//                   {videosCount}
//                 </div>
//               )}
//             </h2>
//             <p className="text-muted-foreground text-sm mt-1">
//               Latest multimedia content and video updates
//             </p>
//           </div>
//         </div>
//       </div>

//       {!isFull && (
//         <Link
//           href="/multimedia"
//           className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
//           View All Videos
//           <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//         </Link>
//       )}
//     </div>
//   )
// );

// MultimediaHeader.displayName = "MultimediaHeader";

// // Enhanced controls component
// const MultimediaControls = memo(
//   ({
//     rowsPerPage,
//     onRowsPerPageChange,
//     totalItems,
//     startIndex,
//     endIndex,
//     language,
//   }: {
//     rowsPerPage: number;
//     onRowsPerPageChange: (value: number) => void;
//     totalItems: number;
//     startIndex: number;
//     endIndex: number;
//     language: string;
//   }) => (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 p-4 bg-muted/30 rounded-lg border">
//       <p className="text-sm text-muted-foreground">
//         {language === "en"
//           ? `Showing ${startIndex} to ${endIndex} of ${totalItems} videos`
//           : `${totalItems} টি ভিডিওর মধ্যে ${startIndex} থেকে ${endIndex} দেখানো হচ্ছে`}
//       </p>

//       <div className="flex items-center gap-2">
//         <label
//           htmlFor="rows"
//           className="text-sm font-medium text-muted-foreground">
//           {language === "en" ? "Show:" : "দেখান:"}
//         </label>
//         <select
//           id="rows"
//           value={rowsPerPage}
//           onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
//           className="h-9 px-3 rounded-lg border bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200">
//           {[3, 6, 9, 12, 18].map((n) => (
//             <option
//               key={n}
//               value={n}>
//               {n}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   )
// );

// MultimediaControls.displayName = "MultimediaControls";

// // Enhanced pagination component
// const MultimediaPagination = memo(
//   ({
//     currentPage,
//     totalPages,
//     onPageChange,
//     pageNumbers,
//     totalItems,
//     startIndex,
//     endIndex,
//     language,
//   }: {
//     currentPage: number;
//     totalPages: number;
//     onPageChange: (page: number) => void;
//     pageNumbers: number[];
//     totalItems: number;
//     startIndex: number;
//     endIndex: number;
//     language: string;
//   }) => (
//     <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 pt-8 border-t border-border">
//       <div className="text-sm text-muted-foreground">
//         {language === "en"
//           ? `Showing ${startIndex} to ${endIndex} of ${totalItems} videos`
//           : `${totalItems} টি ভিডিওর মধ্যে ${startIndex} থেকে ${endIndex} দেখানো হচ্ছে`}
//       </div>

//       <div className="flex items-center gap-1">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//           <ChevronLeft className="h-4 w-4" />
//         </button>

//         {pageNumbers.map((pageNumber, index) => (
//           <button
//             key={index}
//             onClick={() => onPageChange(pageNumber)}
//             className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
//               currentPage === pageNumber
//                 ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg scale-105"
//                 : "border border-border bg-background hover:bg-accent hover:border-red-300"
//             }`}>
//             {pageNumber}
//           </button>
//         ))}

//         {totalPages > 5 && currentPage < totalPages - 2 && (
//           <span className="mx-2 text-muted-foreground">...</span>
//         )}

//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//           <ChevronRight className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   )
// );

// MultimediaPagination.displayName = "MultimediaPagination";

// export default function MultimediaSection({ currentPath }: MultimediaProps) {
//   const { language, t } = useLanguage();
//   const [isFull, setIsFull] = useState(false);
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(6);

//   // API call with optimized caching
//   const {
//     data: videos = [],
//     isLoading,
//     error,
//   } = useApi<IMultimedia[]>(["video"], `/video`);

//   // Memoize pagination calculations
//   const paginationData = useMemo(() => {
//     const totalItems = videos.length;
//     const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     const items = videos.slice(start, end);

//     return {
//       totalItems,
//       totalPages,
//       items,
//       startIndex: Math.min(start + 1, totalItems),
//       endIndex: Math.min(end, totalItems),
//     };
//   }, [videos, page, rowsPerPage]);

//   // Check if we're on the full multimedia page
//   useEffect(() => {
//     setIsFull(currentPath?.includes("/multimedia") ?? false);
//   }, [currentPath]);

//   // Reset to first page when page is out of range
//   useEffect(() => {
//     if (page > paginationData.totalPages && paginationData.totalPages > 0) {
//       setPage(1);
//     }
//   }, [page, paginationData.totalPages]);

//   // Optimized handlers with useCallback
//   const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
//     setRowsPerPage(newRowsPerPage);
//     setPage(1);
//   }, []);

//   const handlePageChange = useCallback(
//     (newPage: number) => {
//       setPage(Math.max(1, Math.min(paginationData.totalPages, newPage)));
//       // Smooth scroll to top of section
//       document.getElementById("multimedia-section")?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     },
//     [paginationData.totalPages]
//   );

//   // Generate page numbers for pagination
//   const pageNumbers = useMemo(() => {
//     const { totalPages } = paginationData;
//     if (totalPages <= 5) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }

//     if (page <= 3) {
//       return [1, 2, 3, 4, 5];
//     }

//     if (page >= totalPages - 2) {
//       return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
//     }

//     return Array.from({ length: 5 }, (_, i) => page - 2 + i);
//   }, [page, paginationData.totalPages]);

//   // Get items to display based on context
//   const displayItems = useMemo(() => {
//     if (isFull) {
//       return paginationData.items;
//     }
//     // For homepage, show latest 6 videos in 2 rows
//     return videos.slice(0, 6);
//   }, [isFull, paginationData.items, videos]);

//   if (error) {
//     return (
//       <section
//         id="multimedia-section"
//         className="py-12">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-center items-center">
//             <Card className="w-full max-w-md border-destructive/20">
//               <CardContent className="p-8 text-center">
//                 <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
//                   <Video className="w-8 h-8 text-destructive" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-foreground mb-2">
//                   Failed to Load Videos
//                 </h3>
//                 <p className="text-muted-foreground text-sm mb-6">
//                   We're having trouble loading the multimedia content. Please
//                   check your connection and try again.
//                 </p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
//                   Try Again
//                 </button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section
//       id="multimedia-section"
//       className="py-12 bg-gradient-to-b from-background to-muted/20">
//       <div className="container mx-auto px-4">
//         {/* Header with live indicator */}
//         <MultimediaHeader
//           title={t("section.multimedia")}
//           isFull={isFull}
//           isLoading={isLoading}
//           videosCount={videos.length}
//         />

//         {/* Controls */}
//         {isFull && !isLoading && videos.length > 0 && (
//           <MultimediaControls
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleRowsPerPageChange}
//             totalItems={paginationData.totalItems}
//             startIndex={paginationData.startIndex}
//             endIndex={paginationData.endIndex}
//             language={language}
//           />
//         )}

//         {/* Content */}
//         <div className="relative">
//           {isLoading ? (
//             <div
//               className={`grid gap-6 ${
//                 isFull
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                   : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//               }`}>
//               {Array.from({ length: isFull ? rowsPerPage : 6 }, (_, index) => (
//                 <VideoSkeleton key={index} />
//               ))}
//             </div>
//           ) : displayItems.length > 0 ? (
//             <div
//               className={`grid gap-6 ${
//                 isFull
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                   : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//               }`}>
//               {displayItems.map((video, index) => (
//                 <VideoCard
//                   key={video._id}
//                   video={video}
//                   index={index}
//                 />
//               ))}
//             </div>
//           ) : (
//             <Card className="w-full border-dashed border-2 border-muted-foreground/20">
//               <CardContent className="p-12 text-center">
//                 <div className="w-20 h-20 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
//                   <Video className="w-10 h-10 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-foreground mb-3">
//                   {language === "en"
//                     ? "No Videos Available"
//                     : "কোন ভিডিও উপলব্ধ নেই"}
//                 </h3>
//                 <p className="text-muted-foreground max-w-md mx-auto">
//                   {language === "en"
//                     ? "Our multimedia team is working to bring you the latest video content. Check back soon for updates."
//                     : "আমাদের মাল্টিমিডিয়া টিম আপনার জন্য সর্বশেষ ভিডিও কন্টেন্ট নিয়ে আসার জন্য কাজ করছে। আপডেটের জন্য শীঘ্রই আবার দেখুন।"}
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Pagination for full page */}
//         {paginationData.totalPages > 1 && isFull && !isLoading && (
//           <MultimediaPagination
//             currentPage={page}
//             totalPages={paginationData.totalPages}
//             onPageChange={handlePageChange}
//             pageNumbers={pageNumbers}
//             totalItems={paginationData.totalItems}
//             startIndex={paginationData.startIndex}
//             endIndex={paginationData.endIndex}
//             language={language}
//           />
//         )}

//         {/* Loading overlay for pagination changes */}
//         {isLoading && isFull && (
//           <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
//             <Card>
//               <CardContent className="p-6 flex items-center gap-3">
//                 <Loader2 className="w-5 h-5 animate-spin text-red-600" />
//                 <span className="text-sm font-medium">Loading videos...</span>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
