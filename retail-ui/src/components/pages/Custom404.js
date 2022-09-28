import { Link } from "react-router-dom"
import { Container, Grid } from '@mui/material'

const Custom404 = () => {
	return (
		<Container className="not-found">
			<Grid container>
				<Grid item xs={12}>
					<h2>Sorry</h2>
					<p>That page cannot be found</p>
					<Link to="/">Back to the homepage...</Link>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Custom404;