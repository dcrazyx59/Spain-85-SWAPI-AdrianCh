import React, {act, useContext, useEffect} from "react";
import {Context} from "../store/appContext";
import { useNavigate } from "react-router-dom";

import "../../styles/favourites.css"

export const Favourites = () => {
    const {store, actions} = useContext(Context)
    let navigate = useNavigate()

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

    return (
        <div className="dropdown end me-3" >
            <button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="true">
                Favourites {store.favourites.length < 1 ? "" : store.favourites.length}
            </button>
            <ul className="dropdown-menu dropdown-menu-end position-absolute p-2 gap-2">
                {store.favourites && store.favourites.length > 0 ?
                <>
                <li><h6 className="dropdown-header">My favourites</h6></li>
                {store.favourites.map((character, index) => 
                    <li key={index} className="d-flex flex-row gap-2 justify-content-between align-items-center">
                        <a className="dropdown-item d-flex gap-2" href="#" onClick={() => goToCharacterPage(character.index)}>
                            <img src={character.img} width="30px"/>
                            <span className="my-auto">{character.newFavourite}</span>
                        </a>
                        <button className="btn btn-danger px-1 py-1 my-auto justify-content-center align-items-center d-flex my-auto" onClick={() => actions.removeFromFavourites(character.newFavourite)}>
                            <span className="lh-1">X</span>
                        </button>
                    </li>
                )}
                </>
                :
                <li className="p-2">No Favourites</li>
                }
            </ul>
        </div>
    )
} 