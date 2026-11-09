import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  Users,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";

export const adminNavigation = [
  {
    name: "Overview",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Departments",
    path: "/admin/departments",
    icon: Building2,
  },
  {
    name: "Doctors",
    path: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    name: "Receptionists",
    path: "/admin/receptionists",
    icon: Users,
  },
  {
    name: "Administrators",
    path: "/admin/administrators",
    icon: ShieldCheck,
  },
];

export const doctorNavigation = [
  {
    name: "Overview",
    path: "/doctor/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Live Queue",
    path: "/doctor/queue",
    icon: Users,
  },
];


export const receptionistNavigation = [
  {
    name: "Overview",
    path: "/receptionist/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Register Patient",
    path: "/receptionist/book",
    icon: UserRoundPlus,
  },
  {
    name: "Queue Management",
    path: "/receptionist/queue",
    icon: Users
  }
];