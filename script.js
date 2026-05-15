let fighters = []

async function loadFighters() {
  const response = await fetch('fighters.json')
  fighters = await response.json()
}

function searchInput (id) {   // checks text input against fighter database and produces a dropdown
    const fighterInput = document.getElementById(id)
    fighterInput.addEventListener("input", (e) => {
    const dropdown = document.getElementById(`fighter${id.slice(-1)}`)
    
    if (e.target.value.trim() === "") {  // returns early if input empty
        selections = []
        dropdown.innerHTML = ""
        return
    }

    let selections = fighters.filter(f => f.name.toLowerCase().includes(e.target.value.toLowerCase()))
    
    dropdown.innerHTML = ""
    selections.forEach((f) => {
        dropdown.innerHTML += `\n<li data-filepath="${f.filepath}">${f.name}</li>`
    })
})
}

async function init() {
    await loadFighters()
    searchInput("name-1")
    searchInput("name-2")
}

init()