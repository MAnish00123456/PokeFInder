//movement pf page to show next and prev buttons
const movement = document.querySelector(`.movement`);
let isscrollhandleractive = true;
const onScroll = () => {
    if (!isscrollhandleractive) return;
    const scrollpos = window.scrollY + window.innerHeight;
    const pageht = document.documentElement.scrollHeight;
    //not at bottom
    movement.classList.remove(`show`);
    movement.classList.add(`hidden`);
    if (scrollpos >= pageht - 100) {
        //near bottom
        movement.classList.remove(`hidden`);
        movement.classList.add(`show`);
    }

}

//coubtrs to keep track of fetched pokemons
let i = 0;
let counter = 32;

//div container for cards

const container = document.createElement("div");

//main function to fetch and display pokemon cards
const pokemoncards = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20000`);
    const list = await res.json();
    const dataset = [];
    list.results.forEach(item => dataset.push(item));
    const urlset = [];
    dataset.forEach((item => urlset.push(item.url)));//array of urls for data of pokemons
    // console.log(urlset.length)

    // Create a container for all cards

    container.className = "d-flex flex-wrap justify-content-center gap-3";
    document.body.appendChild(container);
    // console.log(i,counter)
    //ftech data for first 32 pokemons and create cards
    for (i; i < counter; i++) {
        try {
            const url = urlset[i];
            const res1 = await fetch(url);
            if (!res1.ok) continue;
            const data = await res1.json();
            // console.log(data)
            const imgsrc = data.sprites.front_default;
            // console.log(imgsrc)
            if (imgsrc) {
                const div = document.createElement(`div`);
                div.innerHTML = `
                        <div class="card" style="width: 18rem;">
                        <img src="${imgsrc}" class="card-img-top" alt="..."/>
                            <div class="card-body">
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text">Type: ${data.types.map(item => item.type.name).join(`,`)}</p>
                                <a href="#" class="btn btn-primary" data-name="${data.name}">more</a>
                            </div>
                        </div>`;

                // append the constructed card to the document body
                container.appendChild(div);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
//call main function on window load
window.onload = () => {
    pokemoncards();
}

//search button functionality
const searchbtn = document.querySelector(`.searchbtn`);

//search button logic
const searchpokemon = async () => {
    const pokename = document.querySelector(`.pokename`).value.toLowerCase();
    // console.log(pokename)
    if (!pokename) {
        alert("please enter a pokemon name");
        container.innerHTML = ""; // clear previous cards
        i = 0;
        counter = 32;
        pokemoncards(); // show default cards
        return; // exit the function early
    }
    container.innerHTML = "";//clear previous results
    await new Promise(resolve => setTimeout(resolve, 100));//wait for ongoing fetch to stop


    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`);
        // console.log(res)
        if (!res.ok) throw new Error(`pokemon not found`);
        const data = await res.json();
        // console.log(data.types.map(item => item.type.name).join(`,`))
        const imgsrc = data.sprites.front_default;
        // console.log(imgsrc)
        // console.log(data.moves.map(item=>item.move.name).join(`,`))
        if (imgsrc) {
            const div = document.createElement(`div`);
            div.innerHTML = `
                        <div class="card" style="width: 18rem;">
                        <img src="${imgsrc}" class="card-img-top" alt="..."/>
                            <div class="card-body">
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text">Type: ${data.types.map(item => item.type.name).join(`,`)}</p>
                                <a href="#" class="btn btn-primary" data-name="${data.name}">more</a>
                            </div> 
                        </div>`;
            container.appendChild(div);
        }
    }
    catch (err) {
        console.log(err);
    }
}

//cancel button functionality
const cancelbtn = document.querySelector(`.cancelbtn`);

const cancelsearch = () => {
    container.innerHTML = "";
    i = 0;
    counter = 32;
    document.querySelector(`.pokename`).value = '';
    pokemoncards();
}

//function to show extra details of a  pokemon using more button
const showdetails = async (targetname) => {
    container.innerHTML = "";
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetname}`);
        if (!res.ok) throw new error('pokemon not found');
        const data = await res.json();
        // console.log(data)
        const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join("<br>");
        const abilities = data.abilities.map(a => a.ability.name).join(`,`);
        const imgsrc = data.sprites.front_default;
        if (imgsrc) {
            const detaildiv = document.createElement('div');
            detaildiv.classList.add("text-center", "mt-4");
            detaildiv.innerHTML = `<div class="card mx-auto" style="width: 22rem;">
            <img src="${imgsrc}" class="card-img-top" alt="${data.name}">
        <div class="card-body">
          <h3 class="card-title text-capitalize">${data.name}</h3>
          <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
          <p><strong>Abilities:</strong> ${abilities}</p>
          <p><strong>Stats:</strong><br>${stats}</p>
          <button class="btn btn-secondary back-btn mt-3" style="background-color: #007bff;">Back</button>
        </div>
        </div>`;
            container.appendChild(detaildiv);

        }
    }
    catch (err) {
        console.log(err);
    }
}

//event delegation for more details and back button
const showmore = async (e) => {
    if (e.target.classList.contains(`btn-primary`) && e.target.hasAttribute("data-name")) {
        e.preventDefault();
        // console.log(`clicked`)
        const targetname = e.target.getAttribute(`data-name`);
        isscrollhandleractive = false;
        movement.classList.add(`hidden`)
        showdetails(targetname);
    }
    else if (e.target.classList.contains(`back-btn`)) {
        container.innerHTML = "";
        document.querySelector(`.pokename`).value = '';
        i = counter - 32;
        isscrollhandleractive = false;
        movement.classList.add(`hidden`)
        await pokemoncards();
        isscrollhandleractive = true;
        onScroll();
        // console.log(i, counter);
    }
}

//next btn functionality
const nextbtn = document.querySelector('.next');
const nextsearch = async () => {
    container.innerHTML = '';
    i = counter;
    counter += 32;
    isscrollhandleractive = false;
    await pokemoncards();
    isscrollhandleractive = true;
    onScroll();
}

const prevbtn = document.querySelector(`.prev`);
const prevsearch = async () => {
    i = i - 32;
    // console.log(i, counter);
    if (i < 0||counter<=32) {
        alert("Starting of the page");
        i = 0;
        counter = 32;
        container.innerHTML = '';
        isscrollhandleractive = false;
        await pokemoncards();
        isscrollhandleractive = true;
        onScroll();
    }
    else {
        counter = i;
        i = i - 32;
        if(i<0) i=0;
        // console.log(i,counter)
        container.innerHTML = ''
        isscrollhandleractive = false;
        await pokemoncards();
        isscrollhandleractive = true;
        onScroll();
    }
}
//attached scroll event listener
window.addEventListener(`scroll`, onScroll);
//search button event listener
searchbtn.addEventListener(`click`, searchpokemon);
//cancel button event listener
cancelbtn.addEventListener(`click`, cancelsearch);
//next list of pokemons event listener
nextbtn.addEventListener(`click`, nextsearch);
//show more details and back button event listener using event delegation
document.addEventListener(`click`, showmore);

prevbtn.addEventListener(`click`, prevsearch)