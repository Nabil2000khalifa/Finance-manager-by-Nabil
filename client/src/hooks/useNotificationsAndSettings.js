import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../features/notifications/notifications.service";
import { settingsService } from "../features/settings/settings.service";

const notificationKeys = {
  all: ["notifications"],
  lists: () => [...notificationKeys.all, "list"],
};

const settingKeys = {
  all: ["settings"],
  profile: () => [...settingKeys.all, "profile"],
};

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: () => notificationsService.getNotifications(),
    staleTime: 1 * 60 * 1000, // 1 minute - notifications are real-time
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId) =>
      notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: settingKeys.profile(),
    queryFn: () => settingsService.getProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes - settings don't change often
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => settingsService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.profile() });
    },
  });
};

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => settingsService.updateCurrency(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.profile() });
      // Invalidate all data-related queries since currency affects display
      queryClient.invalidateQueries();
    },
  });
};
