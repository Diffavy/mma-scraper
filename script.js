let fighters = []

async function loadFighters() {
  const response = await fetch('fighters.json')
  fighters = await response.json()
}

function searchInput (id) {   // checks text input against fighter database and produces a dropdown
    const fighterInput = document.getElementById(id)
    const dropdown = document.getElementById(`fighter${id.slice(-1)}`)

    dropdown.addEventListener("click", async (e) => {
        if (e.target.tagName === "LI") {
            const filepath = e.target.dataset.filepath
            const response = await fetch(filepath)
            const fighterData = await response.json()
            
            const cardId = id === "name-1" ? "fighter-left" : "fighter-right"
            loadInCards(cardId, fighterData)
        }
    })
    
    fighterInput.addEventListener("input", (e) => {
    if (e.target.value.trim() === "") {  // returns early if input empty
        dropdown.innerHTML = ""
        return
    }
    
    let selections = fighters.filter(f => f.name.toLowerCase().includes(e.target.value.toLowerCase())).slice(0,10)
    
    dropdown.innerHTML = ""
    selections.forEach((f) => {
        dropdown.innerHTML += `\n<li data-filepath="${f.filepath}"><strong>${f.name}</strong></li>`
    })
})
}

function loadInCards(cardId, data) {
    const cardEl = document.getElementById(cardId)
    const name = data["name"].join(" ")
    const age = data["bioData"]["age"]
    const height = data["bioData"]["height"]
    const weightClass = data["bioData"]["weightClass"]
    const record = data["record"]
    const nationality = data["bioData"]["country"]
    const DOB = data["bioData"]["DOB"]

    let wins = 0; let NCs = 0; let losses = 0;

    data["fights"].slice(0,5).forEach((fight) => { // create last 5 fights record
        if (fight["result"] === "win") {
            wins++
        } else if (fight["result"] === "NC") {
            NCs++
        } else {
            losses++
        }
    })

    const last5FightsRec = `${wins}W - ${losses}L - ${NCs}NC`
    const fights = data["fights"]

    cardEl.querySelector("h2").classList.toggle("hidden") // remove loading text before inputting card element
    cardEl.querySelector(".search-wrapper").classList.toggle("hidden") // remove search input

    
}
async function init() {
    await loadFighters()
    searchInput("name-1")
    searchInput("name-2")
}

init()