var excerptList;
var searchMarker = [];
var entity = [];
var entityCounter = 0;
var usedKeywords = [], unusedKeywords = [];
var selectedMarker = [];
var mapOptions;
var geocoder;
var map;
var zoom;
var oms;
var infoWindow;
var mc;
var minClusterZoom = 19;
var filterLevel;
var filterArea;
var filterStrength;
var duplicateCOGs = [];

var hiddenMap, hiddenMapOptions, hiddenMarkers = [], omsHidden;

$(document).ready(function () {
    validateLogin();
    $.ajax({
        type: "GET",
        url: "GetEEntityOfMission",
        data: {
            missionID: missionID

        },
        success: function (responseJSON) {
            entity = responseJSON;
            console.log(entity);
            initialize();
        }
    });

    if (keywordList != null) {
        unusedKeywords = keywordList;
        for (var x = 0; x < unusedKeywords.length; x++) {
            $('#unused-keyword').tagsinput('add', unusedKeywords[x]);
        }
    }

    $('#search-field').autocomplete({
        minChars: 0,
        lookup: keywordList,
        onSelect: function (suggestion) {
            displayKeywords(suggestion.value);
            $.ajax({
                type: "GET",
                url: "PrimaryExcerptSearch",
                data: {
                    param: suggestion.value,
                },
                success: function (responseJson) {
                    excerptList = responseJson;
                    mc.clearMarkers();
                    setMarkersOnMap(null, searchMarker);
                    searchMarker = [];
                    if (excerptList.length > 0) {
                        createSearchMarker();
                        $('#strengthRangeInput').val(1);
                        $('#areaRangeInput').val(1);
                        $('#strengthRangeText').text("Relevance Range: All");
                        $('#areaRangeText').text("Search Area Range: Philippines");
                        filterLevel = 1;
                        filterArea = level1;
                        filterStrength = 40;
                        applyFilter();
                    }
                    else
                        showAndDismissAlert("danger", "<strong>No Results Found! </strong>");
                }
            });
        }
    });
    $("#search-field").keydown(function () {

        if (event.keyCode == 13) {
            $.ajax({
                type: "GET",
                url: "PrimaryExcerptSearch",
                data: {
                    param: $("#search-field").val(),
                },
                success: function (responseJson) {
                    excerptList = responseJson;
                    mc.clearMarkers();
                    setMarkersOnMap(null, searchMarker);
                    searchMarker = [];
                    if (excerptList.length > 0) {
                        createSearchMarker();
                        $('#strengthRangeInput').val(1);
                        $('#areaRangeInput').val(1);
                        $('#strengthRangeText').text("Relevance Range: All");
                        $('#areaRangeText').text("Search Area Range: Philippines");
                        filterLevel = 1;
                        filterArea = level1;
                        filterStrength = 40;
                        applyFilter();
                    }
                    else
                        showAndDismissAlert("danger", "<strong>No Results Found! </strong>");
                }
            });
        }

    });

});

function initialize() { //Change this to take entities
    document.getElementById("global-username").innerHTML = userFullName + " ";
    buildNav(missionStatus, 2);
    loadAreaSlider();
    loadStrengthSlider();
    initializeMap();
    initializeHiddenMap();

    if (entity.length == 0) {
        entity = new Array();
        entityCounter = 0;
    }
    if (entity.length > 0) {
        entityCounter = entity.length;
        loadEntity();
        createHiddenMarkers();
        activateRemoveBtn(entity);
    }
    //set entity array to the mission entity
}

function initializeMap() {
    mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 10,
        minZoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };
    var clusterStyles = [
        {
            textColor: 'black',
            url: 'http://www.zudusilatvija.lv/static//images/cluster.png',
            height: 52,
            width: 52
        },
        {
            textColor: 'black',
            url: 'http://www.zudusilatvija.lv/static//images/cluster.png',
            height: 52,
            width: 52
        },
        {
            textColor: 'black',
            url: 'http://www.zudusilatvija.lv/static//images/cluster.png',
            height: 52,
            width: 52
        }
    ];
    var mcOptions = {gridSize: 50, maxZoom: minClusterZoom, zoomOnClick: true, styles: clusterStyles};
    map = new google.maps.Map(document.getElementById('mission2pco-area-map'), mapOptions);
    infoWindow = new google.maps.InfoWindow({size: new google.maps.Size(150, 50), disableAutoPan: true});
    geocoder = new google.maps.Geocoder();
    //geocodeString(area); -- NOt working
    mc = new MarkerClusterer(map, searchMarker, mcOptions);
    oms = new OverlappingMarkerSpiderfier(map,
            {markersWontMove: true, markersWontHide: true, keepSpiderfied: true});
    google.maps.event.addListener(mc, 'clusterclick', function (cluster) {

        if (cluster.getMarkers().length === 2) {
            map.fitBounds(cluster.getBounds()); // Fit the bounds of the cluster clicked on
            if (map.getZoom() > minClusterZoom + 1) // If zoomed in past 15 (first level without clustering), zoom out to 15
                map.setZoom(minClusterZoom + 1);
        }
        setTimeout('openAllClusters()', 1000);
    });
    oms.addListener('spiderfy', function (markers) {
    });
    oms.addListener('unspiderfy', function (markers) {
    });


    google.maps.event.addListener(map, 'zoom_changed', function () {
        setTimeout('openAllClusters()', 1000);
        var northEast = new google.maps.LatLng(19.648699380876213, 126.63329394531274);
        var southWest = new google.maps.LatLng(5.344441440480007, 115.39702050781239);
        var philBounds = new google.maps.LatLngBounds(southWest, northEast);
        if (map.getZoom() === 6) {
            zoomChanged(philBounds);
        }
    });
}

function initializeHiddenMap() {
    hiddenMapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP

    };

    hiddenMap = new google.maps.Map(document.getElementById('hidden-area-map'), hiddenMapOptions);

    omsHidden = new OverlappingMarkerSpiderfier(hiddenMap,
            {markersWontMove: true, markersWontHide: true, keepSpiderfied: true, nearbyDistance: 500});

    omsHidden.addListener('spiderfy', function (markers) {
    });
    omsHidden.addListener('unspiderfy', function (markers) {
    });

    createHiddenMarkers();
}

function createHiddenMarkers() {
    hiddenMarkers = [];
    omsHidden.clearMarkers();
    var p = "P";
    var m = "M";
    var ec = "EC";
    var ep = "EP";
    var inf = "IN";
    var inte = "IT";
    var s = "S";
    var latlngHidden;
    var hiddenMarker;
    var labelString;
    for (var x = 0; x < entity.length; x++) {
        for (var y = 0; y < entity[x].excrList.length; y++) {
            latlngHidden = new google.maps.LatLng(entity[x].excrList[y].area.lat, entity[x].excrList[y].area.lng);
            var category = entity[x].excrList[y].categoryID;
            switch (category) {
                case 1:
                    labelString = p;
                    break;
                case 2:
                    labelString = m;
                    break;
                case 3:
                    labelString = ec;
                    break;
                case 4:
                    labelString = s;
                    break;
                case 5:
                    labelString = inf;
                    break;
                case 6:
                    labelString = inte;
                    break;
                case 7:
                    labelString = ep;
                    break;
            }

            hiddenMarker = new MarkerWithLabel({
                position: latlngHidden,
                map: hiddenMap,
                labelContent: labelString,
                labelAnchor: new google.maps.Point(10, 34),
                labelClass: "labels",
                labelInBackground: false
            });
            hiddenMarker.setMap(hiddenMap);
            omsHidden.addMarker(hiddenMarker);
            hiddenMarkers.push(hiddenMarker);
        }
    }


    setTimeout('openAllHiddenClusters()', 500);
}

function openAllHiddenClusters() {
    var markers = omsHidden.markersNearAnyOtherMarker();

    $.each(markers, function (i, marker) {
        google.maps.event.trigger(markers[i], 'click');
    });
}

function geocodeSuccess(result) {
    map.fitBounds(result.geometry.viewport);
    var northEast = new google.maps.LatLng(19.648699380876213, 126.63329394531274);
    var southWest = new google.maps.LatLng(5.344441440480007, 115.39702050781239);
    var philBounds = new google.maps.LatLngBounds(southWest, northEast);
    google.maps.event.addListener(map, 'zoom_changed', function () {

        if (map.getZoom() === 6) {
            zoomChanged(philBounds);
        }
    });
}

function zoomChanged(philBounds) {
    // Listen for the dragend event
    var northEast = new google.maps.LatLng(19.648699380876213, 126.63329394531274);
    var southWest = new google.maps.LatLng(5.344441440480007, 115.39702050781239);
    philBounds = new google.maps.LatLngBounds(southWest, northEast);
    // Listen for the dragend event
    google.maps.event.addListener(map, 'center_changed', function () {
        if (philBounds.contains(map.getCenter()))
            return;
        // We're out of bounds - Move the map back within the bounds
        var c = map.getCenter(),
                x = c.lng(),
                y = c.lat(),
                maxX = philBounds.getNorthEast().lng(),
                maxY = philBounds.getNorthEast().lat(),
                minX = philBounds.getSouthWest().lng(),
                minY = philBounds.getSouthWest().lat();

        if (x < minX)
            x = minX;
        if (x > maxX)
            x = maxX;
        if (y < minY)
            y = minY;
        if (y > maxY)
            y = maxY;

        map.setCenter(new google.maps.LatLng(y, x));
    });
}

//Load Markers based on search

function createSearchMarker() {
    var greenPin = "5BB85D";
    var yellowPin = "E6E600";
    var orangePin = "EFAD4D";
    var redPin = "D9544F";

    var marker;
    var icon;
    var ids;
    for (var x = 0; x < excerptList.length; x++) {
        var pos = new google.maps.LatLng(excerptList[x].area.lat, excerptList[x].area.lng);
        var text = excerptList[x].text;
        ids = excerptList[x].id;

        switch (excerptList[x].strength) {
            case 100:
                icon = setMarkerColor(redPin);
                break;
            case 60:
                icon = setMarkerColor(orangePin);
                break;
            case 40:
                icon = setMarkerColor(yellowPin);
                break;
        }

        marker = new google.maps.Marker({
            position: pos,
            map: map,
            id: ids,
            icon: icon
        });
        setWindowListener(marker, "<strong>Excerpt " + excerptList[x].id + "</strong>: <br>" + excerptList[x].text);
        oms.addMarker(marker);
        mc.addMarker(marker);
        setMarkerListener(marker);
        searchMarker.push(marker);
        setTimeout('openAllClusters()', 1000);
    }
}

function openAllClusters() {
    var markers = oms.markersNearAnyOtherMarker();

    $.each(markers, function (i, marker) {
        google.maps.event.trigger(markers[i], 'click');
    });
}

function setMarkerListener(marker) {
    var greenPin = "5BB85D";
    google.maps.event.addListener(marker, 'rightclick', function (event) {
        var add = true;
        for (var x = 0; x < selectedMarker.length; x++) {
            if (selectedMarker[x].id == marker.id)
                add = false;
        }
        if (add) {
            selectedMarker.push(marker);
            marker.setIcon(setMarkerColor(greenPin));
        }
    });
}

//Create Entity Function

function loadEntity() {

    var collapse = $('#accordion');
    collapse.empty();
    collapse.add("<h5 style='text-align:center;'>Mission Entities</h5>");
    for (var x = 0; x < entity.length; x++) {
        //Panel Element
        var panel = document.createElement("div");
        panel.className = "panel panel-default";
        panel.id = "panel" + x;

        var classType = "";
        if (entity[x].classID == 2)
            classType = "Center of Gravity";
        else if (entity[x].classID == 3)
            classType = "Critical Capability";
        else if (entity[x].classID == 4)
            classType = "Critical Requirement";
        else if (entity[x].classID == 5)
            classType = "Critical Vulnerability";

        //Panel Header
        var panelHead = document.createElement("div");
        panelHead.className = "panel-heading";
        panelHead.id = "panelHead" + x;
        panelHead.setAttribute("data-toggle", "collapse");
        panelHead.setAttribute("href", "#collapse" + x);
        panelHead.innerHTML = "<h5><b>" + toTitleCase(entity[x].name) + "</b> - " + classType + "</h5>";

        //Panel Collapse
        var panelCollapse = document.createElement("div");
        panelCollapse.className = "panel-collapse collapse";
        panelCollapse.id = "collapse" + x;

        //Panel Body
        var panelBody = document.createElement("div");
        panelBody.className = "panel-body";
        panelBody.id = "panelBody" + x;
        var table = document.createElement("table");
        for (var y = 0; y < entity[x].excrList.length; y++) {
            var trExcerpt = document.createElement("tr");
            var tdExcerpt = document.createElement("td");
            tdExcerpt.style.paddingBottom = "5px";
            tdExcerpt.style.color = "#202020";
            tdExcerpt.style.textAlign = "justify";
            tdExcerpt.innerHTML = "<b>Excerpt " + entity[x].excrList[y].id + ":</b> " + entity[x].excrList[y].text;
            trExcerpt.appendChild(tdExcerpt);
            table.appendChild(trExcerpt);
        }

        var removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-danger";
        removeBtn.id = "remove" + entity[x].id;
        var span = document.createElement("span");
        span.className = "glyphicon glyphicon-trash";
        removeBtn.appendChild(span);
        removeBtn.innerHTML += " Remove Entity";

        panelBody.appendChild(table);
        panelBody.appendChild(removeBtn);
        panelCollapse.appendChild(panelBody);
        panel.appendChild(panelHead);
        panel.appendChild(panelCollapse);
        collapse.append(panel);

    }
//    setRemoveEntityListener();
}

var entityExcerptList = [];

function createEntity() {
    var modal = $('#entityModal');
    document.getElementById("entityModalLabel").innerHTML = "Create Entity";
    $('#entity-name').val($('#search-field').val());

    var doesUsesTable = document.getElementById("does-uses-table");
    $(doesUsesTable).find("tr:gt(0)").remove();

    var tr1, tr2, td1, td2, td3, td4;
    var label1, input1, label2, input2;

    //Does
    tr1 = document.createElement("tr");
    td1 = document.createElement("td");
    td1.style.marginTop = "10px";
    td1.style.paddingTop = "10px";
    td2 = document.createElement("td");
    td2.style.marginTop = "10px";
    td2.style.padding = "10px";

    label1 = document.createElement("label");
    label1.innerHTML = "Is this executed/practiced/conducted by the <b>" + toTitleCase(missionThreat) + "</b>?";
    label1.style.fontWeight = "100";
    td1.appendChild(label1);
    input1 = document.createElement("input");
    input1.id = "does" + entityCounter;
    input1.type = "checkbox";
    input1.setAttribute("data-toggle", "toggle");
    td2.appendChild(input1);
    $(function () {
        $(input1).bootstrapToggle({
            on: 'Yes',
            off: 'No',
            onstyle: "success",
            offstyle: "default",
            width: "70",
            size: "small"
        });

    });
    tr1.appendChild(td1);
    tr1.appendChild(td2);

    //Uses
    tr2 = document.createElement("tr");
    td3 = document.createElement("td");
    td3.style.marginTop = "10px";
    td3.style.paddingTop = "10px";
    td4 = document.createElement("td");
    td4.style.marginTop = "10px";
    td4.style.padding = "10px";
    label2 = document.createElement("label");
    label2.innerHTML = "Is this used/utilized/taken advantage of by the <b>" + toTitleCase(missionThreat) + "</b>?";
    label2.style.fontWeight = "100";
    td3.appendChild(label2);
    input2 = document.createElement("input");
    input2.id = "uses" + entityCounter;
    input2.type = "checkbox";
    input2.setAttribute("data-toggle", "toggle");
    td4.appendChild(input2);
    $(function () {
        $(input2).bootstrapToggle({
            on: 'Yes',
            off: 'No',
            onstyle: "success",
            offstyle: "default",
            width: "70",
            size: "small"
        });

    });
    tr2.appendChild(td3);
    tr2.appendChild(td4);

    doesUsesTable.appendChild(tr1);
    doesUsesTable.appendChild(tr2);

    entityExcerptList = [];

    var excrListTable = document.getElementById("excerpt-list");
    $(excrListTable).find("tr:gt(0)").remove();


    for (var x = 0; x < selectedMarker.length; x++) {
        for (var y = 0; y < excerptList.length; y++) {
            if (selectedMarker[x].id == excerptList[y].id)
                entityExcerptList.push(excerptList[y]);
        }
    }
    for (var x = 0; x < entityExcerptList.length; x++) {
        var excrListTr = document.createElement("tr");
        var excrListTd = document.createElement("td");
        excrListTd.style.borderBottom = "solid 1px #D3D3D3";
        excrListTd.style.paddingTop = "1vh";
        excrListTd.style.paddingBottom = "1vh";
        excrListTd.innerHTML = "<b>Excerpt " + entityExcerptList[x].id + " - " + entityExcerptList[x].categoryDesc + ":</b> " + entityExcerptList[x].text;
        excrListTr.appendChild(excrListTd);
        excrListTable.appendChild(excrListTr);
    }
    modal.modal('show');
    $("#cancel-entity-btn").click(function () {
        setMarkersOnMap(null, searchMarker);
        setMarkersOnMap(null, selectedMarker);
        mc.clearMarkers();
        selectedMarker = new Array();
        createSearchMarker();
        modal.modal('hide');
    });
}

function saveEntity() {
    var classID = 0;
    var proceed = true;
    if ($('#does' + entityCounter).prop('checked') == true && $('#uses' + entityCounter).prop('checked') == true) {
        classID = 2;
    }
    else if ($('#does' + entityCounter).prop('checked') == true && $('#uses' + entityCounter).prop('checked') == false) {
        classID = 3;
    }
    else if ($('#does' + entityCounter).prop('checked') == false && $('#uses' + entityCounter).prop('checked') == true) {
        classID = 4;
    }
    else if ($('#does' + entityCounter).prop('checked') == false && $('#uses' + entityCounter).prop('checked') == false) {
        proceed = false;
        showAndDismissAlert("danger", "Please complete Does/Uses for <strong>" + $('#entity-name').val() + "</strong>");
    }


    if (entityExcerptList.length != 0 && proceed) {
        var entityObject = {id: entityCounter, name: $('#entity-name').val(), classID: classID, excrList: entityExcerptList, acce: -1, reco: -1};
        entity.push(entityObject);
        entityCounter++;
        setMarkersOnMap(null, searchMarker);
        setMarkersOnMap(null, selectedMarker);
        mc.clearMarkers();
        selectedMarker = new Array();
        createSearchMarker();
        loadEntity();
        createHiddenMarkers();
        $('#entityModal').modal('hide');
        activateRemoveBtn(entity);
    }
    else if (entityExcerptList.length == 0 && proceed) {
        showAndDismissAlert("danger", "<strong>Failed! </strong> You do not have any excerpts to this Entity");
    }
}

function assignCrCv() {
    var modal = $('#crcvModal');
    var table = document.getElementById("cr-cv-table");
    $(table).find("tr:gt(0)").remove();
    var crCounter = 0;
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].classID == 4) {
            var tr, td1, td2, input1;
            //create TR
            tr = document.createElement("tr");
            tr.style.borderBottom = "solid 1px #D3D3D3";
            tr.style.padding = "5px";
            tr.style.margin = "3px";

            //create TD
            td1 = document.createElement("td");
            td2 = document.createElement("td");

            //center toggle buttons
            td2.style.textAlign = "center";
            td2.style.padding = "5px";

            //content for each td
            //td1
            td1.innerHTML = entity[x].name;

            //td2
            input1 = document.createElement("input");
            input1.id = "vulnerable" + entity[x].id;
            input1.type = "checkbox";
            input1.setAttribute("data-toggle", "toggle");
            td2.appendChild(input1);
            $(function () {
                $(input1).bootstrapToggle({
                    on: 'Yes',
                    off: 'No',
                    onstyle: "success",
                    offstyle: "default",
                    width: "70",
                    size: "small"
                });

            });

            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);
            crCounter++;
        }
    }
    if (crCounter > 0)
        modal.modal('show');
    else {
        showAndDismissAlert("danger", "You do not have a <strong>Critical Requirement</strong>. Please look for more data.")
    }
}

function saveCrCv() {
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].classID == 4) {
            if ($('#vulnerable' + entity[x].id).prop('checked') == true) {
                entity[x].classID = 5;
                entity[x].classDesc = "cv";
            }
        }
    }
    var proceed = true;

    var cogCounter = 0, ccCounter = 0, crCounter = 0, cvCounter = 0;
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].classID == 2) {
            cogCounter++;
        }
        else if (entity[x].classID == 3) {
            ccCounter++;
        }
        else if (entity[x].classID == 4) {
            crCounter++;
        }
        else if (entity[x].classID == 5) {
            cvCounter++;
        }
    }
    if (entity.length < 4) {
        proceed = false;
        showAndDismissAlert("danger", "You do not have enough <strong> Entities </strong>");
    }
    if (cogCounter == 0) {
        proceed = false;
        showAndDismissAlert("danger", "You cannot proceed <strong> without a Center of Gravity </strong>");
    }
    if (crCounter == 0) {
        proceed = false;
        showAndDismissAlert("danger", "You do not have a <strong> Critical Requirement  </strong>");
    }
    if (cogCounter > 1) {
        proceed = false;
        $('#crcvModal').modal('hide');
        generateCOGModal();
    }
    if (cvCounter == 0) {
        proceed = false;
        showAndDismissAlert("danger", "You do not have a <strong> Critical Vulnerability  </strong>");
    }
    if (proceed) {
        if (unusedKeywords.length != 0) {
            $('#crcvModal').modal('hide');
            $('#keywordModal').modal('show');
        }
        else {
            $('#crcvModal').modal('hide');
            savePCO();
        }
    }

}

function setMarkersOnMap(map, excerptMarker) {

    for (var x = 0; x < excerptMarker.length; x++) {
        excerptMarker[x].setMap(map);
    }
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

function setMarkerColor(color) {
    var iconColor = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
    return iconColor;
}

function checkMissionStatus() {
    var proceed = true;
    if (missionStatus > 2) {
        $('#resetModal').modal('show');
        proceed = false;
    }
    if (proceed) {
        assignCrCv();
    }
}

function calculateDistance(e, excr) {
    var hqLatLng = new google.maps.LatLng(hqLat, hqLng);
    var distanceKM = 0;
    if (e.classID == 5) {
        var cvCenter;
        var cvBounds = new google.maps.LatLngBounds();
        for (var y = 0; y < excr.length; y++) {
            cvBounds.extend(new google.maps.LatLng(excr[y].area.lat, excr[y].area.lng));
            cvCenter = cvBounds.getCenter();
        }
        var distanceM = google.maps.geometry.spherical.computeDistanceBetween(hqLatLng, cvCenter);

        distanceKM = distanceM / 1000;
    }
    return distanceKM;
}

function calculateAccessibility(distance) {
    //assumes that distance is an int, measured in km;
    if (distance == 0)
        return 0;
    if (distance <= 100)
        return 10;
    else if (distance > 100 && distance <= 200)
        return 9;
    else if (distance > 200 && distance <= 300)
        return 8;
    else if (distance > 300 && distance <= 400)
        return 7;
    else if (distance > 400 && distance <= 500)
        return 6;
    else if (distance > 500 && distance <= 600)
        return 5;
    else if (distance > 600 && distance <= 700)
        return 4;
    else if (distance > 700 && distance <= 800)
        return 3;
    else if (distance > 800 && distance <= 900)
        return 2;
    else if (distance > 900)
        return 1;
}

function calculateRecognizability(excrArr) {
    var totalRel = 0;
    excrArr.forEach(function (excr) {
        totalRel += excr.strength;
    });
    var avgRel = (totalRel) / (excrArr.length);
    if (avgRel > 40 && avgRel <= 46)
        return 1;
    else if (avgRel > 46 && avgRel <= 52)
        return 2;
    else if (avgRel > 52 && avgRel <= 58)
        return 3;
    else if (avgRel > 58 && avgRel <= 64)
        return 4;
    else if (avgRel > 64 && avgRel <= 7)
        return 5;
    else if (avgRel > 7 && avgRel <= 76)
        return 6;
    else if (avgRel > 76 && avgRel <= 82)
        return 7;
    else if (avgRel > 82 && avgRel <= 88)
        return 8;
    else if (avgRel > 88 && avgRel <= 94)
        return 9;
    else if (avgRel > 94)
        return 10;
}

function loadStrengthSlider() {
    filterStrength = 40;
    var rangeValues =
            {
                "1": "All",
                "2": "Moderate Relevance",
                "3": "Strong Relevance"
            };

    $('#strengthRangeInput').attr("value", 1);
    $('#strengthRangeText').text("Relevance Range: " + rangeValues[$('#strengthRangeInput').val()]);
    $(function () {
        // setup an event handler to set the text when the range value is dragged (see event for input) or changed (see event for change)
        $('#strengthRangeInput').change(function () {
            $('#strengthRangeText').text("Relevance Range: " + rangeValues[$('#strengthRangeInput').val()]);
            var strengthRange = $('#strengthRangeInput').val();
            if (strengthRange == 1)
                filterStrength = 40;
            else if (strengthRange == 2)
                filterStrength = 60;
            else if (strengthRange == 3)
                filterStrength = 100;
            applyFilter();
        });

    });

}

function loadAreaSlider() {
    // define a lookup for what text should be displayed for each value in your range
    filterLevel = 1;
    filterArea = level1;

    var lastLevel;
    var proceed = true;
    if (level1 == "null" && proceed) {
        lastLevel = 1;
        proceed = false;
    }
    if (level2 == "null" && proceed) {
        lastLevel = 2;
        proceed = false;
    }
    if (level3 == "null" && proceed) {
        lastLevel = 3;
        proceed = false;
    }
    if (level4 == "null" && proceed) {
        lastLevel = 4;
        proceed = false;
    }
    if (level5 == "null" && proceed) {
        lastLevel = 5;
        proceed = false;
    }
    if (level6 == "null" && proceed) {
        lastLevel = 6;
        proceed = false;
    }
    if (level7 == "null" && proceed) {
        lastLevel = 7;
        proceed = false;
    }
    if (level8 == "null" && proceed) {
        lastLevel = 8;
        proceed = false;
    }

    var rangeValues =
            {
                "1": level1,
                "2": level2,
                "3": level3,
                "4": level4,
                "5": level5,
                "6": level6,
                "7": level7,
                "8": level8
            };

    $('#areaRangeInput').attr("value", 1);
    $(function () {
        $('#areaRangeInput').attr("value", 1);
        $('#areaRangeText').text("Search Area Range: " + rangeValues[$('#areaRangeInput').val()]);
        // setup an event handler to set the text when the range value is dragged (see event for input) or changed (see event for change)
        $('#areaRangeInput').change(function () {
            if (rangeValues[$('#areaRangeInput').val()] != "null") {
                $('#areaRangeText').text("Search Area Range: " + rangeValues[$('#areaRangeInput').val()]);
                filterArea = rangeValues[$('#areaRangeInput').val()];
                filterLevel = $('#areaRangeInput').val();
                applyFilter();
            }
            else {
                $('#areaRangeText').text("No Area Level Found");
            }

        });

    });
}

function displayKeywords(value) {
    $('#unused-keyword').tagsinput('removeAll');
    $('#used-keyword').tagsinput('removeAll');

    for (var x = 0; x < unusedKeywords.length; x++) {
        if (unusedKeywords[x] == value) {
            unusedKeywords.splice(x, 1);
            usedKeywords.push(value);
        }
    }
    for (var x = 0; x < unusedKeywords.length; x++) {
        $('#unused-keyword').tagsinput('add', unusedKeywords[x]);
    }
    for (var x = 0; x < usedKeywords.length; x++) {
        $('#used-keyword').tagsinput('add', usedKeywords[x]);
    }


}

function deleteEntity(id) {
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].id == id)
            entity.splice(x, 1);
    }
    loadEntity();
    createHiddenMarkers();
    activateRemoveBtn(entity);
}

function getMarker(excrID) {
    var marker;
    for (var x = 0; x < searchMarker.length; x++) {
        marker = searchMarker[x];
        if (marker.id == excrID)
            break;
    }
    return marker;
}

function applyFilter() {
    if (excerptList != null) {
        mc.clearMarkers();
        var excrArea;
        var visible;

        excerptList.forEach(function (excr) {

            visible = false;
            excrArea = null;
            if (excr.strength >= filterStrength) {
                if (filterLevel == 1) {
                    excrArea = excr.area.level1;
                }
                else if (filterLevel == 2) {
                    excrArea = excr.area.level2;
                }
                else if (filterLevel == 3) {
                    excrArea = excr.area.level3;
                }
                else if (filterLevel == 4) {
                    excrArea = excr.area.level4;
                }
                else if (filterLevel == 5) {
                    excrArea = excr.area.level5;
                }
                else if (filterLevel == 6) {
                    excrArea = excr.area.level6;
                }
                else if (filterLevel == 7) {
                    excrArea = excr.area.level7;
                }
                else if (filterLevel == 8) {
                    excrArea = excr.area.level8;
                }

                if (isEqualRaw(excrArea, filterArea))
                    visible = true;

            }
            excrMarker = getMarker(excr.id); //This method may or may not exist yet
            if (visible) {
                mc.addMarker(excrMarker);
            }

            excrMarker.setVisible(visible);
        });
        mc.redraw();
    }
}

function activateRemoveBtn(entityArr) {
    for (var x = 0; x < entityArr.length; x++) {
        var entity = entityArr[x];
        var btn = document.getElementById("remove" + entity.id);
        btn.setAttribute("onclick", "deleteEntity(" + entity.id + ")");
    }
}

function generateCOGModal() {
    var modalBody = $('#cog-select');
    modalBody.empty();
    var label = document.createElement("label");
    label.innerHTML = "You have multiple Centers of Gravity. Please choose one Center of Gravity for this Mission: " + missionTitle + ". <br>";
    var select = document.createElement("select");
    select.id = "cogSelect";
    select.style.textAlign = "center";
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].classID == 2) {
            var option = document.createElement("option");
            option.value = entity[x].id;
            option.text = toTitleCase(entity[x].name);
            select.appendChild(option);
        }
    }
    var cogList = document.createElement("div");
    var label2 = document.createElement("label");
    label2.innerHTML = "<br>A new Mission that has the same Mission Details will be created for each Center of Gravity. Please input Mission Title for each. If you don't want to create a new mission for the Center of Gravity, leave the Mission Title Field blank.";
    cogList.appendChild(label2);
    var table = document.createElement("table");
    table.style.width = "100%";
    table.id = "cogTable";
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].classID == 2 && entity[x].id != $('#cog-select').val()) {
            var tr = document.createElement("tr");

            var td1 = document.createElement("td");
            td1.style.width = "25%";
            var labelCOG = document.createElement("label");
            labelCOG.innerHTML = toTitleCase(entity[x].name) + ": ";
            td1.appendChild(labelCOG);

            var td2 = document.createElement("td");
            td2.style.width = "65%";
            var input = document.createElement("input");
            input.type = "text";
            input.className = "form-box";
            input.setAttribute("placeholder", "Enter New Mission Title for Center Of Gravity");
            input.id = "duplicateCOG" + entity[x].id;
            input.style.marginBottom = "10px";
            input.style.width = "100%";
            td2.appendChild(input);

            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);
        }
    }
    table.deleteRow(0);
    cogList.appendChild(table);


    modalBody.append(label);
    modalBody.append(select);
    modalBody.append(cogList);

    $('#cogSelect').multiselect({
        onChange: function (option, checked, select) {
            cogList.innerHTML = "";
            var label2 = document.createElement("label");
            label2.innerHTML = "<br>A new Mission that has the same Mission Details will be created for each Center of Gravity. Please input Mission Title for each. If you don't want to create a new mission for the Center of Gravity, leave the Mission Title Field blank.";
            cogList.appendChild(label2);
            var table = document.createElement("table");
            table.style.width = "100%";
            for (var x = 0; x < entity.length; x++) {
                if (entity[x].classID == 2 && entity[x].id != $(option).val()) {
                    var tr = document.createElement("tr");

                    var td1 = document.createElement("td");
                    td1.style.width = "25%";
                    var labelCOG = document.createElement("label");
                    labelCOG.innerHTML = toTitleCase(entity[x].name) + ": ";
                    td1.appendChild(labelCOG);

                    var td2 = document.createElement("td");
                    td2.style.width = "65%";
                    var input = document.createElement("input");
                    input.type = "text";
                    input.className = "form-box";
                    input.setAttribute("placeholder", "Enter New Mission Title for Center Of Gravity");
                    input.id = "duplicateCOG" + entity[x].id;
                    input.style.marginBottom = "10px";
                    input.style.width = "100%";
                    td2.appendChild(input);

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    table.appendChild(tr);
                }
            }
            cogList.appendChild(table);
        }
    });

    $('#cogModal').modal('show');
}

function setMissionCOG() {
    var cog = $('#cogSelect').val();
    duplicateCOGs = [];
    var cogArr = [];
    for (var x = 0; x < entity.length; x++) {
        if (entity[x].classID == 2) {
            cogArr.push(entity[x]);
        }
    }

    for (var x = 0; x < cogArr.length; x++) {
        if (cogArr[x].id != cog) {

            var duplicateEntityArr = [];
            for (var z = 0; z < entity.length; z++) {
                var entityObject;
                var entityExcerptId = [];
                for (var y = 0; y < entity[z].excrList.length; y++) {
                    entityExcerptId.push(entity[z].excrList[y].id);
                }
                if (entity[z].acce == -1 && entity[z].reco == -1)
                    entityObject = {id: entity[z].id, name: entity[z].name, classID: entity[z].classID, excrList: entityExcerptId, acce: calculateAccessibility(calculateDistance(entity[z], entity[z].excrList)), reco: calculateRecognizability(entity[z].excrList)};
                else {
                    entityObject = {id: entity[z].id, name: entity[z].name, classID: entity[z].classID, excrList: entityExcerptId, acce: entity[z].acce, reco: entity[z].reco};
                }
                if (entityObject.classID != 2 || entityObject.id == cogArr[x].id)
                    duplicateEntityArr.push(entityObject);

            }

            var missionTitle = $('#duplicateCOG' + cogArr[x].id).val();
            if (!checkIfEmpty(missionTitle)) {
                var duplicateCOG = {duplicateEntityArr: duplicateEntityArr, missionTitle: missionTitle};
                duplicateCOGs.push(duplicateCOG);
            }
        }
    }
    savePCO();
}

function savePCO() {
    var entityArr = [];
    var proceed = true;
    if (entity.length == 0) {
        showAndDismissAlert("danger", "You have not created a <strong> single Entity. </strong>");
    }
    if (entity.length < 4) {
        showAndDismissAlert("warning", "You do not have<strong> enough entities </strong>to proceed. Consider searching for more data.");
    }
    if (proceed) {
        var cogCounter = 0;
        for (var x = 0; x < entity.length; x++) {
            var entityObject;
            var entityExcerptId = [];
            for (var y = 0; y < entity[x].excrList.length; y++) {
                entityExcerptId.push(entity[x].excrList[y].id);
            }
            if (entity[x].acce == -1 && entity[x].reco == -1)
                entityObject = {id: entity[x].id, name: entity[x].name, classID: entity[x].classID, excrList: entityExcerptId, acce: calculateAccessibility(calculateDistance(entity[x], entity[x].excrList)), reco: calculateRecognizability(entity[x].excrList)};
            else {
                entityObject = {id: entity[x].id, name: entity[x].name, classID: entity[x].classID, excrList: entityExcerptId, acce: entity[x].acce, reco: entity[x].reco};
            }
            entityArr.push(entityObject);

            if (entityObject.classID == 2)
                cogCounter++;
        }
        if (cogCounter > 1) {
            var cog = $('#cogSelect').val();
            for (var x = 0; x < entityArr.length; x++) {
                if (entityArr[x].id != cog && entityArr[x].classID == 2)
                    entityArr.splice(x, 1);
            }
        }
        console.log(entityArr);
        $.ajax({//The Super AJAX
            type: "GET",
            url: "Save2PCO",
            data: {
                missionID: missionID,
                entityArr: toJSON(entityArr)
            },
            async: false,
            success: function (response) {

                duplicateCOGs.forEach(function (cog) {
                    $.ajax({
                        type: "GET",
                        url: "DuplicateMission",
                        data: {
                            missionID: missionID,
                            missionTitle: cog.missionTitle
                        },
                        async: false,
                        success: function (response) {
                            console.log(response);
                            $.ajax({
                                type: "GET",
                                url: "Save2PCO",
                                data: {
                                    missionID: response.missionID,
                                    entityArr: toJSON(cog.duplicateEntityArr)
                                },
                                async: false
                            });
                        }
                    });
                });
                showAndDismissAlert("success", "<strong>Characteristics Overlay</strong> has been <strong>saved.</strong>");
                window.location.assign("ANMission3COG");
            }
        });
    }
}
