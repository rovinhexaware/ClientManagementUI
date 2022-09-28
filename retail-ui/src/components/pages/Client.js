import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import apiReq from '../scripts/apiReq'
import { LinearProgress, Container, Box, Typography, Grid, Button, TextField, Modal, Collapse, Alert, AlertTitle } from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PageviewIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import moment from 'moment'
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectForm from '../misc/ProjectForm';
import ConfirmationModal from '../misc/ConfirmationModal'
import LoadingButton from '@mui/lab/LoadingButton';

const blankProject = {
    startDate: new Date(),
    endDate: new Date(),
    name: "",
    status: "Open",
    description: "",
    newProject: true
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export default function Client(props) {
    const [client, setClient] = useState(null);
    // const [viewMode, setviewMode] = useState('view');
    const [projects, setProjects] = useState([]);
    const [projectInView, setProjectInView] = useState(null);
    let { clientId } = useParams();
    if(props.clientId !== undefined) clientId = props.clientId;
    
    const [modalState, setmodalState] = useState(false);
    const [showStatus, setStatusMsg] = useState({ show: false, msg: '', title: '', severity: 'info' });
    const [modalContent, setModalContent] = useState(null);
    const [isSubmitting, setisSubmitting] = useState(false);

    useEffect(() => {
        if (client === null) {
            console.log({clientId})
            apiReq.get('/clients/' + clientId).then(data => {
                setClient(data);
                // console.log({ data });
            }).catch(resp => {
                console.log({ resp });
            });
        }
    }, [client, clientId]);

    useEffect(() => {
        if (projects.length === 0) {
            console.log('hiii');
            apiReq.get('/clients/' + clientId + '/projects').then(projectList => {
                if (projectList.length !== 0) setProjects(projectList);
                // console.log({ projectList });
            }).catch(resp => {
                console.log({ resp });
            });
        }
    }, [projects, clientId]);

    useEffect(() => {
        if (!modalState) setProjectInView(null);
    }, [modalState]);

    const handleOpenModal = (project, type) => {
        setModalContent(type);
        setProjectInView(project);
        setmodalState(true);
    }

    const handleCloseModal = () => {
        setmodalState(false);
    }

    // console.log({props, id});
    if (client === null) return <LinearProgress />

    let address = client.address !== undefined && client.address !== null ? client.address : { line1: "", line2: "", city: "", country: "", zipCode: "" };
    //eslint-disable-next-line
    const { name, email, phoneNumber, id, bio, file } = client;

    const handleChange = (e) => {
        // console.log('change', e.target.name, e.target.value);

        let value = e.target.name === 'endDate' || e.target.name === 'startDate' ? new Date(e.target.value) : e.target.value;
        setClient({ ...client, [e.target.name]: value })
    }

    const handleAddressChange = (e) => {
        // console.log('address change', e.target.name, e.target.value);
        address[e.target.name] = e.target.value;

        setClient({ ...client, address });
    }

    const validateForm = () => {
        // if(phoneNumber === "" || phoneNumber === null || phoneNumber === undefined ) return false;
        if (email === "" || email === null || email === undefined) return false;
        if (name === "" || name === null || name === undefined) return false;

        return true;
    }

    const handleSubmit = (e) => {
        setisSubmitting(true);
        setStatusMsg({ show: false });
        e.preventDefault();
        let url = '/clients';

        if (!validateForm()) {
            setisSubmitting(false);
            return
        }

        delete client.file;
        console.log({client})
        apiReq.post(url, client).then(datazzzz => {
            console.log({ datazzzz });
            setStatusMsg({ show: true, msg: 'Client updated', severity: 'success', title: 'Success' });
            setisSubmitting(false);
            // setClient(null);
        }).catch(resp => {
            console.log({ resp });
            setStatusMsg({ show: true, msg: 'Something went wrong updating', severity: 'error', title: 'Error' });
            setisSubmitting(false);
        });
    }

    const deleteProject = (clientId, projectId) => {
        apiReq.delete('/clients/' + clientId + '/projects/' + projectId).then(data => {
            // console.log({ data });
            if (data.Deleted) {
                handleCloseModal();
                setProjects([]);
            }
            // setmodalState(false);
        }).catch(resp => {
            console.log({ resp });
        });
    }

    return (
        <div>
            <Modal open={modalState} onClose={handleCloseModal} aria-labelledby="modal-modal-title">
                <Grid container spacing={2} sx={style}>
                    <Grid item xs={12}>
                        {
                            modalContent === 'confirmation' &&
                            <ConfirmationModal type='project' data={projectInView} clientId={id} deleteClient={deleteProject} handleCloseModal={handleCloseModal} />
                        }
                        {
                            modalContent === 'project' &&
                            <ProjectForm project={projectInView} clientId={id} refreshList={() => setProjects([])} />
                        }
                    </Grid>
                </Grid>
            </Modal>
            <div className="App">
                <Container>
                    <Box paddingTop={2}>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h3' component={'h3'} align='center' color={'#fff'}>Client Info</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <form autoComplete="off" onSubmit={handleSubmit}>
                                    <Card>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Collapse in={showStatus.show}>
                                                        <Alert severity={showStatus.severity} >
                                                            <AlertTitle>{showStatus.title}</AlertTitle>
                                                            {showStatus.msg}
                                                        </Alert>
                                                    </Collapse>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant='h5' align='center'>Details</Typography>
                                                </Grid>
                                                <Grid container item>
                                                    <Grid container item xs={12} md={6} rowSpacing={2} style={{ paddingRight: 20 }}>
                                                        <Grid item xs={12}>
                                                            <TextField required fullWidth id="outlined-required" label="Name" name='name' defaultValue={name} onChange={handleChange} />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField required fullWidth id="outlined-required" type="email" label="Email" name='email' defaultValue={email} onChange={handleChange} />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField required fullWidth id="outlined-required" name="phoneNumber" label='Phone Number' defaultValue={phoneNumber} onChange={handleChange} />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} md={6} container justifyContent={'center'}>
                                                        <Grid item xs={12}>
                                                            <TextField label="Bio" fullWidth name='bio' defaultValue={bio} onChange={handleChange} multiline rows={4} />
                                                        </Grid>
                                                        <Grid item xs={12} style={{marginTop: 20}}>
                                                            <Button endIcon={<VisibilityIcon />} variant='contained' color='info' onClick={() => window.open('http://localhost:8080/files/' + file, '_blank')}>Agreement File</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid container spacing={2} style={{ marginTop: 25 }}>
                                                <Grid item xs={12}>
                                                    <Typography variant='h5' align='center'>Address</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField required id="outlined-required" onChange={handleAddressChange} label="Address Line 1" name='line1' defaultValue={address.line1} fullWidth />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField fullWidth onChange={handleAddressChange} name="line2" label='Address Line 2' defaultValue={address.line2} />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth required id="outlined-required" onChange={handleAddressChange} label="City" name='city' defaultValue={address.city} />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth required id="outlined-required" onChange={handleAddressChange} label="Country" name='country' defaultValue={address.country} />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth required type={'number'} id="outlined-required" onChange={handleAddressChange} label="Zip Code" name='zipCode' defaultValue={address.zipCode} />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                        <CardActions>
                                            <LoadingButton loading={isSubmitting} disabled={isSubmitting} color='success' variant="contained" type='submit' startIcon={<SaveIcon />}>Update Client</LoadingButton>
                                        </CardActions>
                                    </Card>
                                </form>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box paddingTop={4}>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Start Date</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">End Date</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Status</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                projects.length > 0 ?
                                                    projects.map((data, index) => {
                                                        //eslint-disable-next-line
                                                        const { name, startDate, endDate, client, status } = data;
                                                        return (
                                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                                <TableCell component="th" scope="row">
                                                                    <Typography variant='span'>{name}</Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Typography variant='span'>{moment(startDate).format('MMM Do YYYY')}</Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Typography variant='span'>{moment(endDate).format('MMM Do YYYY')}</Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Typography variant='span'>{status.replaceAll("_", " ")}</Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Button onClick={() => handleOpenModal(data, 'project')} variant="text" startIcon={<PageviewIcon />}></Button>
                                                                    <Button color="error" onClick={() => handleOpenModal(data, 'confirmation')} variant="text" startIcon={<DeleteIcon />}></Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                    :
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                        <TableCell align="center" colSpan={5}>
                                                            <Typography variant='span' component='p' align='center'>No Projects Assigned</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                            }
                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                <TableCell component="th" scope="row" colSpan={4}>
                                                    <Typography align="right">Add new project</Typography>
                                                </TableCell>
                                                <TableCell align="right" colSpan={4}>
                                                    <Button onClick={() => handleOpenModal(blankProject, 'project')} variant="text" startIcon={<AddCircleIcon />}></Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </div>
        </div>
    )
}
