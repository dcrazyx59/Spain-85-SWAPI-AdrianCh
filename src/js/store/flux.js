const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			characters: [],
			planets: [],
			favourites: []
		},
		actions: {
			fetchAPIData: async () => {
				const store = getStore()
				try {
					let response = await fetch('https://akabab.github.io/starwars-api/api/all.json', {
						method: 'GET'
					})
					let data = await response.json()
					console.log(data)
					setStore({...store.characters, characters: data})
					
				} catch (error){
					console.log(error);
				}
				try {
					let response = await fetch('https://www.swapi.tech/api/planets/', {
						method: 'GET'
					})
					let data = await response.json()
					setStore({...store.planets, planets: data.results})
					console.log(store.planets);
				} catch (error){
					console.log(error);
				}
			},
			detailsFetchAPIData: async (id) => {
				const store = getStore()
				try {
					let response = await fetch(`https://www.swapi.tech/api/people/${id}`, {
						method: 'GET'
					})
					let data = await response.json()
					const updatedCharacters = [...store.characters];
					updatedCharacters[id] = {
					  ...updatedCharacters[id],
					  details: data.result.properties.skin_color
					};
					setStore({ ...store, characters: updatedCharacters });
					console.log(store.characters);
				} catch (error){
					console.log(error);
				}
			},
			addToFavourites: (newFavourite, index, img) => {
				const store = getStore()
				if (store.favourites.filter(fav => fav.newFavourite === newFavourite).length === 0) {
					setStore({...store, favourites: [...store.favourites, {newFavourite, index, img}]})
					console.log(store.favourites);
				}
			},
			removeFromFavourites: (removedItem) => {
				const store = getStore();
				setStore({
					...store,
					favourites: store.favourites.filter(fav => fav.newFavourite !== removedItem),
				});
			},
			getReccomendedCharacters: (characterObj) => {
				const store = getStore();

				function randomCharacter(array) {
					return array[Math.floor(Math.random() * (array.length))]
				}

				let reccomendedBySpecies = []
				if(characterObj.species !== "human") {
					reccomendedBySpecies = store.characters
						.filter((storeCharacter) => (storeCharacter.species === characterObj.species && storeCharacter.name !== characterObj.name))
						.map((storeCharacter) => storeCharacter)
				}


				let reccomendedByAffiliation = store.characters .filter(storeCharacter => {
					for (let affiliation of storeCharacter.affiliations) {
						if (characterObj.affiliations.includes(affiliation) && storeCharacter.name !== characterObj.name) {
							return true;
						}
					}
					return false
					})
					.map(storeCharacter => storeCharacter)


				let reccomendedByApprentices = []
				if (characterObj.apprentices) {
					reccomendedByApprentices = store.characters.filter(storeCharacter =>
						characterObj.apprentices.includes(storeCharacter.name)
					)
					.map(storeCharacter => storeCharacter);
				}

				let reccomendedByMasters = []
				if (characterObj.masters) {
					reccomendedByMasters = store.characters.filter(storeCharacter =>
						characterObj.masters.includes(storeCharacter.name)
					)
					.map(storeCharacter => storeCharacter);
				}

				let reccomendedByHomeworld = []
				if (characterObj.homeworld) {
					reccomendedByHomeworld = store.characters.filter(storeCharacter =>
						storeCharacter.name !== characterObj.name &&
						storeCharacter.homeworld === characterObj.homeworld
					)
					.map(storeCharacter => storeCharacter);
				}

				let AllReccomendedCharacters = [reccomendedByApprentices, reccomendedByMasters, reccomendedByHomeworld, reccomendedBySpecies, reccomendedByAffiliation]
				let filteredReccomendedCharacters = []

				function filterWithoutDuplicates(array) {
					let selectedCharacter = randomCharacter(array)
						if(!filteredReccomendedCharacters.find(character => character.name === selectedCharacter.name)) {
							filteredReccomendedCharacters.push(selectedCharacter)
						}
				}
				
				for (let i = 0; i < AllReccomendedCharacters.length; i++) {
					console.log(reccomendedByHomeworld);
					if(AllReccomendedCharacters[i].length !== 0) {
						console.log("working first loop");
						
						filterWithoutDuplicates(AllReccomendedCharacters[i])
					}
				}

				let counter = 0
				while (filteredReccomendedCharacters.length < 4) {
					console.log("working second loop");
					
					if(reccomendedByApprentices.length > 0) {
						filterWithoutDuplicates(reccomendedByApprentices)
					}

					if(reccomendedByMasters.length > 0) {
						filterWithoutDuplicates(reccomendedByMasters)
					}

					if(reccomendedByHomeworld.length > 0) {
						filterWithoutDuplicates(reccomendedByHomeworld)
					}

					if(reccomendedBySpecies.length > 0) {
						filterWithoutDuplicates(reccomendedBySpecies)
					}

					if(reccomendedByAffiliation.length > 0) {
						filterWithoutDuplicates(reccomendedByAffiliation)
					}

					counter++
					if(counter >= 4) break
				}

				return filteredReccomendedCharacters.slice(0,4);

			}
		}
	}
};

export default getState;
