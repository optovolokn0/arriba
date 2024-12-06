import apiClient from "../apiClient";

export const registerUser = async (name: string, email: string, password: string, password_confirm: string, role: string) => {
  return apiClient.post("api/register/", { name, email, password, password_confirm, role });
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post("api/token/", { email, password });

  // Сохраняем access токен и устанавливаем refresh токен в cookies
  localStorage.setItem("access_token", response.data.access);
  return response
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  console.log("Пользователь вышел");
};



