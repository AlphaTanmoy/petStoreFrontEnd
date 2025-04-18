export enum CREATION_STATUS {
  CREATED = "CREATED",
  DELETED = "DELETED",
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

export enum DATA_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum DATE_RANGE_TYPE {
  ONE_DAYS = "ONE_DAYS",
  ONE_WEAK = "ONE_WEAK",
  FIFTEEN_DAYS = "FIFTEEN_DAYS",
  ONE_MONTH = "ONE_MONTH",
  THREE_MONTHS = "THREE_MONTHS",
  SIX_MONTHS = "SIX_MONTHS",
  ONE_YEAR = "ONE_YEAR",
  MAX = "MAX"
}

export enum INFO_LOG_TYPE {
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
  SYSTEM = "SYSTEM",
  OTP = "OTP",
  OTHERS = "OTHERS",
  SEEDING = "SEEDING"
}

export enum MICROSERVICE_NAME {
  ADMIN = 'ADMIN',
  AUTH = 'AUTH',
  CORE = 'CORE',
  DOC = 'DOCTOR',
  MANAGEMENT = 'MANAGEMENT',
  PAYMENT = 'PAYMENT',
  S3 = 'S3',
  KYC = 'KYC',
  SELLER = 'SELLER',
  USER = 'USER'
}

export enum RESPONSE_TYPE {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export enum SANCTION_TYPE {
  AMS = "AMS",
  PEP = "PEP",
  AML = "AML"
}

export enum SELLER_ACCOUNT_STATUS {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DEACTIVATED = "DEACTIVATED",
  BANNED = "BANNED",
  CLOSED = "CLOSED",
}

export enum STATUS {
  UP = "UP",
  DOWN = "DOWN",
}

export enum TIRE_CODE {
  TIRE0 = "TIRE0",
  TIRE1 = "TIRE1",
  TIRE2 = "TIRE2",
  TIRE3 = "TIRE3",
  TIRE4 = "TIRE4",
}

export enum USER_ROLE {
  ROLE_MASTER = "ROLE_MASTER",
  ROLE_CUSTOMER = "ROLE_CUSTOMER",
  ROLE_SELLER = "ROLE_SELLER",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_DOCTOR = "ROLE_DOCTOR",
  ROLE_RAIDER = "ROLE_RAIDER",
  ROLE_CUSTOMER_CARE = "ROLE_CUSTOMER_CARE",
  ROLE_DELIVERY_BOY = "ROLE_DELIVERY_BOY",
  GUEST = "GUEST"
}

export enum VERIFICATION_TYPE_STATUS_FOR_LIVENESS {
  LIVENESS_VERIFIED = "LIVENESS_VERIFIED",
  LIVENESS_NOT_VERIFIED = "LIVENESS_NOT_VERIFIED",
  LIVENESS_PENDING = "LIVENESS_PENDING"
}

export enum VERIFICATION_TYPE_STATUS_FOR_SANCTION {
  SANCTION_VERIFIED = "SANCTION_VERIFIED",
  SANCTION_NOT_VERIFIED = "SANCTION_NOT_VERIFIED",
  SANCTION_PENDING = "SANCTION_PENDING",
}
