// Get the objects we need to modify
let addProductForm = document.getElementById('add-invoiceproduct');

// Modify the objects we need
addProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let invoiceID = document.getElementById('input-invoiceID')
    let productID = document.getElementById("input-productID");


    // Get the values from the form fields
    let invoiceIDValue = invoiceID.value;
    let productIDValue = productID.value;



    // Put our data we want to send in a javascript object
    let data = {
        invoiceID: invoiceIDValue,
        productID: productIDValue,
    }
    
    // Setup our AJAX request
    
})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("invoiceproduct-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let invoiceIDCell = document.createElement("TD");
    let productIDCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.invoiceID;
    invoiceIDCell.innerText = newRow.invoiceID;
    productIDCell.innerText = newRow.productID;


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(invoiceIDCell);
    row.appendChild(productIDCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}