import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "../features/transactions/transactions.service";

// Query keys for consistent cache management
const transactionKeys = {
  all: ["transactions"],
  lists: () => [...transactionKeys.all, "list"],
  list: (filters) => [...transactionKeys.lists(), filters],
  details: () => [...transactionKeys.all, "detail"],
  detail: (id) => [...transactionKeys.details(), id],
};

export const useTransactions = (filters = {}) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionsService.getTransactions(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => transactionsService.createTransaction(payload),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      // Also invalidate dashboard since it shows recent transactions
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId) =>
      transactionsService.deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
