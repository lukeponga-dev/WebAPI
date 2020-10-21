// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
const uri = "/api/Vehicles"; //the api as a global variable
// alert("API " + uri);
let allVehicles = null; //holds the data in a global

//Loads up the <p id="counter"> </p> with a count of the staff, data come from the LoadTable Function where this is called
function getCount(data) {
    // alert("getcount " + data);

    const theCount = $("#counter"); //bind TheCount to the counter

    if (data) { //if any data exists
        // alert("We have data " + data);
        theCount.text(`There are ${data} Vehicles`);
    } else {
        theCount.text("There are no Vehicles");
        alert("No data");
    }
}

//this function reloads the table of staff after any changes
function LoadTable() {
    $.ajax({
        type: "GET", //use the GET controller
        url: uri, //the uri from the global
        cache: false, //don't cache the data in browser reloads, get a fresh copy
        success: function (data) { //if the request succeeds ....
            const tBody = $("#allVehicles"); //for the tbody bind with allstaff <tbody id = "allVehicles" ></tbody >
            allVehicles = data; //pass in all the data to the global allstaff use it in Edit
            $(tBody).empty(); //empty out old data

            getCount(data.length); //count for the counter function

            //a foreach through the rows creating table data
            $.each(data,
                function (key, item) {
                    const tr = $("<tr></tr>")
                        .append($("<td></td>").text(item.reg)) //inserts content in the tags
                        .append($("<td></td>").text(item.make))
                        .append($("<td></td>").text(item.model))
                        .append($("<td></td>").text(item.colour))
                        .append($("<td></td>").text(item.year))
                        .append($("<td></td>")
                            .append($("<a href='#editVehicleModal' class='edit' data-toggle='modal'>Edit</a>")
                                .on("click",
                                    function () {
                                        editItem(item.id);
                                    }) //in the empty cell append in an edititem button
                            )
                        )
                        .append(
                            $("<td></td>").append(
                                $("<a href='#deleteItem' class='delete'> <i class='material - icons'>&#xE15C;</i><span>Delete</span></a>").on("click",
                                    function () {
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
        year: parseInt($("#add-year").val())
    };

    $.ajax({
        type: "POST",
        url: uri,
        data: JSON.stringify(item),
        contentType: "application/json; charset=utf-8",
        //if it is successful
        success: function (result) {
            $("#result").html("Vehicle Added");
            LoadTable();
            $("#add-reg").val(""); //clear entry boxes
            $("#add-make").val("");
            $("#add-model").val("");
            $("#add-colour").val("");
            $("#add-year").val();
            //alert("Staff added successfully");
            //console.log(result)
        },
        //if there is an error
        error: function (jqXHR, textStatus, errorThrown) {
            //alert("Something went wrong!");
            $("#result").html("Failed.");
        }
    });
}

//Delete a person from the database
function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id, //add the ID to the end of the URI
        type: "DELETE", //this calls the DELETE in the API controller
        success: function (result) {
            LoadTable();
        }
    });
}

//click event for edit button to load details into form. Go through each entry held in  allVehicles and add in the one that matches the id from the click
function editItem(id) {
    $.each(allVehicles,
        function (key, item) {
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
    function () {
        const item = { //pass all the data on the form to a variable called item use laterto send to server
            reg: $("#edit-reg").val(),
            make: $("#edit-make").val(),
            model: $("#edit-model").val(),
            colour: $("#edit-colour").val(),
            year: parseInt($("#edit-year").val()),
            id: parseInt($("#edit-id").val())
        };

        //alert(`Saving ... ${item.id} ${item.reg}`);
        $.ajax({
            type: "PUT", //send it to the PUT controller
            url: uri + "/" + $("#edit-id").val(), //add the row id to the uri
            data: JSON.stringify(item), //take the item data and pass it to the serever data is moved to server
            contentType: "application/json",
            success: function (result) {
                $("#resultUpdate").html("Successfully Edited " + item.reg + " " + item.make);
                LoadTable(); //load the table afresh
            },
            //if Failed
            error: function (jqXHR, textStatus) {
                $("#resultUpdate").html("Failed to edit");
            }
        });
        return false;
    });
$(document).ready(function () {
    // Activate tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Filter table rows based on searched term
    $("#search").on("keyup", function () {
        var term = $(this).val().toLowerCase();
        $("table tbody tr").each(function () {
            $row = $(this);
            var reg = $row.find("td:nth-child(1)").text().toLowerCase();
            console.log(reg);
            if (reg.search(term) < 0) {
                $row.hide();
            } else {
                $row.show();
            }
        });
    });
});