import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apiClient";

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete("/emp/employees", {
        params: { eid: id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
