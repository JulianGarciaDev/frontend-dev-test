export const API_BASE_URL = "https://itx-frontend-test.onrender.com/api";

export async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`ERROR! HttpStatus: ${response.status}`);
  }
  
  return response.json();
}
