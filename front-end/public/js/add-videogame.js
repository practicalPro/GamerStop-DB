const { json } = require("express");

let addVideoGameForm = document.getElementById('videogame-table')

addVideoGameForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let inputTitle = document.getElementById('input-title');
    let inputGenre = document.getElementById('input-genre');
    let inputReleaseDate = document.getElementById('input-releasedate');
    let inputDescription = document.getElementById('input-description')

    let titleValue = inputTitle.value
    let genreValue = inputGenre.value
    let releaseDatevalue = inputReleaseDate.value
    let descriptionValue = inputDescription.value
    console.log(releaseDatevalue)

    let data = {
        title:  titleValue,
        genre:  genreValue,
        releaseDate: releaseDatevalue,
        description: descriptionValue
    }
})


addRowToTable = (data) => {
    let currentTable = document.getElementById('videogame-table')

    let newRowIndex = currentTable.rows.length

    let parsedData = json.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    let row = document.createElement('TR');
    let videoGameCell = document.createElement('TD')
    let titleCell = document.createElement('TD')
    let genreCell = document.createElement('TD')
    let dateCell = document.createElement('TD')
    let descriptionCell = document.createElement('TD')

    videoGameCell.innerText = newRow.id
    titleCell.innerText = newRow.title
    genreCell.innerText = newRow.genre
    dateCell.innertext = newRow.releaseDate
    descriptionCell.innertext = newRow.description

    row.appendChild(videoGameCell)
    row.appendChild(titleCell)
    row.appendChild(genreCell)
    row.appendChild(dateCell)
    row.appendChild(descriptionCell)

    // Add the row to the table
    currentTable.appendChild(row);

}