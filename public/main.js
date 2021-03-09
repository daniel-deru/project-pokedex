const img = document.getElementById('img');
const display = document.createElement('img')
const pokemon = document.getElementById('name')
const height = document.getElementById('height')
const weight = document.getElementById('weight')
const pokeType = document.getElementById('types')
const ability = document.getElementById('ability')
const health = document.getElementById('health')
const attack = document.getElementById('attack')
const defence = document.getElementById('defence')
const speed = document.getElementById('speed')
const movesList = document.getElementById('moves')
const namesList = document.getElementById('names')
const namesContainer = document.getElementById('names-container')
const getPokemon = document.getElementById('get-pokemon')
const movesContainer = document.getElementById('moves-container')
const mainInfo = document.getElementById('main-info');
const scrollUp = document.getElementById('scroll-up')
const scrollDown = document.getElementById('scroll-down')
const menu = document.getElementById("menu")
const discription_text = document.getElementById("desc")
const move_information = document.getElementById("move-information")
const move_desc = document.getElementById("move-desc")
const move_title = document.getElementById("move-title")
const exit  = document.querySelector("#moves-icon")
const exitName  = document.querySelector("#names-icon")



let counter = 1

async function next(){  
    counter++
    await getImage()
    await getData()
    await description()
}

async function previous(){
    if(counter > 1){
        counter--
        await getImage()
        await getData()
       await description()
    }
}

async function getImage(){
    const image = await fetch(`https://pokeres.bastionbot.org/images/pokemon/${counter}.png`)
    const imageRes = await image.blob()
    display.src = URL.createObjectURL(imageRes)
}

async function getData(){
    const pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${counter}/`)
    const poke = await pokeData.json()
    pokemon.innerHTML = `${counter}. ${poke.name}`
    height.textContent = poke.height
    weight.textContent = poke.weight
    ability.textContent = poke.abilities[0].ability.name
    health.textContent = poke.stats[0].base_stat
    attack.textContent = poke.stats[1].base_stat
    defence.textContent = poke.stats[2].base_stat
    speed.textContent = poke.stats[5].base_stat

    //this is for the types
    let typesData = []
    for(type of poke.types){
        typesData.push(type.type.name)
        pokeType.textContent = typesData.join(' ')
    }

    //this is for the moves list
    let typeArray = []
 
    for(let i = 0; i < poke.moves.length; i++){
        typeArray.push(`<li class="move">${poke.moves[i].move.name}</li>`)
        movesList.innerHTML = typeArray.join('')
    }
    
    Array.from(movesList.children)
    for(let i = 0; i < movesList.children.length; i++){
        const child = movesList.children[i]
        child.addEventListener("click", async () => {
            const data = await fetch(poke.moves[i].move.url)
            const move = await data.json()
            move_title.textContent = child.textContent
            move_desc.textContent = move.effect_entries[0].effect
            move_information.style.transform = "scale(1) rotateZ(360deg)"
        })
    }
    
}

async function getName(){
    const name = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=890`)
    const nameRes = await name.json()
    for(let i = 0; i < nameRes.results.length; i++){
       const names = document.createElement('li')
        names.textContent = nameRes.results[i].name
        namesList.append(names)
        names.addEventListener("click", () => {
          counter = i + 1
          getData()
          getImage()
          description()
          namesContainer.style.right = "-400px"
          namesList.style.opacity = "0"
          namesList.style.transform = "translateX(-50px)"
          
        })
    }
    return nameRes

}

async function description(){
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${counter}/`)
    const desc = await data.json()

    const textArray = desc.flavor_text_entries.filter(elements => elements.language.name == "en")
    const random = textArray[Math.floor(Math.random() * textArray.length)].flavor_text
    discription_text.textContent = random
}



getName()
next()
previous()
img.append(display)

// this is for dom minupulation


getPokemon.addEventListener('click', () => {
    if(namesContainer.style.right == "-400px"){
        namesContainer.style.right = "0px";
        namesList.style.opacity = "1"
        namesList.style.transform = "translateX(0px)"
    }else {
        namesContainer.style.right = "-400px"
        namesList.style.opacity = "0"
        namesList.style.transform = "translateX(-50px)"
    }  
})

exitName.addEventListener("click", () => {
    namesContainer.style.right = "-400px"
    namesList.style.opacity = "0"
    namesList.style.transform = "translateX(-50px)"
})

exit.addEventListener("click", () => {
    move_information.style.transform = "scale(0) rotateZ(0)"
})


 
