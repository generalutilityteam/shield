var eentityCR;
var crArr = [];

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "GetCROfMission",
        data: {
            missionID: missionID
        },
        success: function (responseJSON) {
            eentityCR = responseJSON;
            $.ajax({
                type: "GET",
                url: "GetPOSPOOfMission",
                data: {
                    missionID: missionID
                },
                success: function (responseJSON) {
                    var poArr = responseJSON;
                    var empty = true;
                    for (var x = 0; x < poArr.length; x++) {
                        var crObj;
                        var entity = poArr[x];
                        var spoCounter = 0;
                        if (entity.spoList.length > 0) {
                            spoCounter = entity.spoList.length;
                            empty = false;
                        }
                        crObj = {id: entity.id, name: entity.name, po: replaceIfEmpty(entity.poText), cvList: eentityCR[x].cvList, spoCounter: spoCounter, spoList: entity.spoList};
                        crArr.push(crObj);
                    }
                    initialize();
                    if (!empty)
                        loadSPO();
                }
            });
        }
    });


});

function initialize() {
    document.getElementById("global-username").innerHTML = userFullName + " ";
    buildNav(missionStatus, 6);
    buildCarver();
    activateAddSPOBtn();
}

function buildCarver() {
    var collapse = document.getElementById("accordion");

    for (var x = 0; x < eentityCR.length; x++) {
        //Panel Element
        var id = eentityCR[x].id;
        var panel = document.createElement("div");
        panel.className = "panel panel-default";
        panel.id = "panel" + id;

        //Panel Header
        var panelHead = document.createElement("div");
        panelHead.className = "panel-heading";
        panelHead.id = "panelHead" + id;
        panelHead.setAttribute("data-toggle", "collapse");
        panelHead.setAttribute("data-parent", "#accordion");
        panelHead.setAttribute("href", "#collapse" + id);
        panelHead.innerHTML = "<h5><b>Critical Requirement: " + toTitleCase(eentityCR[x].name) + "</b></h5>";
        panelHead.style.textAlign = "center";
        panelHead.style.backgroundColor = "rgba(230,230,230,1.0)";


        //Panel Collapse
        var panelCollapse = document.createElement("div");
        panelCollapse.className = "panel-collapse collapse";
        panelCollapse.id = "collapse" + id;

        //Panel Body
        var panelBody = document.createElement("div");
        panelBody.className = "panel-body";
        panelBody.id = "panelBody" + id;

        var table = document.createElement("table");
        table.className = "table table-bordered";
        table.style.width = "100%";
        table.innerHTML = '<thead><tr style="border: solid 1px #B2B2B2; background-color: #F5F5F5; font-weight: 700;"><td class="CV">Critical Vulnerability</td><td class="CARVER">Criticality</td><td class="CARVER">Accessibility</td><td class="CARVER">Recuperability</td><td class="CARVER">Vulnerability</td><td class="CARVER">Effect</td><td class="CARVER">Recognizability</td><td class="CARVER">Total</td></tr></thead>';

        $(table).DataTable({
            data: eentityCR[x].cvList,
            columns: [
                {"data": "name"},
                {"data": "crit"},
                {"data": "acce"},
                {"data": "recu"},
                {"data": "vuln"},
                {"data": "effe"},
                {"data": "reco"},
                {"data": null}
            ], "columnDefs": [
                {
                    "render": function (data, type, row) {
                        return toTitleCase(data);
                    },
                    "targets": 0
                },
                {
                    "render": function (data, type, row) {
                        var total = data.crit + data.acce + data.recu + data.vuln + data.effe + data.reco;
                        return total;
                    },
                    "targets": 7
                },
                {"sClass": "alignCenter", "targets": [1, 2, 3, 4, 5, 6, 7]},
                {"sClass": "bold", "targets": [0]}
            ]
        });

        panelBody.appendChild(table);

        var poDiv = document.createElement("div");
        poDiv.style.width = "80%";
        poDiv.style.marginLeft = "8%";
        poDiv.style.marginTop = "4vh";
        var poTable = document.createElement("table");
        poTable.id = "poTable" + id;
        poTable.style.width = "100%";


        var trPO = document.createElement("tr");
        var td1PO = document.createElement("td");
        td1PO.style.width = "15%";
        td1PO.innerHTML = "PsyOps Objective: ";

        var td2PO = document.createElement("td");
        td2PO.style.width = "50%";
        td2PO.innerHTML = "<input id='poText" + id + "' type='text' class='form-box' style='width: 95%;' value='" + crArr[x].po + "'>";

        var td3PO = document.createElement("td");
        td3PO.style.width = "35%";
        var addSPOBtn = document.createElement("button");
        addSPOBtn.className = "btn btn-success";
        addSPOBtn.id = "addSPOBtn" + id;
        addSPOBtn.style.width = "100%";
        addSPOBtn.innerHTML = "<span class='glyphicon glyphicon-plus'></span> Add SPO";
        td3PO.appendChild(addSPOBtn);

        trPO.appendChild(td1PO);
        trPO.appendChild(td2PO);
        trPO.appendChild(td3PO);
        poTable.appendChild(trPO);
        poDiv.appendChild(poTable);

        panelBody.appendChild(poDiv);
        panelCollapse.appendChild(panelBody);
        panel.appendChild(panelHead);
        panel.appendChild(panelCollapse);
        collapse.appendChild(panel);
    }

}

function addSPO(id) {
    var entity;
    for (var x = 0; x < crArr.length; x++) {
        if (crArr[x].id == id)
            entity = crArr[x];
    }
    var trPO = document.createElement("tr");
    trPO.className = "SPO";
    var td1PO = document.createElement("td");
    td1PO.style.width = "15%";
    td1PO.style.paddingTop = "2vh";
    td1PO.innerHTML = "Supporting PO:";

    var td2PO = document.createElement("td");
    td2PO.style.width = "50%";
    td2PO.style.paddingTop = "2vh";
    td2PO.innerHTML = "<input type='text' class='form-box' style='width: 95%;' id='" + id + "spoText" + entity.spoCounter + "'>";

    var td3PO = document.createElement("td");
    td3PO.innerHTML = "CV Reference: ";
    td3PO.style.width = "35%";
    td3PO.style.paddingTop = "2vh";
    var select = document.createElement("select");
    select.setAttribute("multiple", "multiple");
    select.id = id + "spoCV" + entity.spoCounter;
    for (var x = 0; x < entity.cvList.length; x++) {
        var option = document.createElement("option");
        option.value = entity.cvList[x].id;
        option.text = toTitleCase(entity.cvList[x].name);
        select.appendChild(option);
    }
    td3PO.appendChild(select);
    activateMultiSelect(select);

    trPO.appendChild(td1PO);
    trPO.appendChild(td2PO);
    trPO.appendChild(td3PO);
    $('#poTable' + id).append(trPO);

    entity.spoCounter++;
}

function loadSPO() {
    for (var x = 0; x < crArr.length; x++) {
        for (var y = 0; y < crArr[x].spoList.length; y++) {
            var id = crArr[x].id;
            var trPO = document.createElement("tr");
            trPO.className = "SPO";
            var td1PO = document.createElement("td");
            td1PO.style.width = "15%";
            td1PO.style.paddingTop = "2vh";
            td1PO.innerHTML = "Supporting PO:";

            var td2PO = document.createElement("td");
            td2PO.style.width = "50%";
            td2PO.style.paddingTop = "2vh";
            td2PO.innerHTML = "<input type='text' class='form-box' style='width: 95%;' id='" + id + "spoText" + y + "' value='" + crArr[x].spoList[y].text + "'>";

            var td3PO = document.createElement("td");
            td3PO.innerHTML = "CV Reference: ";
            td3PO.style.width = "35%";
            td3PO.style.paddingTop = "2vh";
            var select = document.createElement("select");
            select.setAttribute("multiple", "multiple");
            select.id = id + "spoCV" + y;
            for (var z = 0; z < crArr[x].cvList.length; z++) {
                var option = document.createElement("option");
                option.value = crArr[x].cvList[z].id;
                option.text = toTitleCase(crArr[x].cvList[z].name);
                select.appendChild(option);
            }
            td3PO.appendChild(select);
            loadMultiSelect(select, crArr[x].spoList[y].cvIDList);

            trPO.appendChild(td1PO);
            trPO.appendChild(td2PO);
            trPO.appendChild(td3PO);
            $('#poTable' + id).append(trPO);
        }
    }
}

function activateMultiSelect(select) {
    $(select).multiselect();
}
function loadMultiSelect(select, array) {
    $(select).multiselect('select', array);
}

function activateAddSPOBtn() {
    for (var x = 0; x < eentityCR.length; x++) {
        var entity = eentityCR[x];
        var btn = document.getElementById("addSPOBtn" + entity.id);
        btn.setAttribute("onclick", "addSPO(" + entity.id + ")");
    }
}

function savePO() {
    var saveCR = [];
    var proceed = true;
    for (var x = 0; x < crArr.length; x++) {
        var poObj;
        var poText = $('#poText' + crArr[x].id).val();
        if (checkIfEmpty(poText)) {
            proceed = false;
            showAndDismissAlert("danger", "Please input <strong>Psyops Objective </strong> for " + crArr[x].name);
        }
        var spoList = [];
        if(crArr[x].spoCounter < 2){
            proceed = false;
                showAndDismissAlert("danger", "You need at least <strong>2 Supporting Psyops Objectives </strong> to proceed.");
        }
        for (var y = 0; y < crArr[x].spoCounter && proceed; y++) {
            var spoObj;
            var spoText = $('#' + crArr[x].id + "spoText" + y).val();
            if (checkIfEmpty(spoText)) {
                proceed = false;
                showAndDismissAlert("danger", "Please input <strong>Supporting Psyops Objective </strong> for " + crArr[x].name);
            }
            var spoCV = [];
            $('#' + crArr[x].id + "spoCV" + y + ' option:selected').each(function () {
                spoCV.push($(this).val());
            });
            if (spoCV.length == 0) {
                proceed = false;
                showAndDismissAlert("danger", "Please include reference for <strong>Supporting Psyops Objective </strong> on " + crArr[x].name);
            }
            if (proceed) {
                var spoObj = {text: spoText, cvIDList: spoCV};
                spoList.push(spoObj);
            }
        }
        if (proceed) {
            poObj = {id: crArr[x].id, po: poText, spoList: spoList};
            saveCR.push(poObj);
        }
    }
    if (proceed) {
        $.ajax({
            type: "GET",
            url: "Save6PO",
            data: {
                saveCR: toJSON(saveCR)
            },
            success: function (response) {
                showAndDismissAlert("success", "<strong>Psyops Objective</strong> has been <strong>saved.</strong>");
                window.location.assign("ANMissions");
            }
        });
    }
}
