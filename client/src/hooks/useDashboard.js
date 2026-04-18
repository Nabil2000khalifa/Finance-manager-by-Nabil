import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../features/dashboard/dashboard.service";

const dashboardKeys = {
  all: ["dashboard"],
  summary: () => [...dashboardKeys.all, "summary"],
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardService.getDashboardSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes - frequently updated
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes in background
  });
};
