import Icons from "@/components/global/icons";
import { SidebarConfig } from "@/components/global/app-sidebar";

const sidebarConfig: SidebarConfig = {
  brand: {
    title: "Smart Triage",
    icon: "/logos/health-triage-logo.png",
    href: "/"
  },
  sections: [
    {
      label: "Navigation",
      items: [
        // {
        //   title: "Home",
        //   href: "/",
        //   icon: Icons.home
        // },
        // {
        //   title: "Dashboard",
        //   href: "/dashboard",
        //   icon: Icons.layoutDashboard
        // },
        {
          title: "New Assessment",
          href: "/assessment/new",
          icon: Icons.filePlus
        },
        // {
        //   title: "Assessment History",
        //   href: "/assessment",
        //   icon: Icons.activity
        // },
        // {
        //   title: "Voice Assistant",
        //   href: "/voice-assistant",
        //   icon: Icons.mic
        // }
      ]
    },
    // {
    //     label: "Account",
    //     items: [
    //       {
    //         title: "Profile",
    //         href: "/profile",
    //         icon: Icons.user
    //       },
    //       {
    //         title: "Settings",
    //         href: "/settings",
    //         icon: Icons.settings
    //       }
    //     ]
    //   }
    
  ]
}

export default sidebarConfig