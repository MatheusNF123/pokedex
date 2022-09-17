const carregando = document.querySelector('.carregando');
const buscar = document.getElementById('buscar')
const buscar_img = document.getElementById('buscar-img')
const x = document.querySelector('.x')

const fetchAllPokemon = (param) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${param}&limit=20`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => error)
}

const fetchAllPokemonName = (param) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${param}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch(error => error)
}


const criaElemento = (objeto) => {
    const sectionMain = document.querySelector('.conteudo')
    const section = document.createElement('section')
    section.className = `conteudo_pokemon ${objeto.tipo[0]}1` 
    section.setAttribute('data-bs-toggle', 'modal')
    section.setAttribute('data-bs-target', '#exampleModal') 
    section.addEventListener('click', adicionaEvent)  
    const img = document.createElement('img')
    const span = document.createElement('span')
    img.classList.add('imgPoke')
    span.classList.add('nome')
    const div = document.createElement('div')
    const span_tipo1 = document.createElement('span')
    const span_tipo2 = document.createElement('span')
    span_tipo1.classList.add('desbuga')
    span_tipo2.classList.add('desbuga')
    span_tipo1.classList.add(objeto.tipo[0])
    span_tipo1.innerText = objeto.tipo[0]
    if(objeto.tipo[1] !== undefined) {
        span_tipo2.innerText = objeto.tipo[1]
        span_tipo2.classList.add(objeto.tipo[1])
    }
   
    span.innerText = objeto.nome
    section. appendChild(span)
    
    if(objeto.imagem !== null){
        img.src = objeto.imagem
        section.appendChild(img)
        div.appendChild(span_tipo1)
        div.appendChild(span_tipo2)
        section.appendChild(div)
        sectionMain.appendChild(section)
    }
    

}
const criarObjeto = (obj) => {
    const objeto = {
        nome: obj.name,
        imagem: obj.sprites.front_default,
        imagem_back: obj.sprites.back_default,       
        tipo: obj.types.map(elemento => elemento.type.name),
        hp: obj.stats[0].base_stat,
        attack: obj.stats[1].base_stat,
        def: obj.stats[2].base_stat,
        habilidades: obj.abilities.map(element => element.ability.name).join(' - ')
        
    }    
    console.log(objeto.habilidades);
    return objeto
}

const adicionaEvent = async (event) => {  
    const newObj = {} 
    const imgCard = document.getElementById('card-img')  
    const hp = document.getElementById('hp')  
    const stats = document.getElementById('stats')  
    const habilidades = document.getElementById('habilidades')  
    const modal_title = document.querySelector('.modal-title')  
    const card_container = document.querySelector('.card')  
    const modal_content = document.querySelector('.modal-content')  
    
    if(event.target.classList.contains('desbuga')){
        const nome = event.target.parentNode.parentNode.firstChild.innerText
        const pokemon = await fetchAllPokemonName(nome)
        Object.assign(newObj, pokemon)       
       
    }
    else if(event.target.classList.contains('conteudo_pokemon')){
        const nome = event.target.firstChild.innerText
        const pokemon = await fetchAllPokemonName(nome)
        Object.assign(newObj, pokemon)
    }
    
   else if(event.target.classList.contains('imgPoke')){ 
        const nome = event.target.parentNode.firstChild.innerText
        const pokemon = await fetchAllPokemonName(nome)
        Object.assign(newObj, pokemon)
        
    }
    else{  
        const nome = event.target.innerText
        const pokemon = await fetchAllPokemonName(nome)
        Object.assign(newObj, pokemon)
       
    }   
    
    const objetoCriado = criarObjeto(newObj)
    imgCard.src = objetoCriado.imagem
    modal_title.innerText = objetoCriado.nome
    hp.innerHTML = ` <strong><small class='hp-txt'>HP:</small></strong>  ${objetoCriado.hp}`
    stats.innerHTML = `<strong>Attack:</strong> ${objetoCriado.attack} | <strong>Defense</strong> ${objetoCriado.def}`
    habilidades.innerHTML = objetoCriado.habilidades
}
 
let arrayDeNomes = []
let arrayDePromisses = []

const recuperaElemento = async () => {
    arrayDeNomes = []
     arrayDePromisses = []
    const item = document.querySelectorAll('.conteudo_pokemon')
    if(item.length === 0){    
    for(let a = 20; a <= 120; a +=20){
    const {results} = await fetchAllPokemon(a)
    const armazenaPokemon1 = results.map((elemento) => elemento.name).sort()
    arrayDeNomes.push(armazenaPokemon1)
} 
}else{

    item.forEach(elemento => elemento.remove())  
    for(let a = 20; a <= 120; a +=20){
        const {results} = await fetchAllPokemon(a)
        const armazenaPokemon1 = results.map((elemento) => elemento.name).sort()
        arrayDeNomes.push(armazenaPokemon1)
    } 
}

const arrayDeNomesEmOrdem = arrayDeNomes.flat().sort()
arrayDeNomesEmOrdem.forEach( async (nomes) => {
    arrayDePromisses.push(fetchAllPokemonName(nomes))      
})

const resolve = await Promise.all(arrayDePromisses)  
    carregando.remove()
    resolve.forEach((elemento) => {      
        criaElemento(criarObjeto(elemento))
})    

}
recuperaElemento()

const digiteSeuPokemon = async () => {
    const txtBusca = document.getElementById('txt-buscar')
    const item = document.querySelectorAll('.conteudo_pokemon')
    item.forEach(elemento => elemento.remove())  
  const filtraNomes = arrayDeNomes.flat(Infinity).filter(elemento => elemento.includes(txtBusca.value))
  if(filtraNomes.length === 0){
      window.alert('Error: Pokémon não encontrado! Tente novamente.')
      txtBusca.value = ''
      recuperaElemento()
}else{
  filtraNomes.forEach( async elemento => {
    const pokemon = await fetchAllPokemonName(elemento)    
    criaElemento(criarObjeto(pokemon))

})
}
}
buscar_img.addEventListener('click', digiteSeuPokemon)
document.addEventListener('keypress', (event) => {  
    const txtBusca = document.getElementById('txt-buscar')
    if(event.key === "Enter" && txtBusca.value.length > 0){
        digiteSeuPokemon()
      txtBusca.value = ''
    }
  })
x.addEventListener('click', () => {
    const txtBusca = document.getElementById('txt-buscar')
    const item = document.querySelectorAll('.conteudo_pokemon')
    item.forEach(elemento => elemento.remove())
    txtBusca.value = ''
    recuperaElemento()
})


window.onload = async () => {}