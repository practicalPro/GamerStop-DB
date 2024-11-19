// how to delete en entity referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
// Added a section to provide a confirmation window on deleting item: referenced from: https://stackoverflow.com/questions/9139075/how-to-show-a-confirm-message-before-delete
function deleteVideoGame(videogameID) {
    let result = confirm("Are you sure you want to delete this")
    if (result) {
      let data = {
          id: videogameID
    }
// Setup our AJAX request
var xhttp = new XMLHttpRequest();
xhttp.open("DELETE", "/delete-videogame", true);
xhttp.setRequestHeader("Content-type", "application/json");

// Tell our AJAX request how to resolve
xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {

        // Add the new data to the table
        deleteRow(videogameID);

    }
    else if (xhttp.readyState == 4 && xhttp.status != 204) {
        console.log("There was an error with the input.")
    }
}
// Send the request and wait for the response
xhttp.send(JSON.stringify(data));
}

function deleteRow(videogameID) {
    let table = document.getElementById('videogame-table')
    for (let i = 0, row; (row = table[i]); i++) {
        console.log(table.row[i])
        if (table.row[i].getAttribute("data-value") == videogameID) {
            table.deleteRow(i)
            return "/delete-videogame"
        }
    }
    location.reload();
}
}