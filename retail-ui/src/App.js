import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/ClientList';
import Custom404 from './components/pages/Custom404'
import Client from './components/pages/Client';
import Login from './components/pages/Login';
import TopMenu from './components/layout/TopMenu';
import { useEffect, useState } from 'react';
import { checkLogin } from './components/scripts/checkLogin'
import { LinearProgress } from '@mui/material';
import Projects from './components/pages/ProjectList';
import { Box } from '@mui/system';

function App() {
	const [loggedIn, setLoggedIn] = useState(null);
	const [gotUserData, setUserData] = useState(false);
	const [user, setUser] = useState("USER")

	useEffect(() => {
		if (loggedIn === null) {
			let { authenticated, user } = checkLogin();
			if (!authenticated) setLoggedIn(false);
			else { setLoggedIn(true); setUser(user) };

			setUserData(true);
		}
		//   else setLoggedIn(false);
	}, [loggedIn]);

	const logOut = () => {
		localStorage.removeItem("jwt");
		setLoggedIn(false);
	}

	// function checkLogin() {
	// 	let auth = localStorage.getItem("jwt");
	// 	if (auth !== undefined && auth !== null) {
	// 		auth = JSON.parse(auth);
	// 		let timePassed = new Date().getTime() - auth.time,
	// 			twoMinutes = 1200000;
	// 		if (timePassed > twoMinutes) setLoggedIn(false);
	// 		else setLoggedIn(true);
	// 	}
	// }

	const authenticateUser = (jwt, user) => {
		console.log({ jwt, user });
		if (jwt === null || jwt === undefined) return;
		let loginCache = { time: new Date().getTime(), token: jwt, user };
		setUser(user);
		console.log({ loginCache });
		if (typeof (Storage) !== "undefined") localStorage.setItem("jwt", JSON.stringify(loginCache));
		console.log('authenticated');
		setLoggedIn(true);
	}

	console.log({ loggedIn });

	if (!gotUserData) return <LinearProgress />

	return (
		<Router>
			<div className="App" style={{ backgroundColor: 'darkgrey' }}>
				{!loggedIn && <Login logIn={authenticateUser} />}
				{
					loggedIn && user.active &&
					<>
						<TopMenu logOut={logOut} userRole={user.authorities} />
						<Box sx={{ paddingBottom: 8, minHeight: 'calc(100vh - 108.8px)' }}>
							{
								user.authorities === 'ROLE_ADMIN' ?
									<Routes>
										<Route path="/" exact element={<Home />} />
										<Route path="/client/:clientId" exact element={<Client />} />
										<Route path="/projects" exact element={<Projects />} />
										<Route path="*" exact element={<Custom404 />} />
									</Routes>
									:
									<Routes>
										<Route path="/" exact element={<Projects clientId={user.id} />} />
										<Route path="/profile" exact element={<Client clientId={user.id} />} />
										<Route path="*" exact element={<Custom404 />} />
									</Routes>
							}
						</Box>
					</>
				}
			</div>
		</Router>
	);
}

export default App;
