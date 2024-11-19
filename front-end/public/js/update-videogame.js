// Reference: how to update an item(s) for an entity table:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateVideoGameForm = document.getElementById('update-videogame-form');

// Modify the objects we need
updateVideoGameForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateID = document.getElementById('update-ID')
    let updateTitle = document.getElementById('update-title')
    let updateGenre = document.getElementById('update-genre')
    let updateReleaseDate = document.getElementById('update-releaseDate')
    let updateDescription = document.getElementById('update-description')

    // Get the values from the form fields
    let IDValue = updateID.value;
    let titleValue = updateTitle.value
    let genreValue = updateGenre.value
    let releaseDateValue = updateReleaseDate.value
    console.log(releaseDateValue)
    let descriptionValue = updateDescription.value
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(homeworldValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        videogameID: IDValue,
        title: titleValue ,
        genre: genreValue,
        releaseDate: releaseDateValue,
        description: descriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-videogame", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, IDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


function updateRow(data, videogameID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("videogame-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == videogameID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            td1.innerHTML = parsedData[0].title; 

            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            td2.innerHTML = parsedData[0].genre; 

            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            td3.innerHTML = parsedData[0].releaseDate; 

            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            td4.innerHTML = parsedData[0].description; 

            break;
       }
       
    }
    alert("UPDATE SUCCESSFUL")
    location.reload()
}

