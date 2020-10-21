// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
const uri = "/api/StaffNamesAPI"; //the api as a global variable
// alert("API " + uri);
let allStaff = null; //holds the data in a global

//Loads up the <p id="counter"> </p> with a count of the staff, data come from the LoadTable Function where this is called
function getCount(data) {
    // alert("getcount " + datas);
    const theCount = $("#counter"); //bind TheCount to the counter
    if (data) { //if any data exists
        // alert("We have data " + data);
        theCount.text(`There are ${data} Staff`);
    } else {
        theCount.text("There are no Staff");
        alert("No data");
    }
}

//this function reloads the table of staff after any changes
function LoadTable() {
    $.ajax({
        type: "GET", //use the GET controller
        url: uri, //the uri from the global
        cache: false, //don't cache the data in browser reloads, get a fresh copy
        success: function(data) { //if the request succeeds ....
            const tBody = $("#allStaff"); //for the tbody bind with allstaff <tbodyid = "allStaff" ></tbody >
            allStaff = data; //pass in all the data to the global allstaff use it in Edit
            $(tBody).empty(); //empty out old data

            getCount(data.length); //count for the counter function

            //a foreach through the rows creating table data
            $.each(data,
                function(key, item) {
                    const tr = $("<tr></tr>")
                        .append($("<td></td>").text(item.reg)) //inserts content in the tags
                        .append($("<td></td>").text(item.make))
                        .append($("<td></td>").text(item.model))
                        .append($("<td></td>").text(item.colour))
                        .append($("<td></td>").text(item.year))
                        .append($("<td></td>")
                            .append($("<button>Edit</button>")
                                .on("click",
                                    function() {
                                        editItem(item.id);
                                    }) //in the empty cell append in an edititem button
                            )
                        )
                        .append(
                            $("<td></td>").append(
                                $("<button>Delete</button>").on("click",
                                    function() {
                                        deleteItem(item.id);
                                    }) //in an empty cell add in a deleteitem button
                            )
                        );
                    tr.appendTo(tBody); //add all the rows to the tbody
                });
        }
    });
}

//Add an person to the database
function addItem() {
    const item = {
        reg: $("#add-reg").val(),
        make: $("#add-make").val(),
        model: $("#add-model").val(),
        colour: $("#add-colour").val(),
        year: $("#add-year").val()
    };

    $.ajax({
        type: "POST", //this calls the POST in the API controller
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        //if there is an error
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        //if it is successful
        success: function(result) {
            LoadTable();
            $("#add-reg").val(""); //clear entry boxes
            $("#add-make").val("");
            $("#add-model").val("");
            $("#add-colour").val("");
            $("#add-year").val("");
            alert("Staff added successfully");
        }
    });
}

//Delete a person from the database
function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id, //add the ID to the end of the URI
        type: "DELETE", //this calls the DELETE in the API controller
        success: function(result) {
            LoadTable();
        }
    });
}

//click event for edit button to load details into form. Go through each entry held in  allStaff and add in the one that matches the id from the click
function editItem(id) {
    $.each(allStaff,
        function(key, item) {
            if (item.id === id) { //where the ID == the one on the click
                $("#edit-reg").val(item.reg); //add it to the form field
                $("#edit-id").val(item.id);
                $("#edit-make").val(item.make);
                $("#edit-model").val(item.model);
                $("#edit-colour").val(item.colour);
                $("#edit-year").val(item.year);;
            }
        });
}

$(".my-form").on("submit", //saving the edit to the db
    function() {
        const item = { //pass all the data on the form to a variable called item use laterto send to server
            reg: $("#edit-reg").val(),
            make: $("#edit-make").val(),
            model: $("#edit-model").val(),
            colour: $("#edit-colour").val(),
            year: $("#edit-year").val(),
            id: $("#edit-id").val()
        };
        alert(`Saving ... ${item.id} ${item.reg}`);
        $.ajax({
            url: uri + "/" + $("#edit-id").val(), //add the row id to the uri
            type: "PUT", //send it to the PUT controller
            accepts: "application/json",
            contentType: "application/json",
            data: JSON.stringify(item), //take the item data and pass it to the serever data is moved to server
            success: function(result) {
                LoadTable(); //load the table afresh
            }
        });
        return false;
    });