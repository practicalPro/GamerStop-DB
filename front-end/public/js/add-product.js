// Get the objects we need to modify
let addProductForm = document.getElementById('add-product');

// Modify the objects we need
addProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let customerID = document.getElementById('input-customerid')
    let inputDate = document.getElementById("input-date");
    let inputPrice = document.getElementById("input-price");


    // Get the values from the form fields
    let customerIDValue = customerID.value;
    let dateValue = inputFirstName.value;
    let priceValue = inputLastName.value;


    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        date: dateValue,
        price: priceValue,

    }
    
    // Setup our AJAX request
    
})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("invoice-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let customerIDCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let priceCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.invoiceID;
    customerIDCell.innerText = newRow.customerID;
    dateCell.innerText = newRow.orderDate;
    priceCell.innerText = newRow.totalPrice;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(customerIDCell);
    row.appendChild(dateCell);
    row.appendChild(priceCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}