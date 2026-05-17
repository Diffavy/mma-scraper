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
            console.log(fighterData)
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

async function init() {
    await loadFighters()
    searchInput("name-1")
    searchInput("name-2")
}

init()