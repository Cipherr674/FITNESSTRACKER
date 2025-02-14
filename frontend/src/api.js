// Replace baseURL with environment variable
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
}); 