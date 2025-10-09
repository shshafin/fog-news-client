"use client";

import { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { useApi, useDelete, usePost } from "@/hooks/useApi";
import { IPoll } from "@/lib/content-models";
import { MoreVertical } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function AdminPollPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    options: [{ option: "", votes: 0 }],
  });
  const { mutate: createPoll } = usePost("/poll/create", ["poll"]);
  const { data, refetch } = useApi<IPoll[]>(["poll"], "/poll");
  const [isLoading, setIsLoading] = useState(false);
  const [pollData, setPollData] = useState<IPoll[]>([]);
  const { mutate: deletePoll } = useDelete((id) => `/poll/${id}`, ["poll"]);

  // Pagination
  const totalPages = Math.ceil(pollData.length / itemsPerPage);
  const paginatedPollData = pollData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Handle input change for poll question and options
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedOptions = [...formData.options];
    if (name === "option") {
      updatedOptions[index].option = value;
    } else if (name === "votes") {
      updatedOptions[index].votes = Number(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      options: updatedOptions,
    }));
  };

  // Add new option to the poll
  const handleAddOption = () => {
    setFormData((prevData) => ({
      ...prevData,
      options: [...prevData.options, { option: "", votes: 0 }],
    }));
  };

  // Remove an option from the poll
  const handleRemoveOption = (index: number) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      options: updatedOptions,
    }));
  };

  // Submit poll form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || formData.options.some((opt) => !opt.option)) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await createPoll(formData);
      toast.success("Poll created successfully!");

      // Reset the form after successful submission
      setFormData({
        question: "",
        options: [{ option: "", votes: 0 }],
      }); // Fetch the updated poll data
    } catch (error) {
      toast.error("Failed to create poll. Please try again.");
    }
  };
  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const onDelete = async (poll: IPoll) => {
    try {
      await deletePoll(poll._id || "");
      toast.success("Deleted The Poll");
      setOpenMenuId(null);
      await refetch();
    } catch (error) {
      toast.error("Failed to delete poll. Please try again.");
    }
  };
  // Fetch poll data from the backend

  useEffect(() => {
    const fetchPollData = async () => {
      setIsLoading(true);
      try {
        await refetch();
        if (data) {
          setPollData(data);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching poll data:", error);
      }
    };
    fetchPollData();
  }, [data]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <div className="space-y-6 w-full p-4">
        {/* Poll Form */}
        <div>
          <h2 className="text-xl font-semibold">Create a Poll</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Poll Question</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block">Poll Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="option"
                    value={option.option}
                    onChange={(e) => handleInputChange(e, index)}
                    className="p-2 border rounded w-full"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Add Option
              </button>
            </div>

            <div className="mb-10">
              {" "}
              {/* Added margin bottom */}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded float-right"
              >
                Create Poll
              </button>
            </div>
          </form>
        </div>

        {/* Poll Results Table */}
        {isLoading ? (
          <div>Loading Polls...</div>
        ) : paginatedPollData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No Polls found.{" "}
            </TableCell>
          </TableRow>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mt-8">Poll Results</h2>
            <table className="min-w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Poll Question</th>
                  <th className="border px-4 py-2">Options</th>
                  <th className="border px-4 py-2">Votes</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPollData.map((poll, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{poll.question}</td>
                    <td className="border px-4 py-2">
                      {poll.options.map((option, i) => (
                        <div key={i}>{option.option}</div>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      {poll.options.map((option, i) => (
                        <div key={i}>{option.votes}</div>
                      ))}
                    </td>
                    <td className="p-2 text-center relative">
                      <button
                        onClick={() => poll._id && toggleMenu(poll._id)}
                        className="p-2 rounded hover:bg-[#2a2a2a]"
                      >
                        <MoreVertical className="h-5 w-5 hover:text-white text-black" />
                      </button>

                      {openMenuId === poll._id && (
                        <div className="absolute right-0 mt-2 w-28 border border-[#393939] rounded-md shadow-md z-20">
                          <ul className="text-sm bg-[#2c2c2c] text-white">
                            <li
                              onClick={() => onDelete(poll)}
                              className="px-4 py-2 hover:bg-[#383838] cursor-pointer"
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={
                    currentPage === 1
                      ? undefined
                      : () => setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber: number;

                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Suspense>
  );
}
