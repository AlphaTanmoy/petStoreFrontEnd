export interface MenuItem {
  id: string;
  menuName: string;
  parentId: string;
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
  isVisibleToGuest: boolean;
  isAvailableWhileLoggedOut: boolean;
  isAssignedToParentMenu: boolean;
  svgFileBase64: string;
  listOfSubMenu: MenuItem[];
} 