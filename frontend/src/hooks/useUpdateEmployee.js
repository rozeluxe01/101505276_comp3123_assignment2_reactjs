import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apiClient";

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, employee }) => {
      const formData = new FormData();

      formData.append("firstName", employee.firstName);
      formData.append("lastName", employee.lastName);
      formData.append("email", employee.email);
      formData.append("department", employee.department);
      formData.append("position", employee.position);
      formData.append("salary", employee.salary);
      formData.append("dateOfJoining", employee.dateOfJoining);

      if (employee.profilePicFile) {
        formData.append("profilePic", employee.profilePicFile);
      }

      const res = await api.put(`/emp/employees/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
    },
  });
}
