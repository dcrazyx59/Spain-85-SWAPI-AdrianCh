import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { Favourites } from "./favourites";

import "../../styles/navbar.css";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-dark bg-dark mb-3">
			<Link to="/">
				<img src="https://lumiere-a.akamaihd.net/v1/images/sw_logo_stacked_2x-52b4f6d33087_7ef430af.png?region=0,0,586,254" className="navbar-brand mb-0 ms-2 h1" width={150}/>
			</Link>
			<div className="ml-auto">
				<Favourites/>
			</div>
		</nav>
	);
};
