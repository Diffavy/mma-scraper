import requests, re, cloudscraper
from bs4 import BeautifulSoup


url = "https://www.sherdog.com/fighter/Tom-Aspinall-65231"
fightersData = {}

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

soup = getSoup(url)

def getName(soup):
    name = soup.find("span", class_="fn").text
    return name.split(" ") #['first-name','last-name']

name = getName(soup)

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


#Add function to get record
def getRecord(soup):
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
        methods.append(winby.find("b").text)
        round_td = winby.find_next_sibling("td")
        time_td = round_td.find_next_sibling("td")

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

for fight in getFights(soup):
    print(fight)



