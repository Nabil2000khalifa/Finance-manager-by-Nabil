import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetsService } from "../features/budgets/budgets.service";
import { billsService } from "../features/bills/bills.service";

const budgetKeys = {
  all: ["budgets"],
  lists: () => [...budgetKeys.all, "list"],
  list: (month) => [...budgetKeys.lists(), month],
};

const billKeys = {
  all: ["bills"],
  lists: () => [...billKeys.all, "list"],
};

export const useBudgets = (month) => {
  return useQuery({
    queryKey: budgetKeys.list(month),
    queryFn: () => budgetsService.getBudgets({ month }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => budgetsService.createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
    },
  });
};

export const useBills = () => {
  return useQuery({
    queryKey: billKeys.lists(),
    queryFn: () => billsService.getBills(),
    staleTime: 3 * 60 * 1000,
  });
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => billsService.createBill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.lists() });
    },
  });
};

export const useDeleteBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId) => billsService.deleteBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billKeys.lists() });
    },
  });
};
