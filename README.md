# MMA Fighter Comparison tool

## Description

Scrapes data from Sherdog and provides a clear comparison tool between any two fighters in our database. Provides a script to automatically obtain data on any fighter of your choice (in Sherdog) and provides a clean platform of comparison with no fluff for those less technically inclined.

## Stack

Python, BeautifulSoup, cloudscraper, vanilla HTML/CSS/JS

## Folder structure

```
mma-scraper/
├── data/
│   ├── max_holloway.json
│   ├── tom_aspinall.json
│   └── ... (86 fighters)
├── images/
│   └──UFC_logo.svg
├── main.py
├── requirements.txt
├── fighters.json
├── index.html
├── styles.css
├── script.js
└── README.md
```

## How to run - Scraper

Clone the repo and navigate to the scraper folder. Create a virtual environment using the following command in cmd `python -m venv venv`. Then to activate the environment using the following command, Windows: `venv\Scripts\activate` or Mac: `source venv/bin/activate`. Then from the requirements.txt you can install all the necessary dependencies using `pip install -r requirements.txt`.

Final steps include searching any fighter of interest with Sherdog after it. Copy the url for the given fighter and place it within the saveFighter() function as the argument in the main.py file. The data for the given fighter is sent to the data directory and the fighter.json is updated to update the frontend.

## How to run - Frontend

To open the frontend, use your local server to open the website. Use the command `python -m http.server 8000` to run the comparison website locally. Use the two inputs to select the two fighters and have their stats displayed on each side with their like stats in line.

## Limitations and design decisions

It is a desktop only design due to the nature of it being a three-column comparison layout is intentionally desktop-optimised. The nature of a side-by-side comparison does not translate well to mobile. Fighter data is stored locally in JSON files to avoid unnecessary database infrastructure.

Sherdog is protected by Cloudflare, meaning an active VPN may cause 403 errors. Disable your VPN before running saveFighter().
