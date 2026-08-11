/**
 * Application configuration
 *
 * Toggle USE_REAL_BACKEND to switch between mock data and the Spring Boot backend.
 *
 * To use the real backend:
 *   1. Start the Spring Boot app: cd starter-project/backend && mvn spring-boot:run
 *   2. Set USE_REAL_BACKEND = true below
 *   3. Reload the page in the browser
 */
export const USE_REAL_BACKEND = false;
export const API_BASE_URL = 'http://localhost:8080/api/v1';
