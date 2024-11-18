// src/utils/apiHelper.js
export const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('token');
  
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  
    try {
      const response = await fetch(url, options);
  
      // If the response is 401 Unauthorized, return a flag indicating the token is expired
      if (response.status === 401) {
        return { unauthorized: true };
      }
  
      // Throw an error for any non-OK status other than 401
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };
  