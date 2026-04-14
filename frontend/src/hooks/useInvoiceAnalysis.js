import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { analyzeInvoiceAPI } from "../utils/invoiceApi.js";
import { computeFileHash } from "../utils/exportUtils.js";

export const useInvoiceAnalysis = () => {
  const queryClient = useQueryClient();
  const [fileHash, setFileHash] = useState(null);

  const mutation = useMutation({
    mutationFn: async (file) => {
      const hash = await computeFileHash(file);
      setFileHash(hash);

      // Check TanStack Query cache before hitting the API
      const cached = queryClient.getQueryData(["invoice", hash]);
      if (cached) {
        return { data: cached, fromCache: true };
      }

      const result = await analyzeInvoiceAPI(file);
      return result;
    },
    onSuccess: (result) => {
      if (fileHash && result?.data) {
        queryClient.setQueryData(["invoice", fileHash], result.data, {
          updatedAt: Date.now(),
        });
      }
    },
  });

  return {
    analyze: mutation.mutate,
    analyzeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data || null,
    error: mutation.error?.message || null,
    fromCache: mutation.data?.fromCache || false,
    reset: mutation.reset,
  };
};
