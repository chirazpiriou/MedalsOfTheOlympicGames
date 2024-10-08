# Medals Of The Olympic Games

This project is an Angular-based web application that provides information on Olympic Games medal statistics by country, over several years. The project allows users to visualize medal data for different countries in the form of line and pie charts.
## Pre-requisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) - for running JavaScript on the server side.
- [Git](https://git-scm.com/) - for version control and managing repositories.
## Project Dependencies
- **Angular:** This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3. <br>
- **RxJS:** Used for handling observables.<br>
- **ngx-charts:** A charting library for visualizing data in Angular applications.
## Installation & Setup
**Clone the repository:**<br>
```
 git clone https://github.com/chirazpiriou/MedalsOfTheOlympicGames.git 
 ```
**Go to the project directory :**<br>
``` 
cd MedalsOfTheOlympicGames 
```
**Install your node_modules:**<br>
```
 npm install 
 ```
**Run the application on your local machine:**<br>
``` 
ng serve 
```
 Once the server is running, open your browser and navigate to `http://localhost:4200/. The application will automatically reload if any source files are changed.

## Build
``` 
ng build 
```

Use the following command to compile the Angular project. The build artifacts will be stored in the `dist/` directory.

## Main Views of the Application
- #### HomeComponent:
Displays an overview of all countries in the form of a pie chart.
A tooltip appears when hovering over a country, showing its total number of medals won. Click on the desired country to be redirected to the detailed page.<br>
- #### DetailComponent:
Provides detailed information about a selected country through a line chart, highlighting its performance in various editions of the Olympic Games, specifically regarding the number of medals earned each year.
Additionally, it includes data on the country's participation in the Olympic Games and the total number of athletes represented.<br>
- #### HeaderComponent:
Displays a navigation bar and a "Return" button to easily go back to the home page from the details view.

##  Error Handling
The application has comprehensive error handling to deal with:

- **Network issues:** Handles HTTP errors like 404 (Not Found), 500 (Internal Server Error), and others.
- **Data format issues:** If the fetched data doesn't match the expected structure, an error is logged, and an empty array is returned to prevent app crashes.

