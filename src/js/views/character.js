import React, { useState, useEffect, useContext, act } from "react";
import { Link , useNavigate} from "react-router-dom";

import { Context } from "../store/appContext";
import { useParams } from "react-router"

import "../../styles/demo.css";

export const Demo = () => {
	const { store, actions } = useContext(Context);
	const { id } = useParams(); 
	const [recommendedCharacters, setRecommendedCharacters] = useState([]);
	
	let character = store.characters[id]
	let navigate = useNavigate()

	function goToMainPage () {
		let mainPage = "/"

		if (!document.startViewTransition) {
			navigate(mainPage);
			return;
		}

		document.startViewTransition(() => {
			navigate("/")
		});
	}

    async function goToCharacterPage (index) {
		let characterLink = `/character/${index}`

		if (!document.startViewTransition) {
			navigate(characterLink);
			return;
		}

		document.startViewTransition(() => {
			navigate(characterLink);
		});
	}

	useEffect(() => {
		const fetchedCharacters = actions.getReccomendedCharacters(character);
		setRecommendedCharacters(fetchedCharacters);
	}, [character])

	return (
		<div className="container flex-column">
			<a  href="#" onClick={() => goToMainPage()}>← Back home</a>
			<div className="d-flex flex-row mt-3">
				<img src={character.image} className="image-individual-character"/>
				<div className="d-flex flex-column mx-auto w-50">
					<div className="d-flex flex-row justify-content-between">
						<h1>{character.name}</h1>
						<div className="my-auto">
							{!store.favourites.find(fav => fav.newFavourite=== character.name)?
								<button className="btn btn-warning" onClick={() => actions.addToFavourites(character.name, id, character.image)}>
									<i className="fa-regular fa-heart"></i>
								</button>
								:
								<button className="btn btn-danger" onClick={() => actions.removeFromFavourites(character.name)}>
									<i className="fa-regular fa-x"></i>
								</button>
							}
						</div>
					</div>
					<p className="mt-3">Really interesting cool facts about {character.name}.</p>	
					<ul className="d-flex flex-column gap-2">
						<li>Affiliations: {(character.affiliations).join(", ")}</li>
						<li>Eye Color: {character.eyeColor}</li>
						<li>Gender: {character.gender}</li>
						<li>Mass: {character.mass}</li>
						<li>Species: {character.species}</li>
					</ul>
				</div>
			</div>
			<br />
			
			<h2>Also Reccomended:</h2>
			<div className="container">
				{recommendedCharacters.map((reccomendedCharacter, index) =>
					<div key={index} className="card d-inline-block col-12 col-md-6 col-lg-4 col-xl-3">
						<div className="card-body d-flex flex-column gap-3">
							<h5 className="card-title m-0">{reccomendedCharacter.name}</h5>
							<div className="mx-auto card-container">
								<img src={reccomendedCharacter.image} alt= {reccomendedCharacter.name} className={`card-image card-${reccomendedCharacter.id <= 16 ? reccomendedCharacter.id - 1 : reccomendedCharacter.id -2}`}/>
							</div>
							<ul className="">
								<li>Homeworld: {reccomendedCharacter.homeworld}</li>
								<li>Status: {reccomendedCharacter.died ? "Dead" : "Alive"}</li>
								<li>Species: {reccomendedCharacter.species}</li>
							</ul>
							<div className="d-flex justify-content-between bottom-0">
								<button className="btn btn-primary position-relative" onClick={() => goToCharacterPage(reccomendedCharacter.id <= 16 ? reccomendedCharacter.id - 1 : reccomendedCharacter.id -2)}>Learn more!</button>
								{!store.favourites.find(fav => fav.newFavourite=== reccomendedCharacter.name)?
									<button className="btn btn-warning" onClick={() => actions.addToFavourites(reccomendedCharacter.name, reccomendedCharacter.id <= 16 ? reccomendedCharacter.id - 1 : reccomendedCharacter.id -2, reccomendedCharacter.image)}>
										<i className="fa-regular fa-heart"></i>
									</button>
									:
									<button className="btn btn-danger" onClick={() => actions.removeFromFavourites(reccomendedCharacter.name)}>
										<i className="fa-regular fa-x"></i>
									</button>
								}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
