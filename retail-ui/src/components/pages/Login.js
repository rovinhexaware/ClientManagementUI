import React, { useState } from 'react'
import { TextField, Grid, Card, CardContent, Typography, Collapse, Alert, AlertTitle, Box } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import apiReq from '../scripts/apiReq'
import User from '../../assets/userStock.png'
import LoadingButton from '@mui/lab/LoadingButton';

export default function Login(props) {
    const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
    const [showStatus, setStatusMsg] = useState({ show: false, msg: '', title: '', severity: 'info' });
    const [isSubmitting, setisSubmitting] = useState(false);

    const handleChange = (e) => {
        // console.log('change', e.target.name, e.target.value);

        let value = e.target.value;
        setLoginCredentials({
            ...loginCredentials,
            [e.target.name]: value
        })
    }

    const { username, password } = loginCredentials;

    const validateForm = () => {
        if (username === "" || username === null || username === undefined) return false;
        if (password === "" || password === null || password === undefined) return false;

        return true;
    }

    const handleSubmit = (e) => {
        // console.log('submiotting')
        setisSubmitting(true);
        setStatusMsg({ show: false });
        e.preventDefault();

        // validate form
        if (!validateForm()) {
            setisSubmitting(false);
            setStatusMsg({ show: true, msg: 'Fill out username & password fields', severity: 'error' });
            return;
        }

        // send login request
        apiReq.post('/authenticate', loginCredentials).then(access => {
            console.log({ access });
            setStatusMsg({ show: false });
            // check if login was a sucess
            if (access.error === undefined && access.jwt !== undefined) props.logIn(access.jwt, access.user);
            else {
                setStatusMsg({ show: true, msg: 'Bad credentials', severity: 'error' });
                setisSubmitting(false);
            }
        }).catch(rsp => {
            console.log({rsp});
            // something went wrong with API / connection
            let errMsg = rsp.response.data.error === 'Bad Request' ? 'Bad credentials' : 'Something went wrong';
            setStatusMsg({ show: true, msg: errMsg, severity: 'error' });
            setisSubmitting(false);
        })
    }

    return (
        <Box sx={{ backgroundColor: 'darkgrey', minHeight: '102vh', paddingBottom: 0 }}>
            <Grid container spacing={2} style={{ paddingTop: '5%' }}>
                <Grid item xs={2} md={3} lg={4}></Grid>
                <Grid item xs={8} md={6} lg={4} textAlign='center'>
                    <Card>
                        <CardContent>
                            <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
                                <Grid container spacing={2} rowSpacing={2}>
                                    <Grid item xs={12}>
                                        <Collapse in={showStatus.show}>
                                            <Alert severity={showStatus.severity} >
                                                <AlertTitle>{showStatus.title}</AlertTitle>
                                                {showStatus.msg}
                                            </Alert>
                                        </Collapse>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <img src={User} alt='userlogo' style={{ height: 125 }} />
                                        <Typography gutterBottom variant="h4" component="h2" align='center'>
                                            Welcome
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required type={'text'} name="username" label='Username' defaultValue={username} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required type={'password'} name="password" label='Password' defaultValue={password} onChange={handleChange} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LoadingButton loading={isSubmitting} variant="contained" type={'submit'} onClick={handleSubmit} startIcon={<LoginIcon />}>Login</LoadingButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} lg={4} md={3}></Grid>
            </Grid>
        </Box>
    )
}
