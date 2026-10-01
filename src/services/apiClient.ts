import axios from 'axios';
import { STUDENT } from '@constants/student';

export const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Gắn header X-Student-Id theo đúng yêu cầu đề thi
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Student-Id'] = STUDENT.mssv;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn(`[apiClient] Lỗi kết nối (${STUDENT.mssv}):`, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
