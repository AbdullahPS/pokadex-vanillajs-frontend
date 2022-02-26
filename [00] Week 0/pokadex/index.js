const pokemonContainer=document.getElementById('pokemonContainer')
const pokemonList=document.getElementById('pokemonList');
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
          <li class ="pokcard" id="${element.id}">
          <div class ="pokcardForClick" onClick="showPopUp(${element.id})">
             <p id="pokId${element.id}"> ID :${element.id}</p>
             <img src="${element.image}" class ="card-image" id="image${element.id}">
             <p id=pokName${element.id}>Name : ${element.name}</p>
             <p id=pokType${element.id}>Type :${element.type}</p>
          </div>
          <div class="switch" id="switch${element.id}">
             <label>
             <input type="checkbox"  onChange="onCheckBoxChange(${element.id}) "    ${(() => { 
             return  element.captured? `
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
       pokemonList.innerHTML=pokemonElements.join(" ");

}
const displayModal=(pokemondetails)=>{

 const htmltext= `
<div class="modal-content">
   <span class="close" id="close" onClick="closeModal()">&times;</span>
   <div class="pokemonDetail">
      <img src= "${pokemondetails.image}" class ="image">
      <p class= "pokoname"> ${pokemondetails.name}</p>
   </div>
   <hr>
      <p class = "title"> Type(s)</p>
    <div class ="flexc" >
${(() => { 

    //check if Pokemon has 1 Type or more
   return  pokemondetails.type.length==1? `
    <p class = "type1">${ pokemondetails.type[0]} </p>
` :
pokemondetails.type.map((el,index)=>
 ` <p class = "type${index+1}">${el} </p>
 `
         ).join(' ');

            })()}


     </div>
  <hr>

 <div class = "stats" id ="divStats"> 
 <p class = "title">Stats</p>

 </div>
 <div class=" moves" >
    <hr>
    <ol class="moveslist"  >
       ${(() => { 
       return  pokemondetails.moves.map(
       el=>`
       <li>${el.move.name}</li>
       `
       ).join(' ');
       })()}
    </ol>
 </div>
 </div>
`;
modal.innerHTML=htmltext;
fillStats(pokemondetails.id);
modal.style.display="block";
}
const showPopUp =(id)=>{
    //name type image and id can be obtained from DOM
    const element = document.getElementById(id);
    const pokemon={
        
     id:document.getElementById(`pokId${id}`).innerHTML.split(':')[1],
     name:document.getElementById(`pokName${id}`).innerHTML.split(':')[1],
     type:document.getElementById(`pokType${id}`).innerHTML.split(':')[1].split(' '),
     image:document.getElementById(`image${id}`).src
    }
    
    console.log('First one is '+pokemon)
    fetchPokByID(id,pokemon);
    
    //modal.style.display='block';

///WIP
}

const fetchPokemon = () => {
    //const url = (i)=>`https://pokeapi.co/api/v2/pokemon/${i}`;
    const url =(i)=> `http://pokadex-api2.herokuapp.com/pokemon/pokadex/${i}`

    const pokNums=150;
    let promises =[];
    for(let i=1; i <=150;i++){
        promises.push(
        fetch(url(i)).then(response => response.json()) //returns another promise
        )
    }
    Promise.all(promises).then(data=>{
        // data=JSON.stringify(data);
        let randomPick = pickThirtyRandom();
        const pokemonarray=  randomPick.map(element=>(
{
            id:data[element-1][0].id,
            name:data[element-1][0].name['english'],
            //image:data[element-1].sprites['front_default'],
            image:`https://pokadex-api2.herokuapp.com/pokemon/images/${data[element-1][0].id}`,    
            type:data[element-1][0].type.map(el=>el).join(' '),
            captured:data[element-1][0].captured==true

}
         ));
        createPokemon(pokemonarray);  
        getPokemonsImages();
        

    }

        )
};


const getPokemonsImages=()=>{

//get all ids from current pokemons on the screen
const allPoks=document.querySelectorAll('.pokcard')
const pokIds=[...allPoks].map(pok=>pok.id);
const url=(i)=>`https://pokadex-api2.herokuapp.com/pokemon/images/${i}`;
let promises=[];
pokIds.forEach(element=>
    promises.push(fetch(url(element)))

    )
Promise.all(promises).then(response=>console.log(response)
//                     .then(imageBlob => {
//                         // Then create a local URL for that image and print it 
//                         const imageObjectURL = URL.createObjectURL(imageBlob);
//                         console.log(imageObjectURL);
// //make a call and save them

// //change it 
//                     }
).catch(err=>console.log(err))
}


 fetchPokemon();


 const submitted=(event)=> {
  event.preventDefault();
   console.log(query.value);
   fetchPokByName(query.value);

}

form.addEventListener('submit', submitted);

const fetchPokByName = (name) => {
    const url =`https://pokadex-api2.herokuapp.com/pokemon/pokadex/name/${name}`;
  
        ///TODO
     fetch(url).then(response => response.json()) //returns another promise
     .catch(err => alert(err)) // TypeError: failed to fetch 

        
    
    .then(data=>{
         const pokemon={
             id:data[0].id,
           name:data[0].name.english,
           image:`https://pokadex-api2.herokuapp.com/pokemon/images/${data[0].id}`,    
           type:data[0].type
            
        };
        console.log(pokemon);
        fetchPokByID(pokemon.id,pokemon);

     } ).catch(err => {
        console.log(err);
        //alert("This Pokemon name doesnt exist, please check your spelling");
     }) ;
};

const  fetchPokByID = (id,pokemonOld) => {
    const url =`https://pokeapi.co/api/v2/pokemon/${id}`;
    //const url =`https://pokadex-api2.herokuapp.com/pokemon/moves/${id}`
  
        
    fetch(url).then(response => response.json()) //returns another promise
        
    
    .then(data=>{
        const pokemon={
          ...pokemonOld,
          moves:data.moves

         };

        displayModal(pokemon);

 

     } ).catch(err => {
        console.log(err);
        alert("This Pokemon name doesnt exist, please check your spelling");
     }) ;
};


const fillStats =(id) =>{
    const url =`https://pokadex-api2.herokuapp.com/pokemon/pokadex/${id}`;
  
    ///TODO
 fetch(url).then(response => response.json()) //returns another promise
 .catch(err => alert(err)) // TypeError: failed to fetch 

    

.then(data=>{
     const pokemonStats=Object.entries(data[0].base).map(([key, value]) =>`
         <div>
         <div class="label">
         <label for="file" class="label">${key}:</label>    </div>

       <progress id="file" value="${value}" max="100" class ="progress"> <h1>${value}</h1> </progress>
    </div>
         `

     )
    const statDivs= document.getElementById('divStats')
    statDivs.innerHTML=pokemonStats.join(' ')


 } ).catch(err => {
    console.log(err);
    //alert("This Pokemon name doesnt exist, please check your spelling");
 }) ;
}

const onCheckBoxChange=(id)=>{
    const url = `https://pokadex-api2.herokuapp.com/pokemon/${id}`
        fetch(url,{
            method:'PUT'}
            ).then().catch()
}

   

