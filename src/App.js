import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Button, Box, Text, Paragraph, Spinner, Heading } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import { useHistory } from 'react-router-dom';

import { CasUserContext, useCas } from './cas/index';

export default function App() {
	return (
		<Router>
			<Switch>
				<Route exact path='/home'>
					<SecureHome />
				</Route>
				<Route exact path='/'>
					<Home />
				</Route>
				<Route>
					<NoMatch />
				</Route>
			</Switch>
		</Router>
	);
}

function Layout(props) {
	const history = useHistory();
	const [securityChecked, setSecurityChecked] = useState(false);
	const casUserContext = useContext(CasUserContext);

	useEffect(() => {
		if (props.isSecure && !casUserContext?.user) {
			history.replace('/');
		} else {
			setSecurityChecked(true);
		}
	}, [props.isSecure, casUserContext?.user]);

	if (!securityChecked) return <Box></Box>;

	return (
		<Box align='center' background={props.background} fill>
			<Heading
				margin={{
					top: 'xlarge',
					bottom: 'none',
				}}
			>
				CAS Client 1
			</Heading>

			<Box justify='center' align='center'>
				{props.children}
			</Box>
		</Box>
	);
}

function Home() {
	const history = useHistory();
	const cas = useCas(true);
	const casUserContext = useContext(CasUserContext);

	useEffect(() => {
		if (casUserContext?.user) {
			history.replace('/home');
		}
	}, [casUserContext?.user]);

	return (
		<Layout background='status-unknown' isSecure={false}>
			{cas.isLoading && (
				<Box align='center' gap='medium'>
					<Spinner
						border={[
							{
								side: 'all',
								color: 'brand',
								size: 'medium',
								style: 'dotted',
							},
						]}
					/>
					<Text>Redirecting ...</Text>
				</Box>
			)}
			{!cas.isLoading && (
				<Box align='center' gap='xsmall'>
					<Paragraph textAlign='center'>
						Hello anonymous! Please click{' '}
						<Text color='brand' size='large'>
							LOGIN
						</Text>{' '}
						with follows account.
					</Paragraph>
					
					<Button
						label='Login'
						icon={<Login />}
						a11yTitle='Login button'
						margin='medium'
						reverse
						onClick={() => {
							cas.attemptCasLogin(false);
						}}
					/>
				</Box>
			)}
		</Layout>
	);
}

function SecureHome() {
	const cas = useCas();
	const casUserContext = useContext(CasUserContext);

	return (
		<Layout background='status-ok' isSecure={true}>
			<Box align='center' gap='medium'>
				<Paragraph textAlign='center'>
					welome{' '}
					<Text color='brand' size='xxlarge'>
						{casUserContext?.user}
					</Text>
				</Paragraph>
			</Box>
			<Button
				label='Logout'
				icon={<Logout />}
				a11yTitle='Logout button'
				reverse
				onClick={() => {
					cas.logout();
				}}
			/>
		</Layout>
	);
}

function NoMatch() {
	const history = useHistory();

	return (
		<Layout background='status-critical' isSecure={false}>
			<Box align='center' gap='medium'>
				<Paragraph textAlign='center'>Page Not Found.</Paragraph>
				<Button
					label='Go Back'
					color='white'
					a11yTitle='Go Back button'
					onClick={() => {
						history.replace('/');
					}}
				/>
			</Box>
		</Layout>
	);
}
