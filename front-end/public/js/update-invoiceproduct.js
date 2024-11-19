// Reference: how to update an item(s) for an entity table:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateInvoiceForm = document.getElementById('update-invoiceproduct-form');

// Modify the objects we need
updateInvoiceForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateIPID = document.getElementById('update-IPID')
    let updateinvoiceID = document.getElementById('update-invoiceID')
    let updateproductID = document.getElementById('update-productID')
    // let updateFirstName = document.getElementById('update-firstName')
    // let updateLastName = document.getElementById('update-lastName')
    // let updatePhone = document.getElementById('update-phone')

    // Get the values from the form fields
    let IPIDValue = updateIPID.value
    let invoiceIDValue = updateinvoiceID.value
    let productIDValue = updateproductID.value
    // let lastNameValue = updateLastName.value
    // let phoneValue = updatePhone.value
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(homeworldValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        invoiceProductID: IPIDValue,
        invoiceID: invoiceIDValue,
        productID: productIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-invoiceproduct", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, IPIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


function updateRow(data, invoiceProductID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("invoiceproduct-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == invoiceProductID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            td1.innerHTML = parsedData[0].invoiceID; 

            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            td2.innerHTML = parsedData[0].productID; 


            // let td4 = updateRowIndex.getElementsByTagName("td")[4];
            // td4.innerHTML = parsedData[0].phone; 

            break;
       }
    }
    alert("UPDATE SUCCESSFUL")
    location.reload()
}