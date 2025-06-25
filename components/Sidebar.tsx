import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CategoryIcon from "@mui/icons-material/Category";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  collapsed: boolean;
}

const drawerWidth = 260;

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
    { text: "Products", icon: <CategoryIcon />, href: "/products" },
    { text: "Orders", icon: <FavoriteBorderIcon />, href: "/orders" },
    { text: "Profile", icon: <AccountBoxIcon />, href: "/profile" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 60 : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? 60 : drawerWidth,
          marginTop: "60px",
          height: "calc(100% - 64px)",
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <Link href={item.href} passHref>
              <Tooltip title={collapsed ? item.text : ""} placement="right">
                <ListItemButton
                  selected={pathname === item.href}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: 2.5,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "none",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 3,
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        sx: {
                          color: "#000",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "none",
                          },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
