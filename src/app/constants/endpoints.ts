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
  [MICROSERVICE_NAME.LIVENESS]: 8085,
  [MICROSERVICE_NAME.MANAGEMENT]: 8086,
  [MICROSERVICE_NAME.S3]: 8087,
  [MICROSERVICE_NAME.SELLER]: 8088,
  [MICROSERVICE_NAME.SANCTION]: 8089,
  [MICROSERVICE_NAME.USER]: 8090,
};

export const Endpoints: APIEndpoints = {
  [MICROSERVICE_NAME.ADMIN]: {
    healthCheck: "health",
    getDashboard: "dashboard",
    getAllAdmins: "getAll",
    toggleAdminStatus: "toggle-status",
    getAdminDetails: "details"
  },
  [MICROSERVICE_NAME.AUTH]: {
    healthCheck: "health",
    login: "login",
    register: "register",
    logout: "logout",
    refresh: "refresh",
    getProfile: "getProfile"
  },
  [MICROSERVICE_NAME.CORE]: {
    healthCheck: "health",
    getNavbar: "navbar/get",
    getProducts: "products/all"
  },
  [MICROSERVICE_NAME.DOC]: {
    healthCheck: "health",
    getAllDoctors: "doctors",
  },
  [MICROSERVICE_NAME.LIVENESS]: {
    healthCheck: "health"
  },
  [MICROSERVICE_NAME.MANAGEMENT]: {
    healthCheck: "health"
  },
  [MICROSERVICE_NAME.USER]: {
    healthCheck: "health",
    getProfile: "profile",
    updateProfile: "update",
    getUsers: "customer/getAll"
  },
  [MICROSERVICE_NAME.S3]: {
    healthCheck: "health",
    uploadFile: "upload",
    getFile: "get"
  },
  [MICROSERVICE_NAME.SANCTION]: {
    healthCheck: "health",
    checkStatus: "check"
  },
  [MICROSERVICE_NAME.SELLER]: {
    healthCheck: "health",
    getProducts: "products",
    addProduct: "product/add"
  },
};


export type EndpointMap = {
  [key: string]: string; // ← this is crucial
};

export type APIEndpoints = {
  [key in MICROSERVICE_NAME]: EndpointMap;
};

/**
 * Gets the complete API endpoint URL for a specific microservice and endpoint
 * @param microServiceName The name of the microservice
 * @param endpointKey The specific endpoint key
 * @returns The complete API endpoint URL
 * @throws Error if the endpoint doesn't exist
 */
export function GetAPIEndpoint(
  microServiceName: MICROSERVICE_NAME,
  endpointKey: string
): string {
  const endpoints = Endpoints[microServiceName]; // endpoints is EndpointMap
  const endpoint = endpoints?.[endpointKey]; // ✅ no error now

  if (!endpoint) {
    throw new Error(`API endpoint '${endpointKey}' not found for microservice '${microServiceName}'`);
  }

  const port = PORT_MAPPING[microServiceName];
  return `${EndpointType.dev}${port}/${endpoint}`;
}

export function ngRock_CORE(endpointKey: string) : string {
  return 'https://877e-150-129-132-124.ngrok-free.app/${endpoint}'
}
