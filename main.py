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


ageHeightWeight = soup.find("div", class_="bio-holder").text.strip()
weightClass = soup.find("div", class_="association-class").text.strip()
country = soup.find("strong", itemprop="nationality").text
wins = soup.find("div", class_="winloses win").text
lose = soup.find("div", class_="winloses lose").text
noContest = soup.find("div", class_="winloses nc").text
fightHistory = soup.find("table", class_="new_table fighter").text
print(name)

