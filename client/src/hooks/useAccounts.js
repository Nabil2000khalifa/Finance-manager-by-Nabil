import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsService } from "../features/accounts/accounts.service";

const accountKeys = {
  all: ["accounts"],
  lists: () => [...accountKeys.all, "list"],
  details: () => [...accountKeys.all, "detail"],
  detail: (id) => [...accountKeys.details(), id],
};

export const useAccounts = () => {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: () => accountsService.getAccounts(),
    staleTime: 5 * 60 * 1000, // 5 minutes - accounts change less frequently
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => accountsService.createAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useTransferFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => accountsService.transferFunds(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
