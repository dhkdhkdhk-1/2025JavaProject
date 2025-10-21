import { api } from "./AuthApi";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export const getUsers = async (page = 0, size = 10) => {
  const res = await api.get<PageResponse<User>>(
    `admin/user/list?page=${page}&size=${size}`
  );
  return res.data;
};

export const updateUser = async (id: number, data: any) => {
  const res = await api.put(`/user/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/user/${id}`);
};
