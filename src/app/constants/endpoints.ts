import { MICROSERVICE_NAME } from "./Enums";

export const EndpointType = {
  prod: "www.google.com",
  dev: "http://localhost:"
};

const PORT_MAPPING: Record<MICROSERVICE_NAME, number> = {
  [MICROSERVICE_NAME.ADMIN]: 8081,
  [MICROSERVICE_NAME.AUTHENTICATION]: 8082,
  [MICROSERVICE_NAME.CHAT]: 8083,
  [MICROSERVICE_NAME.CORE]: 8084,
  [MICROSERVICE_NAME.PAYMENT]: 8085,
  [MICROSERVICE_NAME.SELLER]: 8086,
  [MICROSERVICE_NAME.USER]: 8087,
  [MICROSERVICE_NAME.LIVENESS]: 8088,
  [MICROSERVICE_NAME.SANCTION]: 8089,
  [MICROSERVICE_NAME.S3]: 8091,
  [MICROSERVICE_NAME.DOCTOR]: 8092
};

export const Endpoints: APIEndpoints = {
  [MICROSERVICE_NAME.CORE]: {
    getNavbar: "navbar/get",
    getProducts: "products/all"
  },
  [MICROSERVICE_NAME.AUTHENTICATION]: {
    login: "login",
    register: "register",
    logout: "logout",
    refresh: "refresh",
    getProfile: "getProfile"
  },
  [MICROSERVICE_NAME.USER]: {
    getProfile: "profile",
    updateProfile: "update",
    getUsers: "customer/getAll"
  },
  [MICROSERVICE_NAME.ADMIN]: {
    getDashboard: "dashboard",
    getAllAdmins: "getAll",
    toggleAdminStatus: "toggle-status",
    getAdminDetails: "details"
  },
  [MICROSERVICE_NAME.CHAT]: {
    getMessages: "messages",
    sendMessage: "send"
  },
  [MICROSERVICE_NAME.PAYMENT]: {
    createPayment: "create",
    getPaymentStatus: "status"
  },
  [MICROSERVICE_NAME.S3]: {
    uploadFile: "upload",
    getFile: "get"
  },
  [MICROSERVICE_NAME.SANCTION]: {
    checkStatus: "check"
  },
  [MICROSERVICE_NAME.SELLER]: {
    getProducts: "products",
    addProduct: "product/add"
  },
  [MICROSERVICE_NAME.LIVENESS]: {
    healthCheck: "health"
  },
  [MICROSERVICE_NAME.DOCTOR]: {
    getAllDoctors: "doctors",
  }
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
