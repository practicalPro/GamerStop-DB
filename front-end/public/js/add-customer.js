let addCustomer = document.getElementById('add-customer');

addCustomer.addEventListener('submit', function(event) {
    
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputEmail = document.getElementById('input-email')
    let inputFirstName = document.getElementById('input-firstname')
    let inputLastName = document.getElementById('input-lastname')
    let inputPhone = document.getElementById('input-phone')
    let errorMsg = document.getElementById('error-msg')

   // get the values that were submitted 
    let emailValue = inputEmail.value
    let firstNameValue = inputFirstName.value
    let lastNameValue = inputLastName.value
    let phoneValue = inputPhone.value

    // put our data we want to send in a JS object

    let data = {
        email:  emailValue,
        firstName:  firstNameValue,
        lastName:   lastNameValue,
        phone:  phoneValue
    }
    
  
    // Creates a single row from an object representing a single record from Customers
    addRowToTable = (data) => {
        // Get a reference to the current table on the page and clear it out
        let currentTable = document.getElementById('customer-table')
        
        // Get the location where we should insert the new row (end of the table)
        let newRowIndex = currentTable.ariaRowSpan.length;

        // Get a reference to the new row from the DB query (last object)
        let parsedData = JSON.parse(data);
        let newRow = parsedData[parsedData.length - 1]

        // Create a row and 4 cells
        let row = document.createElement("TR");
        let idCell = document.createElement("TD");
        let emailCell = document.createElement("TD");
        let firstNameCell = document.createElement("TD");
        let lastNameCell = document.createElement("TD");
        let phoneCell = document.createElement("TD");

        // Fill the cells with the correct data
        idCell.innerText = newRow.customerID;
        emailCell.innerText = newRow.email;
        firstNameCell.innertext = newRow.firstName;
        lastNameCell.innertext = newRow.lastName;
        phoneCell.innertext = newRow.phone;

        
        row.appendChild(idCell);
        row.appendChild(emailCell);
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(phoneCell);
        
        
    }
        // Add the row to the table
        currentTable.appendChild(row);
})