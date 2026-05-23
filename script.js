let fighters = [];

async function loadFighters() {
  const response = await fetch("fighters.json");
  fighters = await response.json();
}
/* checks text input against fighter database, produces a dropdown, uses listeners to toggle between
 search view and card view */
function searchInput(id) {
  const fighterInput = document.getElementById(id);
  const dropdown = document.getElementById(`fighter${id.slice(-1)}`);
  const cardId = id === "name-1" ? "fighter-left" : "fighter-right";
  const cardEl = document.getElementById(cardId);
  const bioData = cardEl.querySelector(".bio-wrapper");

  dropdown.addEventListener("click", async (e) => {
    const li = e.target.closest("LI");
    if (li) {
      // dropdown disappears whilst fetch is running
      dropdown.innerHTML = "";
      fighterInput.value = "";
      const filepath = li.dataset.filepath;
      const response = await fetch(filepath);

      fighterInput.disabled = true; // prevents double-clicks from calling multiple fetches
      const fighterData = await response.json();
      fighterInput.disabled = false;
      loadInCards(cardId, fighterData);
    }
  });

  // implement dropdown functionality
  fighterInput.addEventListener("input", (e) => {
    if (e.target.value.trim() === "") {
      // returns early if input empty
      dropdown.innerHTML = "";
      return;
    }
    let selections = fighters
      .filter((f) =>
        f.name.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      .slice(0, 10);

    dropdown.innerHTML = "";
    selections.forEach((f) => {
      dropdown.innerHTML += `\n<li data-filepath="${f.filepath}"><strong>${f.name}</strong></li>`;
    });
  });

  // implement close button listener to reinstate fighter search/dropdwon and hide buttom
  const closeBtn = cardEl.querySelector(".close-btn");

  closeBtn.addEventListener("click", () => {
    cardEl.querySelector("h2").classList.remove("hidden");
    cardEl.querySelector(".search-wrapper").classList.remove("hidden");
    cardEl.querySelector(".bio-wrapper").classList.add("hidden");
    updateDivider();

    fighterInput.value = "";
    dropdown.innerHTML = "";
    bioData.innerHTML = "";

    closeBtn.classList.add("hidden");
  });
}

/*toggles the central stat name divider dependent on if both cards are visible*/
function updateDivider() {
  const isLeftCard = !document
    .getElementById("fighter-left")
    .querySelector(".bio-wrapper")
    .classList.contains("hidden");
  const isRightCard = !document
    .getElementById("fighter-right")
    .querySelector(".bio-wrapper")
    .classList.contains("hidden");

  document
    .querySelector(".stats")
    .classList.toggle("hidden", !(isLeftCard && isRightCard));
}

// loads in card data and updates html
function loadInCards(cardId, data) {
  const cardEl = document.getElementById(cardId);
  const name = data["name"].join(" ");
  const age = data["bioData"]["age"];
  const height = data["bioData"]["height"];
  const weightClass = data["bioData"]["weightClass"];
  const record = data["record"];
  const nationality = data["bioData"]["country"];
  const DOB = data["bioData"]["DOB"];
  const allFights = data["fights"];

  let wins = 0;
  let NCs = 0;
  let losses = 0;

  allFights.slice(0, 5).forEach((fight) => {
    // create last 5 fights record
    if (fight["result"] === "win") {
      wins++;
    } else if (fight["result"] === "NC") {
      NCs++;
    } else {
      losses++;
    }
  });

  const last5FightsRec = `${wins}W - ${losses}L - ${NCs}NC`;

  // finding finish rate and average fight time

  let finishes = 0;
  let decisions = 0;
  let totalTimeForWinsInSecs = 0;

  allFights.forEach((fight) => {
    if (fight["result"] === "win") {
      const currMethod = fight["method"].split(" ");
      if (currMethod[0] === "Decision") {
        decisions++;
      } else if (currMethod[0] === "No") {
        return;
      } else {
        finishes++;
      }
      const roundTimeInSecs = (Number(fight["round"]) - 1) * 60;
      const finishTime = fight["time"].split(":");
      totalTimeForWinsInSecs +=
        roundTimeInSecs + Number(finishTime[0]) * 60 + Number(finishTime[1]);
    }
  });

  const avgFightTimeInSecs = Math.floor(
    totalTimeForWinsInSecs / record["wins"],
  );
  const remainingSeconds = avgFightTimeInSecs % 60;
  const minutes = Math.floor(avgFightTimeInSecs / 60);
  const remainingMinutes = minutes % 5;
  const rounds = Math.floor(minutes / 5);

  const finishRate =
    ((finishes / (finishes + decisions)) * 100).toFixed(1) + "%";
  let averageFightTimeWins = "";

  if (rounds + 1 === 6) {
    averageFightTimeWins = `R5 Time - 5:00`;
  } else {
    averageFightTimeWins = `R${rounds + 1} ${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  cardEl.querySelector("h2").classList.add("hidden"); // remove loading text before inputting card element
  cardEl.querySelector(".search-wrapper").classList.add("hidden"); // remove search input
  cardEl.querySelector(".close-btn").classList.remove("hidden"); // show close button for fighter card
  cardEl.querySelector(".bio-wrapper").classList.remove("hidden"); // show fighter card

  // update fighter card html with data
  const bioData = cardEl.querySelector(".bio-wrapper");
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
    \n<h3>${last5FightsRec}</h3>
    \n<div class="horizontal-splitter"></div>
    \n<h3>${finishRate}</h3>
    \n<div class="horizontal-splitter"></div>
    \n<h3>${averageFightTimeWins}</h3>`;

  updateDivider();
}
async function init() {
  await loadFighters();
  searchInput("name-1");
  searchInput("name-2");
}

init();
