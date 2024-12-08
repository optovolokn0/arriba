import apiClient from "../apiClient";

export const registerUser = async (name: string, email: string, password: string, password_confirm: string, role: string) => {
  const response = await apiClient.post("api/register/", { name, email, password, password_confirm, role })
  localStorage.setItem('access_token', response.data.tokens.access);
  localStorage.setItem('refresh_token', response.data.tokens.refresh);
  return response;
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post("api/token/", { email, password });
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  return response
};


export const logoutUser = () => {
  localStorage.removeItem("access_token");
  console.log("Пользователь вышел");
};



