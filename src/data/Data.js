// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilUserPlus,
  UilUserMd,
  UilUser,
  UilChart,
} from "@iconscout/react-unicons";
import { UilFileImport } from "@iconscout/react-unicons";

export const SidebarData = [
  { icon: UilUser, heading: "My Profile", path: "/dashboard/profile" },
  { icon: UilEstate, heading: "Dashboard", path: "/dashboard" },
  { icon: UilChart, heading: "Analysis", path: "/dashboard/analysis" },
  { icon: UilUserPlus, heading: "Add Member", path: "/dashboard/add-member" },
  { icon: UilClipboardAlt, heading: "Add Enquiry", path: "/dashboard/add-enquiry" },
  { icon: UilUserMd, heading: "Add Staff", path: "/dashboard/add-staff" },
  { icon: UilClipboardAlt, heading: "View Enquiry", path: "/dashboard/view-enquiry" },
  { icon: UilUsersAlt, heading: "View Staff", path: "/dashboard/view-staff" },
  { icon: UilFileImport, heading: "Import Members", path: "/dashboard/import-members" },
];
