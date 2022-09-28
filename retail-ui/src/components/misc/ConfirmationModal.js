import React, { useState }  from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { Typography, Grid, Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';


export default function ConfirmationModal(props) {
    console.log({props});
    const [isSubmitting, setisSubmitting] = useState(false);
    const { type, data, deleteClient, handleCloseModal } = props;
    let client = type === 'client' ? data.client : data;
    let clientId = client !== undefined && client !== null ? client.id : 0;
    let { name, id } = data;

    function handleDelete(){
        setisSubmitting(true);
        deleteClient(clientId, id);
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography id="modal-modal-title" variant="h6" component="h2" align='center'>
                    Hold up
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='span' component='p' align='center'>
                    Are you sure you want to delete "{name}"?
                </Typography>
            </Grid>
            <Grid item xs={6} textAlign='center'>
                <LoadingButton disabled={isSubmitting} loading={isSubmitting} onClick={handleDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>Delete</LoadingButton>
            </Grid>
            <Grid item xs={6} textAlign='center'>
                <Button onClick={handleCloseModal} variant="contained" startIcon={<CancelIcon />}>Cancel</Button>
            </Grid>
        </Grid>
    )
}