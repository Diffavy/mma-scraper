let fighters = []

async function loadFighters() {
  const response = await fetch('fighters.json')
  fighters = await response.json()
}
// checks text input against fighter database, produces a dropdown, uses listeners to toggle between
// search view and card view
function searchInput (id) {  
    const fighterInput = document.getElementById(id)
    const dropdown = document.getElementById(`fighter${id.slice(-1)}`)
    const cardId = id === "name-1" ? "fighter-left" : "fighter-right" 
    const cardEl = document.getElementById(cardId)
    const bioData = cardEl.querySelector(".bio-wrapper")

    dropdown.addEventListener("click", async (e) => {
        const li = e.target.closest("LI")
        if (li) {
            // dropdown disappears whilst fetch is running 
            dropdown.innerHTML = "" 
            fighterInput.value = ""
            const filepath = li.dataset.filepath
            const response = await fetch(filepath)

            fighterInput.disabled = true // prevents double-clicks from calling multiple fetches
            const fighterData = await response.json()
            fighterInput.disabled = false
            loadInCards(cardId, fighterData)
        }
    })
    
    // implement dropdown functionality
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

    // implement close button listener to reinstate fighter search/dropdwon and hide buttom
    const closeBtn = cardEl.querySelector(".close-btn")
    
    closeBtn.addEventListener("click", () => {
        cardEl.querySelector("h2").classList.remove("hidden")
        cardEl.querySelector(".search-wrapper").classList.remove("hidden")
        cardEl.querySelector(".bio-wrapper").classList.add("hidden")

        fighterInput.value = ""
        dropdown.innerHTML = ""
        bioData.innerHTML = ""

        closeBtn.classList.add("hidden")
    })
}


// loads in card data and updates html
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

    cardEl.querySelector("h2").classList.add("hidden") // remove loading text before inputting card element
    cardEl.querySelector(".search-wrapper").classList.add("hidden") // remove search input
    cardEl.querySelector(".close-btn").classList.remove("hidden") // show close button for fighter card
    cardEl.querySelector(".bio-wrapper").classList.remove("hidden") // show fighter card

    // update fighter card html with data
    const bioData = cardEl.querySelector(".bio-wrapper")
    bioData.innerHTML = `
    \n<h3 class="name">${name}</h3>
    \n<div class="name-horizontal-splitter"></div>
    \n<h3 class="age">${age} (${DOB})</h3>
    \n<div class="horizontal-splitter"></div>
    \n<h3>${record["wins"]} W - ${record["losses"]} L - ${record["noContests"]} NC</h3>
    \n<div class="horizontal-splitter"></div>
    \n<h3>${height}</h3>
    \n<div class="horizontal-splitter"></div>
    \n<h3>${weightClass}</h3>
    \n<div class="horizontal-splitter"></div>
    \n<h3>${nationality}</h3>
    \n<div class="horizontal-splitter"></div>
    \n<h3>${last5FightsRec}</h3>` 
}
async function init() {
    await loadFighters()
    searchInput("name-1")
    searchInput("name-2")
}

init()