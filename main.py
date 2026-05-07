import requests
from bs4 import BeautifulSoup


url = "https://www.sherdog.com/fighter/Tom-Aspinall-65231"
fightersData = {}

def getSoup(url):
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
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



win = soup.find("div", class_="winloses win").text
lose = soup.find("div", class_="winloses lose").text
noContest = soup.find("div", class_="winloses nc").text
fightHistory = soup.find("table", class_="new_table fighter").text


print(win.replace("Wins", "").strip())