export interface ApiAccessLog {
  id: string;
  createdDate: string;
  dataStatus: string;
  apiEndPoint: string;
  ipAddress: string;
  httpMethod: string;
  statusCode: string;
  statusDuration: string;
}
