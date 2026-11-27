import axios from "axios";

const apiUrlPadrao = `${window.location.protocol}//${window.location.hostname}:8080`;

export const api = axios.create({
  // Em rede local, usa o IP/hostname acessado pelo navegador em vez de
  // sempre apontar para localhost, que seria o computador do usuário.
  baseURL: import.meta.env.VITE_API_URL || apiUrlPadrao,
});

// Injeta o token salvo no login em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se a API responder 401, desloga e manda pro login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
