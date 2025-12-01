export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const proxyUrl = config.apiProxyUrl;
  const target = new URL(event.path, proxyUrl).toString();
  return proxyRequest(event, target);
});
