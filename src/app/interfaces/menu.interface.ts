export interface MenuItem {
  id: string;
  createdDate: string;
  menuName: string;
  parentId?: string;
  doHaveRedirectionLink: boolean;
  menuLink: string | null;
  isASubMenu: boolean;
  canMasterAccess: boolean;
  canAdminAccess: boolean;
  canUserAccess: boolean;
  canDoctorAccess: boolean;
  canSellerAccess: boolean;
  canRiderAccess: boolean;
  chatUsersAccess: boolean;
  customerCareAccess?: boolean;
  isVisibleToGuest: boolean;
  isAssignedToParentMenu: boolean;
  isAvailableWhileLoggedOut?: boolean;
  svgFileDataLink: string;
  listOfSubMenu?: MenuItem[];
  [key: string]: any;
}