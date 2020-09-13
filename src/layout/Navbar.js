import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { useUserState, useUserDispatch } from "../context/user-context";

const TopNavbar = () => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();
	const history = useHistory();

	const logout = async () => {
		const res = await fetch("api/auth/logout", {
			method: "POST",
    });
    if (res.status === 200) {
      dispatch({type: 'reset'});
      history.push("/login");
    }
	};

	return (
		<Navbar bg='light' expand='lg' className='justify-content-between'>
			<div id='left-section'>
				<Link to='/'>
					<Navbar.Brand>Junto</Navbar.Brand>
				</Link>
				<Link to='/friends'>
					<Navbar.Text>Friends</Navbar.Text>
				</Link>
			</div>
			<Link to='/'>
				<Navbar.Text>{`${user.firstName} ${user.lastName}`}</Navbar.Text>
			</Link>
			<div id='right-section'>
				<Button id='logoutBtn' onClick={logout}>
					Logout
				</Button>
				<Link to='/post'>Post</Link>
			</div>
		</Navbar>
	);
};

export default TopNavbar;
