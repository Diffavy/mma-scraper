let fighters = []

async function loadFighters() {
  const response = await fetch('fighters.json')
  fighters = await response.json()
}

const fighterOne = document.getElementById("name-1")
const fighterTwo = document.getElementById("name-2")

function searchInput (id) {
    const fighterInput = document.getElementById(id)
    fighterInput.addEventListener("input", (e) => {
    let selections = fighters.filter(f => f.name.toLowerCase().includes(e.target.value.toLowerCase()))
})
}

searchInput("name-1")
searchInput("name-2`")