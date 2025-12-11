"use client";

import { Home, Inbox, Calendar, Search, Settings, Plus, Projector, User2, ChevronUp } from "lucide-react"; // ⬅️ removed Sidebar here
import {
  Sidebar,               // ⬅️ your real Sidebar from local file
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./sidebar";

import Link from "next/link";
import Image from "next/image";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "./dropdown-menu";

// ❌ remove: import { title } from "process"

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Search", url: "/search", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
];

const AppSideBar = () => {
  return (
    <Sidebar  collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/favicon.ico?favicon.0b3bf435.ico" alt="logo" width={20} height={20} />
                <span>Mubarak Albahri</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {/* Use Next Link instead of <a> */}
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
{/*------------------------------------Side Bar Projects-----------------------------------------------------------*/}
        <SidebarGroup>

         <SidebarGroupLabel>Projects</SidebarGroupLabel>
         <SidebarGroupAction>

          <Plus /> <span className="sr-only">Add Project</span>

         </SidebarGroupAction>
         <SidebarGroupContent>

              <SidebarMenu>

              <SidebarMenuItem>

              <SidebarMenuButton asChild>

              <Link href="#">
              
              <Projector/>
              See All Projector
              
              
              </Link>


              </SidebarMenuButton>



              </SidebarMenuItem>



              </SidebarMenu>




         </SidebarGroupContent>

        </SidebarGroup>



      </SidebarContent>

    


   
      
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      





    




      
      
    </Sidebar>
  );
};

export default AppSideBar;
