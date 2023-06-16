export interface OwnerCreateDTO {
  loginId: string;
  password: string;
  store: string;
  director: string;
  phone: string;
  email: string;
  address: string;
  detailAddress: string;
  licenseNumber: string;
  licenseImage: string;
  authorized: boolean;
  termsAgree: boolean;
  marketingAgree: boolean;
  isGrant: boolean;
}
