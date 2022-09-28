import React from 'react'
import { Button, Typography, Tooltip, Grid } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom'
// import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
// import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

export default function TopMenu(props) {
    let navigate = useNavigate();
    const { userRole } = props;
    const handleClick = (link) => navigate(link);

    let menuItems = [
        { text: userRole === 'ROLE_ADMIN' ? 'Clients' : 'My Info', icon: <PersonIcon style={{color: '#fff'}} />, link: userRole === 'ROLE_ADMIN' ? '/' : '/profile' },
        { text: 'Sign Out', icon: <LogoutIcon style={{color: '#fff'}} />, behavior: props.logOut }
    ];

    if(userRole === 'ROLE_USER') menuItems.splice(0,0,{ text: 'Projects', icon: <DescriptionIcon style={{color: '#fff'}} />, link: userRole === 'ROLE_ADMIN' ? '/projects' : '/' });

    return (
        <Grid container spacing={2} columnSpacing={2} sx={{padding: '15px 50px', backgroundColor: '#0c5093', marginBottom: 5}}>
            <Grid item xs={6} textAlign='left'>
                <NavLink to={'/'} style={{textDecoration: 'none'}}><Typography sx={{ minWidth: 100 }} variant='h4' color={'#fff'}>Client Project Management</Typography></NavLink>
            </Grid>
            <Grid container columnSpacing={2} item xs={6} direction="row" alignItems="flex-end" justifyContent="flex-end">
                <Grid item xs={4} container alignItems="flex-end">
                {
                    menuItems.map(menuItem => {
                        let colSize = 12 / menuItems.length;
                        console.log({colSize})
                        return (
                            <Grid key={menuItem.text} item xs={Math.floor(colSize)} textAlign='right' alignItems={'right'}>
                                <Tooltip title={menuItem.text}>
                                    <Button startIcon={menuItem.icon} variant='text' color='primary' onClick={() => menuItem.link !== undefined ? handleClick(menuItem.link) : menuItem.behavior()}>
                                    
                                    </Button>
                                </Tooltip>
                            </Grid>
                        )
                    })
                }
                </Grid>
            </Grid>
        </Grid>
    )
}
