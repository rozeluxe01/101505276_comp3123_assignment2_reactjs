import { useQuery } from "@tanstack/react-query";
import api from "../apiClient";

// Fetch using /emp/employees/search?department=&position=
async function fetchEmployees({ queryKey }) {
  const [_key, { department, position }] = queryKey;

  const params = {};
  if (department) params.department = department;
  if (position) params.position = position;

  const res = await api.get("/emp/employees/search", { params });
  return res.data; // array of employees
}

export function useEmployees(filters) {
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: fetchEmployees,
    staleTime: 1000 * 30, // 30 seconds
  });
}
