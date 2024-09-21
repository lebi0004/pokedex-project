const $properties = document.getElementById('properties')
const $more = document.getElementById('more')
const $dialog = document.getElementById('dialog')
const $catch = document.getElementById('catch')
const $release = document.getElementById('release')
const $close = document.getElementById('close')
const $history = document.getElementById('history')



//Data
const deck = []

const ls = JSON.parse(localStorage.getItem('history'))
const history = ls ? ls : []


//Function

function displayHistory (history) {
  
    $history.innerHTML = history.reduce((html, log, index) => html + `
    
    <div id="deed" class="deed">
        <h2>"caught" Pokemon</h2>
        <h2 class="deed-title">${log.name}</h2>
       
        <img src="${log.sprites.front_default}" alt="${log.name}" class="pokemon-image">
        
        <button  class="remove" data-index="${index}">Remove</button>
        
    </div>`, '')
}


//eventListener
 $more.addEventListener('click', async function(e){
    e.preventDefault();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${deck.length}`)
    const json = await response.json()

    displayProperties(json)

 })


 $history.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove')) {
        console.log("Remove button clicked");
        
        // Delete the log from history
        history.splice(e.target.dataset.index, 1);

        // Update local storage
        localStorage.setItem('history', JSON.stringify(history));
        // alert("The Pokemon has been released!");
        // Update display history
        displayHistory(history);
    }
});

$properties.addEventListener('click', async function (e) {
    // console.log(e.target)
    e.preventDefault();
    const $property = e.target.closest('.gallery')

    if ($property) {
        const pokemonId = $property.dataset.id;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const json = await response.json();
        console.log(json);

        // Store the clicked Pokemon data in local storage
        localStorage.setItem('clickedPokemon', JSON.stringify(json));


        displayDeeds(json)

        $dialog.showModal();

        $close.addEventListener('click', function () {
        //    console.log('close button clicked')
            $dialog.close();
             
        });

       
        const $catchButton = document.getElementById('catch');
        $catchButton.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log("Button clicked");
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const json = await response.json();
            console.log(json);
            // $dialog.close();
            alert("The Pokemon has been caught!");

            history.unshift(json);
            localStorage.setItem('history', JSON.stringify(history));
            displayHistory(history);
        
        } )

        
        displayHistory(history)
            }
        
            
        });
        
        displayHistory(history);
        
        
        // Function to fetch Pokemon details
        async function fetchPokemonDetails(pokemon) {
           try {
                const response = await fetch(pokemon.url);
                const data = await response.json();
                console.log(data);
                return {
                    id: data.id,
                    name: data.name,
                    image: data.sprites.front_default
                };
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
                return null;
            }
        }
        
        
        // Function to display Pokemon 
        async function displayProperties(pokemonData) {
            deck.push(...pokemonData.results);
        
          
            const pokemonDetailsPromises = deck.map(fetchPokemonDetails);
            const pokemonDetails = await Promise.all(pokemonDetailsPromises);
        
            console.log(pokemonDetails);
        
            $properties.innerHTML = pokemonDetails.reduce((html, pokemon, index) => {
                if (pokemon) {
                    return html + `
                        <div id="gallery"
                         class="gallery" data-id="${pokemon.id}">
                            <div class="pokemon">
                                <h2 class="pokemon-name">${pokemon.name}</h2>
                                <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image">
                            </div>
                        </div>`;
                } else {
                    return html; 
                }
            }, '');
        
        
            
        }
        
        //Function to display DEED
        function displayDeeds(property) {
            const types = property.types.map(type => type.type.name).join(', ');
            const moves = property.moves.slice(0, 3).map(move => move.move.name).join(', ');
        
            $dialog.innerHTML = `
                <div id="deed" class="deed">
                    <h2 class="deed-title">${property.name}</h2>
                    <div class="deed-types">${types}</div>
                    <div class="deed-moves">${moves}</div>
                    <img src="${property.sprites.front_default}" alt="${property.name}" class="property-image">
                    <button id="catch">Catch</button>
                   
                    <button id="close">Close</button>
                </div>`;
        
                
        // Reattach event listener for the close button
        const $closeButton = document.getElementById('close');
        $closeButton.addEventListener('click', function() {
            $dialog.close();
        });           
}


//API Request
fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
.then(response => response.json())
.then(json => {
    console.log(json)
    displayProperties(json)
}
)
