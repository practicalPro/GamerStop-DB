// how to delete en entity referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
// Added a section to provide a confirmation window on deleting item: referenced from: https://stackoverflow.com/questions/9139075/how-to-show-a-confirm-message-before-delete
function deleteConsole(consoleID) {
    // 
    let result = confirm("Are you sure you want to delete this")
    if (result) {
      let data = {
          id: consoleID
      }
    

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-console", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(consoleID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}
};

function deleteRow(consoleID) {
  let table = document.getElementById("console-table");
  for (let i = 0, row; (row = table.rows[i]); i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    console.log(table.rows[i]);
    if (table.rows[i].getAttribute("data-value") == consoleID) {
      table.deleteRow(i);
      return "/delete-console";
    }
  }
  location.reload();
}
