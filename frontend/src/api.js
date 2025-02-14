// Replace baseURL with environment variable
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
}); 