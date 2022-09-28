import React, { useState, useEffect } from 'react'
import apiReq from '../scripts/apiReq'
import { LinearProgress, Box, Typography, Grid, TextField, MenuItem, Collapse, Alert, AlertTitle } from '@mui/material'
import moment from 'moment'
import SaveIcon from '@mui/icons-material/Save';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LoadingButton from '@mui/lab/LoadingButton';

const statuses = ["Open", "Close", "On_Hold", "Completed", "Waiting_On_Request"];


export default function ProjectForm(props) {
    console.log({props});
    const [projectDetails, setProjectDetails] = useState(null);
    const [showStatus, setStatusMsg] = useState({ show: false, msg: '', title: '', severity: 'info' });
    const [clients, setClientList] = useState(false)
    let clientExisted = props.clientId !== undefined && props.clientId !== null;
    const [isSubmitting, setisSubmitting] = useState(false);
    
    useEffect(() => {
        if (projectDetails === null && props.project !== null) {
            setProjectDetails(props.project);
            console.log({ props })
        }
    }, [projectDetails, props]);

    useEffect(() => {
        if (clients === null) {
            let url = clientExisted ? '/clients/' + props.clientId : '/clients';
            apiReq.get(url)
                .then(data => {
                    let temp = clientExisted ? [data] : data;
                    setClientList(temp);
                })
                .catch(resp => setStatusMsg({ show: true, msg: 'Something went wrong updating', severity: 'error', title: 'Error' }));
        }
    }, [clients, clientExisted, props]);

    const handleChange = (e) => {
        // console.log('change', e.target.name, e.target.value);

        let value = e.target.name === 'endDate' || e.target.name === 'startDate' ? new Date(e.target.value) : e.target.value;
        setProjectDetails({
            ...projectDetails,
            [e.target.name]: value
        })
    }

    if (projectDetails === null) return <LinearProgress />

    const { startDate, endDate, name, status, description, id } = projectDetails;

    const validateForm = () => {
        let proceed = true;

        if (startDate === "" || startDate === null || startDate === undefined) proceed = false;
        if (endDate === "" || endDate === null || endDate === undefined) proceed = false;

        let startDateMilli = new Date(startDate).getTime(),
            endDateMilli = new Date(endDate).getTime();
        if (startDateMilli > endDateMilli) {
            setStatusMsg({ show: true, msg: 'Start date must not be later than End Date', severity: 'error', title: 'Error' });
            proceed = false;
        }
        if (endDateMilli < startDateMilli) {
            setStatusMsg({ show: true, msg: 'End Date must not be earlier than Start Date', severity: 'error', title: 'Error' });
            proceed = false;
        }
        if (name === "" || name === null || name === undefined) proceed = false;

        if(!proceed) setisSubmitting(false);

        // console.log({proceed, startDateMilli ,endDateMilli})
        // return false;
        return proceed;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setisSubmitting(true);
        setStatusMsg({ show: false });

        let url = clientExisted ? '/clients/' + props.clientId + '/projects' : '/clients/' + projectDetails.client.id + '/projects';
        // if(projectDetails.id !== undefined) url += '/' + projectDetails.id;
        if (!validateForm()) return;

        // console.log("teeee", { url }, { projectDetails });
        apiReq.post(url, projectDetails).then(datazzzz => {
            setStatusMsg({ show: true, msg: 'Project updated', severity: 'success', title: 'Success' });
            setProjectDetails({
                ...projectDetails,
                id: datazzzz.id
            })
            // console.log({ datazzzz });
            setisSubmitting(false);
            props.refreshList();
        }).catch(resp => {
            console.log({ resp });
            setStatusMsg({ show: true, msg: 'Something went wrong updating', severity: 'error', title: 'Error' });
            setisSubmitting(false);
        });
    }

    let saveBtnTxt = projectDetails.id === undefined ? { txt: "Attach Project To Client", icon: <AddLinkIcon /> } : { txt: "Save Project", icon: <SaveIcon /> };

    return (
        <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={2} rowSpacing={2}>
                {
                    showStatus &&
                    <Grid item xs={12}>
                        <Collapse in={showStatus.show}>
                            <Alert severity={showStatus.severity} >
                                <AlertTitle>{showStatus.title}</AlertTitle>
                                {showStatus.msg}
                            </Alert>
                        </Collapse>
                    </Grid>
                }
                <Grid item xs={12}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" align='center'>
                        {id !== undefined ? "Edit" : "New Project"}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth required id="outlined-required" name="name" label='Project Title' defaultValue={name} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth id="outlined-select-currency" select name='status' label="Status" value={status} onChange={handleChange} helperText="Select a status for project" >
                        {
                            statuses.map((option, index) => {
                                let optionText = option.replaceAll("_", " ");
                                return (
                                    <MenuItem key={index} value={option}>
                                        {optionText}
                                    </MenuItem>
                                )
                            })
                        }
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth required helperText="Start Date" id="outlined-required" label="Start Date" type="date" name='startDate' onChange={handleChange} value={moment(startDate).format("YYYY-MM-DD")}  />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth required helperText="Expected End Date" label="End Date" type="date" name='endDate' onChange={handleChange} value={moment(endDate).format("YYYY-MM-DD")} />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                    <TextField disabled={clientExisted} select name='client' label="Client" value={selectedClient} onChange={handleChange} helperText="Select a client associated to this project" >
                        {
                            clients.map((client, index) => {
                                return (
                                    <MenuItem key={index} value={client.id}>
                                        {client.name}
                                    </MenuItem>
                                )
                            })
                        }
                    </TextField>
                </Grid> */}
                <Grid item xs={12}>
                    <TextField fullWidth required id="outlined-required" label="Description" name='description' defaultValue={description} onChange={handleChange} multiline rows={4} />
                </Grid>
                <Grid item xs={12} textAlign={'center'}>
                    <LoadingButton disabled={isSubmitting} loading={isSubmitting} variant="contained" type={'submit'} startIcon={saveBtnTxt.icon}>{saveBtnTxt.txt}</LoadingButton>
                </Grid>
            </Grid>
        </Box>
    )
}