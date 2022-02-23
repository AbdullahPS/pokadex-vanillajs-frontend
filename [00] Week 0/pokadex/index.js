
const pokemonContainer=document.getElementById('pokemonList');
const modal = document.getElementById('pokemonModel');
// Get the <span> element that closes the modal
const span = document.getElementById("close");

const form = document.getElementById('form');
const query = document.getElementById('query');


// When the user clicks on <span> (x), close the modal
const closeModal = ()=> {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
const pickThirtyRandom = ()=>{
    // pick 30 pokemons randomly (1 to 150 )
    let randomPicks = [];            //declare a set in order to pick 30 unique random numbers
    while (randomPicks.length<30){
        let r = Math.floor(Math.random() * 149) + 1;    //get random numbers from 1 to 150 
        if (randomPicks.indexOf(r)===-1) randomPicks.push(r); //just add if its not already in the array 

    }
    let sortedAdday = randomPicks.sort((a,b)=>(a-b));
return sortedAdday;
}

const createPokemon =(pokemonarray)=>{
    //console.log(pokemonarray);
       const pokemonElements = pokemonarray.map(element=>{
          return  `
          <li class ="pokcard" id="pok${element.id}">
          <div class ="pokcardForClick" onClick="showPopUp(${element.id})">
             <p> ID :${element.id}</p>
             <img src="${element.image}" class ="card-image">
             <p>Name : ${element.name}</p>
             <p>Type :${element.type}</p>
          </div>
          <div class="switch" id="switch${element.id}">
             <label>
             <input type="checkbox"  onChange="onCheckBoxChange(${element.id}) "    ${(() => { 
             return  isCaptured(element.id)? `
             checked="true"
             ` : ``;
             })()} >
             <span class="lever"></span>
             </label>
             <p style="display:inline;">Captured 
             </p>
          </div>
          </label>
       </li>
          
          `


       })
       pokemonContainer.innerHTML=pokemonElements.join(" ");

}
const displayModal=(pokemondetails)=>{

const htmltext=`
<div class="modal-content">
<span class="close" id="close" onClick="closeModal()">&times;</span>
<div class="pokemonDetail">
    <img src= "${pokemondetails.image}" class ="image">
    <p class= "pokoname"> ${pokemondetails.name}</p>
    <hr>
 <p class = "title"> Type(s)</p>
 <div class ="flexc" >


${(() => { 

    //check if Pokemon has 1 Type or more
   return  pokemondetails.type.length==1? `
    <p class = "type1">${ pokemondetails.type[0].type.name} </p>
` :
pokemondetails.type.map((el,index)=>
 ` <p class = "type${index+1}">${el.type.name} </p>
 `
 ).join(' ');

 })()}


 </div>
 <hr>
 </div class = "stats">
 <p class = "title">Stats</p>
 ${
 (() => { 
 return pokemondetails.stats.map(el=>
 `
 <div>
    <label for="file">${el.stat.name}:</label>
    <progress id="file" value="${el.base_stat}" max="100"> 32% </progress>
 </div>
 `
 ).join(' ');
 })()
 }
 <div class=" moves" >
    <hr>
    <ul class="moveslist" >
       ${(() => { 
       return  pokemondetails.moves.map(
       el=>`
       <li>${el.move.name}</li>
       `
       ).join(' ');
       })()}
    </ul>
 </div>
 </div>
`;
modal.innerHTML=htmltext;
modal.style.display="block";
}
const showPopUp =(id)=>{
    console.log( ` ${id}was clicked`);
    fetchPokByID(id);
    
    //modal.style.display='block';


}
document.getElementById("nav-mobile").addEventListener("click",function(e) {
    if (e.target.nodeName === 'li')
    console.log('Responding')      
  });

const fetchPokemon = () => {
    const url = (i)=>`https://pokeapi.co/api/v2/pokemon/${i}`;
    const pokNums=150;
    let promises =[];
    for(let i=1; i <=150;i++){
        promises.push(
        fetch(url(i)).then(response => response.json()) //returns another promise
        )
    }
    Promise.all(promises).then(data=>{
        let randomPick = pickThirtyRandom();
       const pokemonarray=  randomPick.map(element=>({
            id:data[element-1].id,
            name:data[element-1].name,
            image:data[element-1].sprites['front_default'],
            type:data[element-1].types.map(el=>el.type.name).join(' ')


        }));
        createPokemon(pokemonarray);     
    }

        )
};



 fetchPokemon();


 const submitted=(event)=> {
  event.preventDefault();
   console.log(query.value);
   fetchPokByName(query.value);

}

form.addEventListener('submit', submitted);

const fetchPokByName = (name) => {
    const url =`https://pokeapi.co/api/v2/pokemon/${name}`;
  
        
     fetch(url  ).then(response => response.json()) //returns another promise
        
    
    .then(data=>{console.log(data);
        const pokemon={
             id:data.id,
           name:data.name,
           image:data.sprites['front_default'],
            type:data.types.map(el=>el.type.name).join(' ')
            
        };
        console.log(pokemon);
        fetchPokByID(pokemon.id);

     } ).catch(err => {
        console.log(err);
        alert("This Pokemon name doesnt exist, please check your spelling");
     }) ;
};

const  fetchPokByID = (id) => {
    const url =`https://pokeapi.co/api/v2/pokemon/${id}`;
  
        
    fetch(url  ).then(response => response.json()) //returns another promise
        
    
    .then(data=>{console.log(data);
        const pokemon={
           id:data.id,
           name:data.name,
           image:data.sprites['front_default'],
           type:data.types,
           moves:data.moves,
           stats:data.stats

            
        };
        displayModal(pokemon);
       // console.log(pokemon);

 

     } ).catch(err => {
        console.log(err);
        alert("This Pokemon name doesnt exist, please check your spelling");
     }) ;
};


const onCheckBoxChange=(key)=>{
    if (isCaptured(key)){
    localStorage.removeItem(key);
    }
    else{
    capturePokemon(key);}

}
function capturePokemon(key){
    var sendJSON = JSON.stringify('anything for now ');
    localStorage.setItem(key,sendJSON)
}

function isCaptured(key){
    console.log( localStorage.getItem(key)!==null);
    return  localStorage.getItem(key)!==null;
   

}