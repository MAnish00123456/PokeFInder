const container = document.createElement("div");
let stoploading = false
let issearching = false
const func1 = async () => {
    stoploading = false
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20000`)
    const list = await res.json()
    const dataset = []
    list.results.forEach(item => dataset.push(item))
    const urlset = []
    dataset.forEach((item => urlset.push(item.url)))

    // Create a container for all cards

    container.className = "d-flex flex-wrap justify-content-center gap-3";
    document.body.appendChild(container);


    for (let i = 0; i < urlset.length; i++) {
        if (stoploading || issearching) break
        try {
            const url = urlset[i]
            const res1 = await fetch(url)
            if (!res1.ok) continue
            const data = await res1.json()
            // console.log(data)
            const imgsrc = data.sprites.front_default
            // console.log(imgsrc)
            if (imgsrc) {
                const div = document.createElement(`div`)
                div.innerHTML = `
                        <div class="card" style="width: 18rem;">
                        <img src="${imgsrc}" class="card-img-top" alt="..."/>
                            <div class="card-body">
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text">Type: ${data.types.map(item => item.type.name).join(`,`)}</p>
                                <a href="#" class="btn btn-primary">more</a>
                            </div>
                        </div>`

                // append the constructed card to the document body
                container.appendChild(div)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}
window.onload = () => {
    func1()
}
const searchbtn = document.querySelector(`.searchbtn`)

searchbtn.addEventListener(`click`, async () => {

    const pokename = document.querySelector(`.pokename`).value.toLowerCase()
    console.log(pokename)
    if (!pokename) alert("please enter a pokemon name")
    stoploading = true
    issearching = true
    container.innerHTML = "" //clear previous results
    await new Promise(resolve => setTimeout(resolve, 100));//wait for ongoing fetch to stop


    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`)
        // console.log(res)
        if (!res.ok) throw new Error(`pokemon not found`)
        const data = await res.json()
        console.log(data.types.map(item => item.type.name).join(`,`))
        const imgsrc = data.sprites.front_default
        console.log(imgsrc)
        if (imgsrc) {
            const div = document.createElement(`div`)
            div.innerHTML = `
                        <div class="card" style="width: 18rem;">
                        <img src="${imgsrc}" class="card-img-top" alt="..."/>
                            <div class="card-body">
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text">Type: ${data.types.map(item => item.type.name).join(`,`)}</p>
                                <a href="#" class="btn btn-primary">more</a>
                            </div>
                        </div>`
            container.appendChild(div)
        }
    }
    catch (err) {
        console.log(err)
    }
})