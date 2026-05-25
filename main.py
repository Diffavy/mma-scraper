import requests, re, cloudscraper, json, os
from bs4 import BeautifulSoup


def getSoup(url):
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://www.google.com"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    return soup

def getName(soup):
    name = soup.find("span", class_="fn").text
    return name.split(" ") #['first-name','last-name']

#Biodata: Age, D.O.B, Height, WeightClass, Country
def getBioData(soup):
    bioData = soup.find("div", class_="bio-holder").text.split()
    countryOfOrigin = soup.find("strong", itemprop="nationality").text

    a = bioData[6].split("'") # Helper varible to format height in feet)
    heightFt = a[0].replace("HEIGHT", "") + "'" + a[1]
    hieghtCm = bioData[8] + "cm"

    results = {
        "age": int(bioData[1]),
        "DOB": f"{bioData[4]} {bioData[3]} {bioData[5]}", # e.g. 01 Jan 2000
        "height": f"{heightFt} / {hieghtCm}",
        "weightClass": bioData[-1],
        "country": countryOfOrigin
    }

    return results


def getRecord(soup):
    try: 
        win = soup.find("div", class_="winloses win").text
        lose = soup.find("div", class_="winloses lose").text
        noContest = soup.find("div", class_="winloses nc").text
        
        winRec = win.replace("Wins", "").strip()
        loseRec = lose.replace("Losses", "").strip()
        noContestRec = noContest.replace("N/C", "").strip()

        return {
            "wins": int(winRec),
            "losses": int(loseRec),
            "noContests": int(noContestRec)
        }
    except:
        win = soup.find("div", class_="winloses win").text
        lose = soup.find("div", class_="winloses lose").text
        
        winRec = win.replace("Wins", "").strip()
        loseRec = lose.replace("Losses", "").strip()
        noContestRec = "0"
        return {
            "wins": int(winRec),
            "losses": int(loseRec),
            "noContests": int(noContestRec)
        }
        

def getFights(soup):
    results = soup.find_all("span", class_="final_result")
    opponents = soup.find_all("a", href=re.compile("^/fighter/"))
    events = soup.find_all("a", href=re.compile("^/events/"))
    dates = soup.find_all("span", class_="sub_line")


    resultsArr, opponentsArr, eventsArr, datesArr = [], [], [], []
    methods, rounds, times = [], [], []

    for result in results:
        resultsArr.append(result.text.strip())

    for opponent in opponents:
        opponentsArr.append(opponent.text.strip())

    for event in events:
        eventsArr.append(" ".join(event.text.split()))

    for i in range(0, len(dates), 2):
        datesArr.append(dates[i].text.strip().split("\n"))

    for winby in soup.find_all("td", class_="winby"): 
        methods.append(winby.find("b").text) #finds child b element with method to end fight
        round_td = winby.find_next_sibling("td") #final round for each fight first td sibling element to winby
        time_td = round_td.find_next_sibling("td") #end time for each fight second td sibling element to winby

        rounds.append(round_td.text.strip())
        times.append(time_td.text.strip())


    history = []

    for i in range(len(resultsArr)): #Cuts other arrays to the same length to avoid irrelevant data
        history.append({
            "result": resultsArr[i],
            "opponent": opponentsArr[i],
            "event": eventsArr[i],
            "date": datesArr[i],
            "method": methods[i],
            "round": rounds[i],
            "time": times[i]
        })
    return history


def getFightersData(url):
    soup = getSoup(url)
    fighterData = {}

    fighterData["name"] = getName(soup)
    fighterData["bioData"] = getBioData(soup)
    fighterData["record"] = getRecord(soup)
    fighterData["fights"] = getFights(soup)

    return fighterData


def saveFighter(url):
    fighterData = getFightersData(url)

    if len(fighterData["name"]) == 3:  # For middle names
        fileName = fighterData["name"][0].lower() + "_" + fighterData["name"][1].lower() + "_" + fighterData["name"][2].lower()
    else:
        fileName = fighterData["name"][0].lower() + "_" + fighterData["name"][1].lower()

    fighterName = " ".join(fighterData["name"])

    os.makedirs("data", exist_ok=True) # Create data directory if it doesn't exist
    filepath =  f"data/{fileName}.json"

    data = {"name": fighterName, "filepath": filepath}
    currFighters = []

    if os.path.exists("fighters.json"): # Update fighters.json with new fighter entry
        with open("fighters.json", "r") as f:
            currFighters = json.load(f)
    
    currFighters.append(data)

    with open("fighters.json", "w") as f:
        json.dump(currFighters, f, indent= 4)
    
    with open(filepath, "w") as f:
        json.dump(fighterData, f, indent=4)
    
    print(f"Saved {fileName}.json")

saveFighter("https://www.sherdog.com/fighter/Steve-Erceg-228813")