import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
// import DescriptionIcon from '@mui/icons-material/Description';
// import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom'

const drawerWidth = 240;

export default function LeftMenu(props) {
    let navigate = useNavigate();

    const handleClick = (link) => {
        navigate(link);
    }

    let drawerItems = [
        { text: 'Clients', icon: <PersonIcon />, link: '/' },
        // { text: 'Projects', icon: <DescriptionIcon />, link: '/projects' },
        // { text: 'Send email', icon: <MailIcon />, link: '/email' },
        // { text: 'Settings', icon: <SettingsIcon />, link: '/settings' },
        { text: 'Sign Out', icon: <LogoutIcon />, behavior: props.logOut }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="h6" align='center'>
                        Client Managment
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }} variant="permanent" anchor="left" >
                <Toolbar />
                <Divider />
                <List>
                    {
                        drawerItems.map((menuItem, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => menuItem.link !== undefined ? handleClick(menuItem.link) : menuItem.behavior()}>
                                    <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                    <ListItemText primary={menuItem.text} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </Drawer>
        </Box>
    );
}