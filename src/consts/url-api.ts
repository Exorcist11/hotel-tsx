const BASE_URL = "http://127.0.0.1:8000/api";

export const URL = {
  CATEGORY: `${BASE_URL}/categories`,
  CATEGORY_DETAIL: (id: string) => `${BASE_URL}/categories/${id}`,

  LOGIN: `${BASE_URL}/login`,

  ORDER: `${BASE_URL}/orders`,

  DASHBOARD: `${BASE_URL}/dashboard`,
  ROOM: `${BASE_URL}/rooms`,
};
