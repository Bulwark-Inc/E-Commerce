export const AUTH_ENDPOINTS = {
    login: '/api/user/auth/login/',
    register: '/api/user/auth/register/',
    refresh: '/api/user/auth/token/refresh/',
    passwordReset: '/api/user/auth/password-reset/',
  };
  
  export const USER_ENDPOINTS = {
    profile: '/api/user/profile/',
    addresses: {
      list: '/api/user/addresses/',
      detail: (id) => `/api/user/addresses/${id}/`,
    },
  };
  