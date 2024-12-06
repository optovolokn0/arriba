import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}api/token/refresh/`,
            {},
            { withCredentials: true } // Refresh токен находится в cookies
        );
        const newAccessToken = response.data.access;

        // Сохраняем новый access токен
        localStorage.setItem("access_token", newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error("Ошибка обновления токена:", error);
        localStorage.removeItem("access_token"); // Удаляем access токен в случае ошибки
        return null;
    }
};

// Интерсептор для обработки ошибок авторизации
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Если access токен истёк, пытаемся обновить его
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // Повторяем оригинальный запрос с новым токеном
                error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return apiClient.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);

// Интерсептор для добавления access токена
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
