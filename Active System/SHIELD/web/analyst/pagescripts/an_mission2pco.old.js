var excerptList;
var searchMarker = [];
var entity = [{"id": 1, "name": "Intelligence", "excerpt": [{"id": 1, "text": "Fast internet connection", "entityEnabled": true, "area": {"lat": 6.766268699999999, "lng": 125.32842690000007}}, {"id": 2, "text": "Public library is open 24 hours", "entityEnabled": true, "area": {"lat": 6.7431794, "lng": 125.35808559999998}}], "type": null},
    {"id": 2, "name": "Propaganda", "excerpt": [{"id": 3, "text": "Flyers against government officials are posted on streets", "entityEnabled": true, "area": {"lat": 6.7417283, "lng": 125.3570052}}, {"id": 4, "text": "Rallies against the government occur often", "entityEnabled": true, "area": {"lat": 6.738792999999999, "lng": 125.35126000000002}}], "type": null},
    {"id": 3, "name": "Command and Control", "excerpt": [{"id": 5, "text": "Some police officers accept bribery", "entityEnabled": true, "area": {"lat": 6.73794160, "lng": 125.36708939}}, {"id": 6, "text": "Forces are not seen as authority", "entityEnabled": false, "area": {"lat": 6.73061119, "lng": 125.37095729}}], "type": null}];

function initialize() { //Change this to take entities
//    buildNav(msonStatus, 2);
    entityCounter = entity.length;
    console.log(entity);
    //set entity array to the mission entity
    initializeMap();
    loadEntity();
    $('#search-field').focus();
}

$(document).ready(function () {
    $("#search-field").keydown(function () {

        if (event.keyCode == 13) {
            $.ajax({
                type: "GET",
                url: "PrimaryExcerptSearch",
                data: {
                    param: $("#search-field").val()
                },
                success: function (responseJson) {
                    excerptList = responseJson;
                    setMarkersOnMap(null, searchMarker);
                    searchMarker = [];
                    if (excerptList.length > 0) {
                        createSearchMarker();
                    }
                    else
                        showAndDismissAlert("danger", "<strong>No Results Found! </strong>");
                }
            });
        }

    });
});

var area = "Davao City";// TDODO Mission area
var mapOptions;
var geocoder;
var map;
var zoom;
var oms;
var infoWindow;
function initializeMap() {
    mapOptions = {
        center: new google.maps.LatLng(7.190708, 125.455341),
        zoom: 18,
        minZoom: null,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };

    map = new google.maps.Map(document.getElementById('mission2pco-area-map'), mapOptions);
    infoWindow = new google.maps.InfoWindow({size: new google.maps.Size(150, 50)});
    geocoder = new google.maps.Geocoder();
    geocodeString(area);

    oms = new OverlappingMarkerSpiderfier(map,
            {markersWontMove: true, markersWontHide: true});

    oms.addListener('spiderfy', function (markers) {
    });
    oms.addListener('unspiderfy', function (markers) {
    });
}
function geocodeString(string) {
    geocoder.geocode({
        'address': string
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            geocodeSuccess(results[0]);
        } else {
            return null;
        }
    });
}

function geocodeSuccess(result) {
    map.fitBounds(result.geometry.viewport);
    zoom = map.getZoom();
    var allowedBounds = new google.maps.LatLngBounds(result.geometry.viewport.getSouthWest(), result.geometry.viewport.getNorthEast());
    lastValidCenter = map.getCenter();

    google.maps.event.addListener(map, 'center_changed', function () {
        if (allowedBounds.contains(map.getCenter())) {
            //still within valid bounds, so save the last valid position
            lastValidCenter = map.getCenter();
            return;
        }

        //not valid anymore => return to last valid position
        map.panTo(lastValidCenter);
    });
    //map.minZoom = zoom; -- TODO uncomment
    google.maps.event.addListener(map, 'zoom_changed', function () {

        if (map.getZoom() === zoom) {
            map.panTo(mapOptions.center);
            map.setOptions({draggable: false});

        } else {
            map.setOptions({draggable: true});
        }
    });
}
//For Tooltip of Edit and Delete Entity
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//Load Markers based on search

function createSearchMarker() {
    console.log(excerptList);
    var greenPin = "5BB85D";
    var bluePin = "5BC0DE";
    var orangePin = "EFAD4D";
    var redPin = "D9544F";
    var grayPin = "CFCFCF";

    var marker;
    var icon;
    var ids;
    for (var x = 0; x < excerptList.length; x++) {
        var pos = new google.maps.LatLng(excerptList[x].area.lat, excerptList[x].area.lng);
        var text = excerptList[x].text;
        ids = excerptList[x].id;

        switch (excerptList[x].strength) {
            case 100:
                icon = setMarkerColor(greenPin);
                break;
            case 80:
                icon = setMarkerColor(bluePin);
                break;
            case 70:
                icon = setMarkerColor(orangePin);
                break;
            case 50:
                icon = setMarkerColor(redPin);
                break;
            case 30:
                icon = setMarkerColor(grayPin);
                break;
        }

        marker = new google.maps.Marker({
            position: pos,
            map: map,
            id: ids,
            icon: icon
        });
        setWindowListener(marker, "Excerpt " + excerptList[x].id + ": " + excerptList[x].text);
        oms.addMarker(marker);
        searchMarker.push(marker);
    }

}
//Create Entity Function
var entityCounter;
var selectedEntity;
function createEntity() {
    var modal = $('#entityModal');
    document.getElementById("entityModalLabel").innerHTML = "Create Entity";
    document.getElementById("entity-name").value = document.getElementById("search-field").value;

    //create table for each strength
    var table5 = document.getElementById("table5");
    var table4 = document.getElementById("table4");
    var table3 = document.getElementById("table3");
    var table2 = document.getElementById("table2");
    var table1 = document.getElementById("table1");

    $(table5).find("tr:gt(0)").remove();
    $(table4).find("tr:gt(0)").remove();
    $(table3).find("tr:gt(0)").remove();
    $(table2).find("tr:gt(0)").remove();
    $(table1).find("tr:gt(0)").remove();

    $('#enable5').bootstrapToggle('off');
    $('#enable4').bootstrapToggle('off');
    $('#enable3').bootstrapToggle('off');
    $('#enable2').bootstrapToggle('off');
    $('#enable1').bootstrapToggle('off');

    for (var x = 0; x < excerptList.length; x++) {
        var tr, td1, td2, checkbox;
        switch (excerptList[x].strength) {

            case 100:
                //create TR
                tr = document.createElement("tr");
                //create TD
                td1 = document.createElement("td");
                td2 = document.createElement("td");
                //add content to TD
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "excerptEnabled" + excerptList[x].id;
                checkbox.className = "checkbox5";
                td1.appendChild(checkbox);
                td1.style.paddingRight = "10px";
                td2.innerHTML = "<b>Excerpt " + excerptList[x].id + "</b>: " + excerptList[x].text;
                td2.style.textAlign = "justify";
                //add TR to table
                tr.appendChild(td1);
                tr.appendChild(td2);
                table5.appendChild(tr);
                break;

            case 80:
                //create TR
                tr = document.createElement("tr");
                //create TD
                td1 = document.createElement("td");
                td2 = document.createElement("td");
                //add content to TD
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "excerptEnabled" + excerptList[x].id;
                checkbox.className = "checkbox4";
                td1.appendChild(checkbox);
                td1.style.paddingRight = "10px";
                td1.style.width = "5%";
                td2.innerHTML = "<b>Excerpt " + excerptList[x].id + "</b>: " + excerptList[x].text;
                td2.style.textAlign = "justify";
                td1.style.width = "95%";
                //add TR to table
                tr.appendChild(td1);
                tr.appendChild(td2);
                table4.appendChild(tr);
                break;

            case 70:
                //create TR
                tr = document.createElement("tr");
                //create TD
                td1 = document.createElement("td");
                td2 = document.createElement("td");
                //add content to TD
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "excerptEnabled" + excerptList[x].id;
                checkbox.className = "checkbox3";
                td1.appendChild(checkbox);
                td1.style.paddingRight = "10px";
                td2.innerHTML = "<b>Excerpt " + excerptList[x].id + "</b>: " + excerptList[x].text;
                td2.style.textAlign = "justify";
                //add TR to table
                tr.appendChild(td1);
                tr.appendChild(td2);
                table3.appendChild(tr);
                break;

            case 50:
                //create TR
                tr = document.createElement("tr");
                //create TD
                td1 = document.createElement("td");
                td2 = document.createElement("td");
                //add content to TD
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "excerptEnabled" + excerptList[x].id;
                checkbox.className = "checkbox2";
                td1.appendChild(checkbox);
                td1.style.paddingRight = "10px";
                td2.innerHTML = "<b>Excerpt " + excerptList[x].id + "</b>: " + excerptList[x].text;
                td2.style.textAlign = "justify";
                //add TR to table
                tr.appendChild(td1);
                tr.appendChild(td2);
                table2.appendChild(tr);
                break;

            case 30:
                //create TR
                tr = document.createElement("tr");
                //create TD
                td1 = document.createElement("td");
                td2 = document.createElement("td");
                //add content to TD
                checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "excerptEnabled" + excerptList[x].id;
                checkbox.className = "checkbox1";
                td1.appendChild(checkbox);
                td1.style.paddingRight = "10px";
                td2.innerHTML = "<b>Excerpt " + excerptList[x].id + "</b>: " + excerptList[x].text;
                td2.style.textAlign = "justify";
                //add TR to table
                tr.appendChild(td1);
                tr.appendChild(td2);
                table1.appendChild(tr);
                break;
        }

    }

    //show table for strength that has strength
    for (var x = 1; x < 6; x++) {
        var table = document.getElementById("table" + x);
        if (table.rows.length < 2)
            table.style.display = "none";
    }

    modal.modal('show');
}

function deleteEntity() {
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].marker.id == selectedEntity.id) {
            setEntityMarkerOnMap(null, entity[x].marker.entityMarker);
            setMarkersOnMap(null, entity[x].marker.excerptMarker);
            entity.splice(x, 1);
        }
    }
}

function saveEntity() {
    var entityObject;
    var entityName = document.getElementById("entity-name").value;
    var entityExcerpt = checkEnabled();
    var entityMarkerTemp = createEntityMarker(getEntityCenter(entityExcerpt));
    setEntityWindowListener(entityMarkerTemp, "<b>" + entityName + "</b><br>", entityExcerpt);
    var entityExcerptMarkerTemp = createEntityExcerptMarker(entityExcerpt);
    setEntityAppearListener(entityMarkerTemp, entityExcerptMarkerTemp);
    var entityMarker = {id: entityCounter, entityMarker: entityMarkerTemp, excerptMarker: entityExcerptMarkerTemp};
    entityObject = {id: entityCounter, name: entityName, excerpt: entityExcerpt, marker: entityMarker};

    entity.push(entityObject);
    entityCounter++;
    //hide all search markers
    setMarkersOnMap(null, searchMarker);
    var modal = $('#entityModal');
    modal.modal('hide');
}

//Load existing entities
function loadEntity() {
    console.log(entity);
    for (var x = 0; x < entity.length; x++) {
        var entityExcerpt = [];
        for (var y = 0; y < entity[x].excerpt.length; y++) {
            if (entity[x].excerpt[y].entityEnabled == true) {
                entityExcerpt.push(entity[x].excerpt[y]);
            }
        }
        console.log(entityExcerpt);
        var entityMarkerTemp = createEntityMarker(getEntityCenter(entityExcerpt));
        console.log(entityMarkerTemp);
        setEntityWindowListener(entityMarkerTemp, "<b>" + entity[x].name + "</b><br>", entityExcerpt);
        var entityExcerptMarkerTemp = createEntityExcerptMarker(entityExcerpt);
        setEntityAppearListener(entityMarkerTemp, entityExcerptMarkerTemp);
    }
}

function checkEnabled() {
    var entityExcerpt = [];
    for (var x = 0; x < excerptList.length; x++) {
        if ($('#excerptEnabled' + excerptList[x].id).prop('checked') == true) {
            excerptList[x].entityEnabled = true;
        }
        entityExcerpt.push(excerptList[x]);
    }
    return entityExcerpt;
}

function getEntityCenter(entityExcerpt) {
    var bounds = new google.maps.LatLngBounds();
    for (var x = 0; x < entityExcerpt.length; x++) {
        if (entityExcerpt[x].entityEnabled == true) {
            bounds.extend(new google.maps.LatLng(entityExcerpt[x].area.lat, entityExcerpt[x].area.lng));
        }
    }
    var center = bounds.getCenter();
    return center;
}

function createEntityMarker(latlng) {
    var icon = "http://maps.google.com/mapfiles/kml/shapes/target.png";
    var entityMarker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: icon,
        id: entityCounter
    });
    oms.addMarker(entityMarker);
    return entityMarker;
}
function createEntityExcerptMarker(entityExcerpt) {
    var icon = "http://maps.google.com/mapfiles/kml/pal4/icon57.png";
    var entityExcerptMarker = [];
    for (var x = 0; x < entityExcerpt.length; x++) {
        if (entityExcerpt[x].entityEnabled == true) {
            var pos = new google.maps.LatLng(entityExcerpt[x].area.lat, entityExcerpt[x].area.lng);
            var excerptMarker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: icon
            });
            setWindowListener(excerptMarker, "Excerpt " + entityExcerpt[x].id + ": " + entityExcerpt[x].text);
            oms.addMarker(excerptMarker);
            entityExcerptMarker.push(excerptMarker);
        }

    }
    return entityExcerptMarker;
}

function setMarkersOnMap(map, excerptMarker) {

    for (var x = 0; x < excerptMarker.length; x++) {
        excerptMarker[x].setMap(map);
    }
}

function setEntityMarkerOnMap(map, entityMarker) {
    entityMarker.setMap(map);
}

function setEntityAppearListener(entityMarker, entityExcerpt) {
    var hits = 0;
    google.maps.event.addListener(entityMarker, 'dblclick', function (event) {
        if (hits % 2 !== 0) {
            setMarkersOnMap(map, entityExcerpt);
            hits++;
        }
        else {
            setMarkersOnMap(null, entityExcerpt);
            hits++;
        }
    });
    google.maps.event.addListener(entityMarker, 'rightclick', function (event) {
        selectedEntity = entityMarker;

    });
}

function setWindowListener(marker, text) {
    google.maps.event.addListener(marker, 'mouseover', function () {
        infoWindow.setContent(text);
        infoWindow.open(map, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
        infoWindow.setContent(text);
        infoWindow.close(map, this);
    });
}

function setEntityWindowListener(marker, text, excerptList) {
    var excerptText = " Excerpts included: <br>";
    for (var x = 0; x < excerptList.length; x++) {
        if (excerptList[x].entityEnabled == true) {
            excerptText += "Excerpt " + excerptList[x].id + "<br>";
        }
    }
    google.maps.event.addListener(marker, 'mouseover', function () {
        infoWindow.setContent("<p>" + text + excerptText + "</p>");
        infoWindow.open(map, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
        infoWindow.setContent(text);
        infoWindow.close(map, this);
    });
}

function setMarkerColor(color) {
    var iconColor = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
    return iconColor;
}

// define a lookup for what text should be displayed for each value in your range
var rangeValues =
        {
            "1": "Very Weak Relevance",
            "2": "Weak Relevance",
            "3": "Moderate Relevance",
            "4": "Strong Relevance",
            "5": "Very Strong Relevance"
        };
$(function () {
    // setup an event handler to set the text when the range value is dragged (see event for input) or changed (see event for change)
    $('#rangeInput').change(function () {
        $('#rangeText').text(rangeValues[$('#rangeInput').val()]);

        switch ($('#rangeInput').val()) {
            case '1':
                $('#enable5').bootstrapToggle('off');
                $('#enable4').bootstrapToggle('off');
                $('#enable3').bootstrapToggle('off');
                $('#enable2').bootstrapToggle('off');
                $('#enable1').bootstrapToggle('off');

                $('#enable5').bootstrapToggle('on');
                $('#enable4').bootstrapToggle('on');
                $('#enable3').bootstrapToggle('on');
                $('#enable2').bootstrapToggle('on');
                $('#enable1').bootstrapToggle('on');
                break;
            case '2':
                $('#enable5').bootstrapToggle('off');
                $('#enable4').bootstrapToggle('off');
                $('#enable3').bootstrapToggle('off');
                $('#enable2').bootstrapToggle('off');
                $('#enable1').bootstrapToggle('off');

                $('#enable5').bootstrapToggle('on');
                $('#enable4').bootstrapToggle('on');
                $('#enable3').bootstrapToggle('on');
                $('#enable2').bootstrapToggle('on');
                break;
            case '3':
                $('#enable5').bootstrapToggle('off');
                $('#enable4').bootstrapToggle('off');
                $('#enable3').bootstrapToggle('off');
                $('#enable2').bootstrapToggle('off');
                $('#enable1').bootstrapToggle('off');

                $('#enable5').bootstrapToggle('on');
                $('#enable4').bootstrapToggle('on');
                $('#enable3').bootstrapToggle('on');
                break;
            case '4':
                $('#enable5').bootstrapToggle('off');
                $('#enable4').bootstrapToggle('off');
                $('#enable3').bootstrapToggle('off');
                $('#enable2').bootstrapToggle('off');
                $('#enable1').bootstrapToggle('off');

                $('#enable5').bootstrapToggle('on');
                $('#enable4').bootstrapToggle('on');
                break;
            case '5':
                $('#enable5').bootstrapToggle('off');
                $('#enable4').bootstrapToggle('off');
                $('#enable3').bootstrapToggle('off');
                $('#enable2').bootstrapToggle('off');
                $('#enable1').bootstrapToggle('off');

                $('#enable5').bootstrapToggle('on');
                break;
        }
    });

});

$(function () {
    $('#enable5').change(function () {
        if ($(this).prop('checked') == true) {
            $('.checkbox5').prop("checked", true);
        }
        else {
            $('.checkbox5').prop("checked", false);
        }
    });
    $('#enable4').change(function () {
        if ($(this).prop('checked') == true) {
            $('.checkbox4').prop("checked", true);
        }
        else {
            $('.checkbox4').prop("checked", false);
        }
    });
    $('#enable3').change(function () {
        if ($(this).prop('checked') == true) {
            $('.checkbox3').prop("checked", true);
        }
        else {
            $('.checkbox3').prop("checked", false);
        }
    });
    $('#enable2').change(function () {
        if ($(this).prop('checked') == true) {
            $('.checkbox2').prop("checked", true);
        }
        else {
            $('.checkbox2').prop("checked", false);
        }
    });
    $('#enable1').change(function () {
        if ($(this).prop('checked') == true) {
            $('.checkbox1').prop("checked", true);
        }
        else {
            $('.checkbox1').prop("checked", false);
        }
    });
});

function savePCO() {


}