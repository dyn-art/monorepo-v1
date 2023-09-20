const baseUrl = process.env.CORE_BASE_URL ?? 'http://localhost:9000';
const corsApiKey = process.env.CORE_CORS_API_KEY ?? 'not-set';

export default {
  baseUrl,
  corsApiKey,
};
