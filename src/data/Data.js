// Sidebar imports
import {
    UilEstate,
    UilClipboardAlt,
    UilUsersAlt,
    UilPackage,
    UilUserPlus,
    UilUserMd,
    UilChart,
    UilSignOutAlt,
  } from "@iconscout/react-unicons";
  import { UilFileImport } from "@iconscout/react-unicons";
  // Analytics Cards imports
  import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";
  import { keyboard } from "@testing-library/user-event/dist/keyboard";
  
  // Recent Card Imports
  import img1 from "../imgs/img1.png";
  import img2 from "../imgs/img2.png";
  import img3 from "../imgs/img3.png";
  
  // Sidebar Data
  // import { UilEstate, UilUserPlus, UilUserMd, UilClipboardAlt, UilUsersAlt } from '@iconscout/react-unicons';

export const SidebarData = [
  { icon: UilEstate, heading: "Dashboard", path: "/dashboard" },
  { icon: UilUserPlus, heading: "Add Member", path: "/dashboard/add-member" },
  { icon: UilClipboardAlt, heading: "Add Enquiry", path: "/dashboard/add-enquiry" },
  { icon: UilUserMd, heading: "Add Staff", path: "/dashboard/add-staff" },
  { icon: UilClipboardAlt, heading: "View Enquiry", path: "/dashboard/view-enquiry" },
  { icon: UilUsersAlt, heading: "View Staff", path: "/dashboard/view-staff" },
  { icon: UilFileImport, heading: "Import Members", path: "/dashboard/import-members" },
];