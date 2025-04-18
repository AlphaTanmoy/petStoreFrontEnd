import { MICROSERVICE_NAME } from "./Enums";

export const EndpointType = {
  prod: "www.google.com",
  dev: "http://localhost:"
};

const PORT_MAPPING: Record<MICROSERVICE_NAME, number> = {
  [MICROSERVICE_NAME.ADMIN]: 8081,
  [MICROSERVICE_NAME.AUTH]: 8082,
  [MICROSERVICE_NAME.CORE]: 8083,
  [MICROSERVICE_NAME.DOC]: 8084,
  [MICROSERVICE_NAME.PAYMENT]: 8085,
  [MICROSERVICE_NAME.MANAGEMENT]: 8086,
  [MICROSERVICE_NAME.S3]: 8087,
  [MICROSERVICE_NAME.SELLER]: 8088,
  [MICROSERVICE_NAME.KYC]: 8089,
  [MICROSERVICE_NAME.USER]: 8091,
};


export type EndpointMap = {
  [key: string]: string; // ← this is crucial
};

export type APIEndpoints = {
  [key in MICROSERVICE_NAME]: EndpointMap;
};

/**
 * Generates an API URL using the microservice name and path.
 * @param microServiceName - The microservice name (from enum)
 * @param endpointPath - The specific endpoint path (e.g., 'dashboard', 'auth/login')
 * @returns Full API URL
 */
export function GetAPIEndpoint(
  microServiceName: MICROSERVICE_NAME,
  endpointPath: string
): string {
  const port = PORT_MAPPING[microServiceName];

  if (!port) {
    throw new Error(`No port mapping found for microservice '${microServiceName}'`);
  }

  const cleanedPath = endpointPath.startsWith("/") ? endpointPath.slice(1) : endpointPath;

  return `${EndpointType.dev}${port}/${cleanedPath}`;
}
