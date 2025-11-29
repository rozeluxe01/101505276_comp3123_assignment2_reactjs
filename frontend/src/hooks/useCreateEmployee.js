import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apiClient";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee) => {
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

      const res = await api.post("/emp/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
