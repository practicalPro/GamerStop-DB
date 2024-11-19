const { json } = require("express");

let addConsoleForm = document.getElementById('add-console')

addConsoleForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let inputName = document.getElementById('input-name')
    let inputManufacturer = document.getElementById('input-manufacturer')
    let inputReleaseDate = document.getElementById('input-releasedate')
    let inputDescription = document.getElementById('input-description')

    let nameValue = inputName.value
    let manufacturerValue = inputManufacturer.value
    let releaseDateValue = inputReleaseDate.value
    let descriptionValue = inputDescription.value

    let data = {
        name:   nameValue,
        manufacturer: manufacturerValue,
        releasedate: releaseDateValue,
        description: descriptionValue
    }

})

addRowToTable = function(data) {
    let currentTable = document.getElementById('customer-table')
    let newRowIndex = currentTable.rows.length
    
    let parsedData = json.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement('TR')
    let idCell = document.createElement('TD')
    let nameCell = document.createElement('TD')
    let manufacturerCell = document.createElement('TD')
    let releaseDateCell = document.createElement('TD')
    let descriptionCell = document.createElement('TD')

    idCell.innerText = newRow.consoleID
    nameCell.innerText = newRow.name
    manufacturerCell.innerText = newRow.manufacturer
    releaseDateCell.innerText = newRow.releaseDate
    descriptionCell.innerText = newRow.description

    row.appendChild(idCell)
    row.appendChild(nameCell)
    row.appendChild(manufacturerCell)
    row.appendChild(releaseDateCell)
    row.appendChild(descriptionCell)

    // Add the row to the table
    currentTable.appendChild(row);
}