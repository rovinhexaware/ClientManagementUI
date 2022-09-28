import React, { useState, useEffect } from 'react'
import apiReq from '../scripts/apiReq'
import { LinearProgress, Container, Box, Typography, Grid, Button, Modal } from '@mui/material'
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
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectForm from '../misc/ProjectForm';
import ConfirmationModal from '../misc/ConfirmationModal'

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

export default function Projects(props) {
    // const [viewMode, setviewMode] = useState('view');
    const [projects, setProjects] = useState(null);
    const [projectInView, setProjectInView] = useState(null);
    const [modalState, setmodalState] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const clientId = props.clientId;

    useEffect(() => {
        if (projects === null) {
            let url = clientId === undefined ? '/projects' : '/clients/'+clientId+'/projects';
            apiReq.get(url).then(projectList => {
                setProjects(projectList);
            }).catch(resp =>  console.log({ resp }) );
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
    if (projects === null) return <LinearProgress />

    //eslint-disable-next-line
    // const { id } = projects.client;

    const deleteProject = (clientId, projectId) => {
        apiReq.delete('/clients/' + clientId + '/projects/' + projectId).then(data => {
            console.log({ data });
            if (data.Deleted) {
                handleCloseModal();
                setProjects(null);
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
                            <ConfirmationModal type='project' data={projectInView} deleteClient={deleteProject} handleCloseModal={handleCloseModal} />
                        }
                        {
                            modalContent === 'project' &&
                            <ProjectForm project={projectInView} clientId={clientId} refreshList={() => {setProjects(null);handleCloseModal();}} />
                        }
                    </Grid>
                </Grid>
            </Modal>
            <div className="App">
                <Container>
                    <Box paddingTop={4}>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h3' component={'h3'} align='center' color={'#fff'}>Projects</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold'}}>Project Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold'}} align="right">Start Date</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold'}} align="right">End Date</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold'}} align="right">Client</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold'}} align="right">Status</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold'}} align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                projects.length > 0 ?
                                                    projects.map((data, index) => {
                                                        const { name, startDate, endDate, status, client } = data;
                                                        let clientName = client !== null ? client.name : "Not Assigned";
                                                        
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
                                                                <TableCell scope="row">
                                                                    <Typography variant='span'>{clientName}</Typography>
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
                                                            <Typography variant='span' component='p' align='center'>No Projects</Typography>
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
