import React, {useContext, useEffect, useState} from "react";
import {Context} from "../store/appContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import noImagePlaceholder from "../../img/no-image-placeholder.jpg";


import "../../styles/home.css";

const Home = () => {
	const {store, actions} = useContext(Context)
	const [inputState, setInputState] = useState("hide");
	const [isHidden, setIsHidden] = useState(false);
	const [query, setQuery] = useState("")

	let navigate = useNavigate()

	// Documentation por transition: https://developer.chrome.com/docs/web-platform/view-transitions/same-document
	async function goToCharacterPage (index) {
		let characterLink = `/character/${index}`
		let cardCssClass = document.querySelector(`.card-${index}`)
		
		cardCssClass.style.viewTransitionName = "image-character";

		if (!document.startViewTransition) {
			navigate(characterLink);
			return;
		}

		document.startViewTransition(() => {
			navigate(characterLink);
			cardCssClass.style.viewTransitionName = "";
		});
	}
	

	// Momentum Scroller with Js
	useEffect(() => {
		const scroller = document.querySelector(".card-scroller");
		const arrowPrev = document.querySelector(".left-button-slider");
		const arrowNext = document.querySelector(".right-button-slider");

		const windowSize = window.innerWidth

		const chooseWindowScroll = [{w:0, mult: 4}, {w:425, mult: 5},{w:728, mult: 9},{w:1024, mult: 14}, {w:1440, mult: 18}, {w:2560, mult: 22}]
		let windowScroll = 0
		for (let i = 0; i < chooseWindowScroll.length; i++) {
			if(chooseWindowScroll[i].w <= windowSize) {
				windowScroll = chooseWindowScroll[i].mult
			}
		}

		const widthToScroll = 67 * windowScroll


		arrowPrev.onclick = function() {
			scroller.classList.add("snap-back")
			scroller.scrollLeft -= widthToScroll
			
		}

		arrowNext.onclick = function() {
			scroller.classList.add("snap-back")
			scroller.scrollLeft += widthToScroll

		}

		scroller.addEventListener('scroll', () => {
			if (scroller.scrollLeft === 0) {
			  arrowPrev.classList.add("hide");
			  arrowPrev.classList.remove("show");
			} else {
			  arrowPrev.classList.add("show");
			  arrowPrev.classList.remove("hide");
			}
		  
			if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth) {
			  arrowNext.classList.add("hide");
			  arrowNext.classList.remove("show");
			} else {
			  arrowNext.classList.add("show");
			  arrowNext.classList.remove("hide");
			}
		  });
	
		let isDragging = false, startX, startScrollLeft, velocity = 0, lastPageX, lastTime;
		
	
		const calculateVelocity = (newPageX) => {
			const now = performance.now();
			const distance = newPageX - lastPageX;
			const time = now - lastTime;
	
			velocity = distance / time;
			lastPageX = newPageX;
			lastTime = now;
		};
	
		const dragStart = (e) => {
			isDragging = true;
			scroller.classList.remove("snap-back");
			scroller.classList.add("dragging");
			startX = e.pageX;
			startScrollLeft = scroller.scrollLeft;
			lastPageX = e.pageX;
			lastTime = performance.now();
		};
	
		const dragStop = () => {
			isDragging = false;
			scroller.classList.remove("dragging");
		
			const applyMomentum = () => {
				if (Math.abs(velocity) > 0.01) {
					scroller.scrollLeft -= velocity * 20;
					velocity *= 0.95;
					requestAnimationFrame(applyMomentum);
				} else {
					setTimeout(() => {
						scroller.classList.add("snap-back");
					},300);
				}
			};
			applyMomentum();
		};
	
		const dragging = (e) => {
			if (isDragging) {
				const delta = e.pageX - startX;
				scroller.scrollLeft = startScrollLeft - delta;
				calculateVelocity(e.pageX);
			}
		};
	
		scroller.addEventListener("mousemove", dragging);
		scroller.addEventListener("mousedown", dragStart);
		document.addEventListener("mouseup", dragStop);
	
		return () => {
			scroller.removeEventListener("mousemove", dragging);
			scroller.removeEventListener("mousedown", dragStart);
			document.removeEventListener("mouseup", dragStop);
		};
	}, []);


	// Toggle for Search Bar visibility and animations
	const toggleVisibility = () => {
		if (inputState === "appear") {
		  setInputState("disappear");
		  setTimeout(() => setIsHidden(true), 500); 
		} else {
		  setIsHidden(false);
		  setInputState("appear");
		}
	};

	

	return (

	<div className="d-flex flex-column justify-content-start mt-5 w-75 mx-auto">
		<div className="tittle-and-search d-flex position-relative mb-2 justify-content-between">
			<h2 className="text-start">Characters</h2>
			<div className="my-auto">
				{!isHidden && (
					<>
						<input
						className={`input ${inputState} ps-1`}
						placeholder="Search Character"
						type="search"
						data-bs-toggle="dropdown" aria-expanded="false"
						value={query}
						onChange={e => setQuery(e.target.value)}
						/>
						<ul className="dropdown-menu">
							{store.characters && store.characters.length > 0 ? 
							store.characters.filter(item => {return item.name.toLowerCase().includes(query.toLocaleLowerCase())})
							.slice(0,10)
							.map((value, index) => (
								<li key={index} className="d-flex flex-row gap-2 justify-content-between align-items-center">
									<a className="dropdown-item"href="#" onClick={() => goToCharacterPage(value.id <= 16 ? value.id - 1 : value.id -2)}>
										{value.name}
									</a>
								</li>
							))
							: 
							"Error Loading"
							}
						</ul>
					</>
				)}
				<i className="fa-solid fa-magnifying-glass border border-secondary p-1 rounded-circle end-0 m-1" onClick={toggleVisibility} ></i>
			</div>
		</div>
		<div className="d-flex whole-scroller">
			<div className="mx-auto align-content-center position-relative">
				<button className="slider-button-wrapper left-button-slider"><i className="fa-solid fa-angle-left"></i></button>
			</div>
			<div className="d-flex card-scroller snap-back w-100 gap-2">
				{store.characters && store.characters.length > 0 ? store.characters.map((value, index) =>
					<div key={index} className="card d-inline-block" >
						<div className="card-body d-flex flex-column gap-3">
							<h5 className="card-title m-0">{value.name}</h5>
							<div className="mx-auto card-container">
								<img src={value.image} alt= {value.name} className={`card-image card-${index}`} draggable="false"/>
							</div>
							<ul className="">
								<li>Homeworld: {value.homeworld}</li>
								<li>Status: {value.died ? "Dead" : "Alive"}</li>
								<li>Species: {value.species}</li>
							</ul>
							<div className="d-flex justify-content-between bottom-0">
								<button className="btn btn-primary position-relative" onClick={() => goToCharacterPage(index)}>Learn more!</button>
								{!store.favourites.find(fav => fav.newFavourite=== value.name)?
									<button className="btn btn-warning" onClick={() => actions.addToFavourites(value.name, index, value.image)}>
										<i className="fa-regular fa-heart"></i>
									</button>
									:
									<button className="btn btn-danger" onClick={() => actions.removeFromFavourites(value.name)}>
										<i className="fa-regular fa-x"></i>
									</button>
								}
							</div>
						</div>
					</div>
					)
					:
					<p>Loading...</p>
				}
			</div>
			<div className="mx-auto align-content-center position-relative">
				<button className="slider-button-wrapper right-button-slider"><i className="fa-solid fa-angle-right"></i></button>
			</div>
		</div>

		<h2 className="text-start mt-5">Planets</h2>
		<div className="overflow-scroll d-flex flex-row card-container w-100">
		{store.planets && store.planets.length > 0 ? store.planets.map((value, index) => 
			<div key={index} className="card d-inline-block">
				<div className="card-body">
					<h5 className="card-title">{value.name}</h5>
					<a href="#" className="btn btn-primary">Go somewhere</a>
				</div>
			</div>
			)
			:
			<p>Loading...</p>
		}
		</div>
	</div>
)};

export {Home}