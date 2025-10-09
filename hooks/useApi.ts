import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import axiosSecure from "./UseAxiosSecure";
import toast from "react-hot-toast";

// Fetch data
export function useApi<TData = unknown>(
  key: QueryKey,
  endpoint: string,
  enabled = true
) {
  return useQuery<TData>({
    queryKey: key,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(endpoint);
        return res.data.data;
      } catch (error: any) {
        // toast.error("Error fetching data.");
        throw error;
      }
    },
    enabled,
  });
}

// Reset Password mutation
export function useResetPassword() {
  return useMutation<any, unknown, any>({
    mutationKey: ["RESET_PASSWORD"], // Added dynamic mutation key
    mutationFn: async ({ newPassword, token }) => {
      try {
        const response = await axiosSecure.post(
          "/auth/reset-password",
          { newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        toast.error("Failed to reset the password. Please try again.");
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
    },
    onError: () => {
      // toast.error("Error resetting password.");
    },
  });
}

// Post mutation
export function usePost<TPayload = any, TResponse = any>(
  endpoint: string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, TPayload>({
    mutationKey: keyToInvalidate ? [keyToInvalidate] : ["CREATE"], // Dynamically set mutation key
    mutationFn: async (data) => {
      try {
        const res = await axiosSecure.post(endpoint, data);
        return res.data;
      } catch (error: any) {
        // toast.error("Error posting data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      // toast.error("Error posting data.");
    },
  });
}

// Post With Files mutation
export function usePostWithFiles<TPayload = any, TResponse = any>(
  endpoint: string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, TPayload>({
    mutationKey: keyToInvalidate ? [keyToInvalidate] : ["CREATE"], // Dynamically set mutation key
    mutationFn: async (data) => {
      const isFormData =
        typeof FormData !== "undefined" && data instanceof FormData;
      const res = await axiosSecure.post(endpoint, data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: (error) => {
      // toast.error("Failed to submit the data.");
    },
  });
}

// PUT mutation
export function usePut<TPayload = any, TResponse = any>(
  endpoint: string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, TPayload>({
    mutationKey: keyToInvalidate ? [keyToInvalidate] : ["UPDATE"], // Dynamically set mutation key
    mutationFn: async (data) => {
      try {
        const res = await axiosSecure.put(endpoint, data);
        return res.data;
      } catch (error: any) {
        // toast.error("Error updating data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
      toast.success("Data updated successfully!");
    },
    onError: () => {
      // toast.error("Error updating data.");
    },
  });
}

// PATCH mutation
export function usePatch<TPayload = any, TResponse = any>(
  getEndpoint: (id: string) => string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, { id: string; data: TPayload }>({
    mutationKey: keyToInvalidate ? [keyToInvalidate] : ["UPDATE"], // Dynamically set mutation key
    mutationFn: async ({ id, data }) => {
      try {
        const endpoint = getEndpoint(id);
        const res = await axiosSecure.patch(endpoint, data);
        return res.data;
      } catch (error: any) {
        // toast.error("Error updating data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      toast.error("Error updating data.");
    },
  });
}

// PATCH With Files mutation
export function usePatchWithFiles<TPayload = any, TResponse = any>(
  getEndpoint: (id: string) => string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, { id: any; data: TPayload }>({
    mutationKey: keyToInvalidate ? [keyToInvalidate] : ["UPDATE"], // Dynamically set mutation key
    mutationFn: async ({ id, data }) => {
      try {
        const endpoint = getEndpoint(id);
        const isFormData =
          typeof FormData !== "undefined" && data instanceof FormData;
        const res = await axiosSecure.patch(endpoint, data, {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        });
        return res.data;
      } catch (error: any) {
        // toast.error("Error updating data with files.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      // toast.error("Error updating data with files.");
    },
  });
}

// PATCH For Poll mutation
export function usePatchForPoll<TPayload = any, TResponse = any>(
  getEndpoint: (pollId: string, optionId: string) => string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<
    TResponse,
    unknown,
    { pollId: string; optionId: string; data: TPayload }
  >({
    mutationKey: keyToInvalidate ? [keyToInvalidate] : ["UPDATE"], // Dynamically set mutation key
    mutationFn: async ({ pollId, optionId, data }) => {
      try {
        const endpoint = getEndpoint(pollId, optionId);
        const res = await axiosSecure.patch(endpoint, data);
        return res.data;
      } catch (error: any) {
        // toast.error("Error updating data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      // toast.error("Error updating data.");
    },
  });
}

// DELETE mutation
export function useDelete<TResponse = any>(
  endpoint: (id: string | number) => string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, string | number>({
    mutationKey: keyToInvalidate ? [keyToInvalidate] : ["DELETE"], // Dynamically set mutation key
    mutationFn: async (id) => {
      try {
        const res = await axiosSecure.delete(endpoint(id));
        return res.data;
      } catch (error: any) {
        // toast.error("Error deleting data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      // toast.error("Error deleting data.");
    },
  });
}
