export interface CreateStoreInfoDTO {
  storeName: string;
  description: string;
  officeHour: string;
  dayOff: string;
  homepage: string;
  image: string;
  category: Array<string>;
  ownerId: number;
}
