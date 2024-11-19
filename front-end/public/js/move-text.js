function moveText(data, destinations) {
    // show form
    let form = document.getElementsByClassName('updateForm');
    // console.log(form)

    if (form[0].style.display === "none") {
        form[0].style.display = "block";
    }
    // Conditional to toggle on/off the edit button
    else {
        form[0].style.display = "none"
    }

    // Populate form
    for (let i = 0; i < data.length; i++) {
           
            document.getElementById(destinations[i]).value = data[i];
            // console.log(data[i])
            console.log(data[i])
            console.log(destinations[i].value)
    }

};