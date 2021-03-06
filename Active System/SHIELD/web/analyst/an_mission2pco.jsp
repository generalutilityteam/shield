<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>SHIELD: Decision Support System</title>

        <!--Bootstrap-->
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

        <!--Layout-->
        <link href="css/layout.css" rel="stylesheet" type="text/css">
        <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>

        <!--General Scripts-->
        <script src="js/util.js"></script>
        <script  src="js/alert.js"></script>

        <!--Sliding Side Bar CSS-->
        <link href="css/BootSideMenu.css" rel="stylesheet">

        <!--Bootstrap Tags-input-->
        <link rel="stylesheet" href="css/bootstrap-tagsinput.css">
        <script src="js/bootstrap-tagsinput.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.0/css/bootstrap-toggle.min.css" rel="stylesheet">
        <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.0/js/bootstrap-toggle.min.js"></script>
        
        <!--Dropdown Checkbox-->
        <script type="text/javascript" src="js/bootstrap-multiselect.js"></script>
        <link rel="stylesheet" href="css/bootstrap-multiselect.css" type="text/css"/>

        <!--Page Script-->
        <script src="analyst/pagescripts/an_mission2pco.js"></script>
        <script src="js/mission-menu-builder.js"></script>
        <script src="js/jquery.autocomplete.js"></script>

        <!--Map Script-->
        <script src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=drawing,geometry,places&ext=.js"></script>
        <script src="js/oms.js"></script>
        <script src="https://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>
        <script src="https://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer_compiled.js"></script>
        <script src="https://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/data.json"></script>
        <script src="https://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.9/src/markerwithlabel.js"></script>


        <script>
            var missionStatus = <%=session.getAttribute("missionStatus")%>;
            var missionTitle = '<%=session.getAttribute("missionTitle")%>';
            var missionID = <%=session.getAttribute("missionID")%>;
            var analystName = '<%=session.getAttribute("analystName")%>';
            var userFullName = '<%=session.getAttribute("userFullName")%>';
            var login = '<%=session.getAttribute("login")%>';

            var missionThreat = '<%=request.getAttribute("missionThreat")%>';
            var keywordList = <%=request.getAttribute("keywordList")%>;
            var level8 = '<%=request.getAttribute("level8")%>';
            var level7 = '<%=request.getAttribute("level7")%>';
            var level6 = '<%=request.getAttribute("level6")%>';
            var level5 = '<%=request.getAttribute("level5")%>';
            var level4 = '<%=request.getAttribute("level4")%>';
            var level3 = '<%=request.getAttribute("level3")%>';
            var level2 = '<%=request.getAttribute("level2")%>';
            var level1 = '<%=request.getAttribute("level1")%>';
            var lat = <%=request.getAttribute("lat")%>;
            var lng = <%=request.getAttribute("lng")%>;
            var hqLat = <%=request.getAttribute("hqLat")%>;
            var hqLng = <%=request.getAttribute("hqLng")%>;

            function printHiddenMap() {

                var political = [];
                var militarySecurity = [];
                var economic = [];
                var social = [];
                var information = [];
                var environmentPhysical = [];
                var infrastructureTechnology = [];

                for (var x = 0; x < entity.length; x++) {
                    for (var y = 0; y < entity[x].excrList.length; y++) {
                        var category = entity[x].excrList[y].categoryID;
                        var excerptTemp = entity[x].excrList[y];
                        switch (category) {
                            case 1:
                                political.push(excerptTemp);
                                break;
                            case 2:
                                militarySecurity.push(excerptTemp);
                                break;
                            case 3:
                                economic.push(excerptTemp);
                                break;
                            case 4:
                                social.push(excerptTemp);
                                break;
                            case 5:
                                information.push(excerptTemp);
                                break;
                            case 6:
                                infrastructureTechnology.push(excerptTemp);
                                break;
                            case 7:
                                environmentPhysical.push(excerptTemp);
                                break;
                        }
                    }
                }
                var divElements = document.getElementById('parent-map-div').innerHTML;
                var oldPage = document.body.innerHTML;

                var reportHTML = "<html><head><style>.maptd{color: #FFFFFF;}</style><title></title></head><body><table>";
                reportHTML += "<tr><td><h1>Psychological Operations Characteristics Overlay: " + missionTitle + "</h1></td></tr>";

                reportHTML += "<tr><td><h3>Excerpts</h4></td></tr>";


                reportHTML += "<tr><td><h4>Political</h4></td></tr>";
                political.forEach(function (excr) {
                    reportHTML += "<tr><td>- " + excr.text + "</td></tr>";
                });

                reportHTML += "<tr><td><h4>Military and Security</h4></td></tr>";
                militarySecurity.forEach(function (excr) {
                    reportHTML += "<tr><td>- " + excr.text + "</td></tr>";
                });

                reportHTML += "<tr><td><h4>Economic</h4></td></tr>";
                economic.forEach(function (excr) {
                    reportHTML += "<tr><td>- " + excr.text + "</td></tr>";
                });

                reportHTML += "<tr><td><h4>Social</h4></td></tr>";
                social.forEach(function (excr) {
                    reportHTML += "<tr><td>- " + excr.text + "</td></tr>";
                });

                reportHTML += "<tr><td><h4>Information</h4></td></tr>";
                information.forEach(function (excr) {
                    reportHTML += "<tr><td>- " + excr.text + "</td></tr>";
                });

                reportHTML += "<tr><td><h4>Infrastructure and Technology</h4></td></tr>";
                infrastructureTechnology.forEach(function (excr) {
                    reportHTML += "<tr><td>- " + excr.text + "</td></tr>";
                });

                reportHTML += "<tr><td><h4>Environmental and Physical</h4></td></tr>";
                environmentPhysical.forEach(function (excr) {
                    reportHTML += "<tr><td>- " + excr.text + "</td></tr>";
                });

                reportHTML += "<tr><td class='maptd'>" + divElements + "</td></tr>";

                reportHTML += "</table></body>";


                //Finishing lines;
                reportHTML += "</body>";
                var pop = window.open();
                pop.document.body.innerHTML = reportHTML;
                pop.print();
                pop.close();
            }
        </script>
        <style>
            .report-map-div{
                vertical-align: top
            }
            .report-title-div{

            }
            .report-text-div{
                position:absolute;
                bottom:0;
            }
            .autocomplete-suggestions { border: 1px solid #D3D3D3; background: #FFF; opacity: .8; overflow: auto;  box-shadow: 5px 5px 5px #aaaaaa; margin-top: 3px;}
            .autocomplete-suggestion { padding: 2vh 0 2vh 2vh; overflow: hidden; height: 7vh;}
            .autocomplete-selected { background: #F5F5F5; }
            .autocomplete-suggestions strong { font-weight: 700; color: #009900; }
            .autocomplete-group { padding: 5px 0 5px 10px; }
            .autocomplete-group strong { display: block; border-bottom: 1px solid #000; }
            ::-webkit-scrollbar {
                width: 10px;
            }
            /* Track */
            ::-webkit-scrollbar-track {
                -webkit-border-radius: 5px;
                border-radius: 5px;
                background-color: #fff;
            }
            /* Handle */
            ::-webkit-scrollbar-thumb {
                -webkit-border-radius: 5px;
                border-radius: 5px;
                background: #F5F5F5;
            }
            a[href^="http://maps.google.com/maps"]{display:none !important}
            a[href^="https://maps.google.com/maps"]{display:none !important}

            .gmnoprint a, .gmnoprint span, .gm-style-cc {
                display:none;
            }
            .gmnoprint div {
                background:none !important;
            }
            .labels {
                color: white;
                font-size: 16px;
                text-align: center;
                width: 20px;     
                white-space: nowrap;
            }
            @media print{

                .print{
                    width: 100%;
                    height:100%;
                    display: block;
                    size: letter landscape;
                    color: white;
                    font-size: 16px;
                    text-align: center;
                    width: 20px;     
                    white-space: nowrap;
                }
                h5 {
                    color: #000;
                    background: none;
                }

            }
        </style>

    </head>

    <body>

        <!--Navigation Bar-->
        <script src="js/navigation.js"></script>

        <div id="container-fluid">
            <div id="parent-map-div">
                <div id="hidden-area-map" class="print" style="z-index: -4; position: absolute; height: 500px; width: 600px; border-style: solid; border-width: 1px; border-color: #D3D3D3; border-radius: 3px;">
                </div>
            </div>
            <div id="content-shield" style="border-top: none; z-index: 1">

                <div class="col-md-2" style="position: fixed;">
                    <div style="background-color: rgba(230,230,230,1.0); color: black; width: 18vw; border-radius: 5px; text-align: justify; padding: 0 15px 0 15px;">
                        <h5 style="padding-top: 20px; font-size: 15px;"><span class="glyphicon glyphicon-file" aria-hidden="true"> </span><b> MISSION:</b><br> <label id="nav-mission-title-label" style="font-size: 13px; font-weight: 100; padding-left: 20px; text-align: left;"> </label></h5>
                        <h5 style="padding-bottom: 20px; font-size: 15px;"><span class="glyphicon glyphicon-user " aria-hidden="true"> </span><b> ANALYST:</b><br> <label id="nav-analyst-name-label" style="font-size: 13px; font-weight: 100; padding-left: 20px; text-align: left;"> </label></h5>
                    </div>
                    <ul class="nav nav-pills nav-stacked affix" id="nav-shield" role="tablist">
                    </ul>
                </div>
                <div class="col-md-10" style="margin-left: 18vw; height: 84vh; margin-top: 1vh;">
                    <div style="position: absolute; top: 80vh; right: 3vmin;">
                        <button type="button" onclick="checkMissionStatus()" class="btn btn-success btn-sm" style="position: fixed; right: 3vw;"><span class="glyphicon glyphicon-saved"></span>Save and Proceed to Center of Gravity</button>
                        <button type="button" onclick="printHiddenMap()" class="btn btn-default btn-sm"  style="position: fixed; right: 21vw;"><span class="glyphicon glyphicon-print"></span> Print Map</button>

                    </div>

                    <div id="data-sources">
                        <div class="col-md-6">
                            <div class="inner-addon right-addon" style=" z-index: 1; position: fixed; height: 7vh; width: 28vw; margin: 1vh 0 0 1vmin; box-shadow: 5px 5px 5px #aaaaaa;">
                                <i class="glyphicon glyphicon-search"></i>
                                <input type="text" name="country" id="search-field" class="form-control" style="width: 28vw;"/>
                            </div>

                            <div class="btn-group" style="z-index: 1; position: fixed; margin: 2vh 0 0 64vw;">
                                <a class="btn btn-md btn-default" data-toggle="tooltip" data-placement="bottom" title="Right-click on marker/s before creating an Entity" onclick="createEntity()"><i class="fa fa-plus" style="color:#009900"></i> Create Entity</a>
                            </div>
                            <!--Area Filter-->
                            <div class="" style="z-index: 1; position: fixed; margin: 73vh 0 0 1vw; width: 18vw;">
                                <input type="range" id="areaRangeInput" name="rangeInput" step="1" min="1" max="8" style="width: 100%; color: #111111">
                                <label id="areaRangeText" style="display: block; text-align: center; font-weight: 700;"/></label>
                            </div>
                            <!--Strength Filter-->
                            <div class="" style="z-index: 1; position: fixed; margin: 3vh 0 0 47vw; width: 15vw;">
                                <input type="range" id="strengthRangeInput" name="rangeInput" step="1" min="1" max="3" style="width: 100%; color: #111111">
                                <label id="strengthRangeText" style="display: block; text-align: center; font-weight: 700;"/></label>
                            </div>
                            <!--Legend-->
                            <ul class="list-inline" style="position: fixed; margin: 79vh 0 0 0;">
                                <li  style="font-weight: 900;"> Legend: </li>
                                <li  style="font-weight: 100;"><i class='fa fa-map-marker fa-lg' style='color:#009900'></i> Selected Marker</li>
                                <li  style="font-weight: 900;"><i class='fa fa-map-marker fa-lg' style='color:#CC0000'></i> Strong Relevance</li>
                                <li  style="font-weight: 500;"><i class='fa fa-map-marker fa-lg' style='color:#FF4500'></i> Moderate Relevance</li>
                                <li  style="font-weight: 100;"><i class='fa fa-map-marker fa-lg' style='color:#E6E600'></i> Weak Relevance</li>
                            </ul>
                            <div id="mission2pco-area-map" style="height: 78vh; width: 74vw; border-style: solid; border-width: 1px; border-color: #D3D3D3; border-radius: 3px;">
                            </div>
                        </div>
                    </div>    
                </div>
            </div>

        </div>



        <!-- Entity Modal -->
        <div class="modal fade" id="entityModal" tabindex="-1" role="dialog" 
             aria-labelledby="entityModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content" >
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="entityModalLabel">
                            Entity
                        </h4>
                    </div>
                    <div class="modal-body scroll" id="view-modal-body" style="overflow: auto; padding-left: 10%; padding-right: 10%;">
                        <label style="width: 20%;">Entity Name: </label> <input type="text" id="entity-name" class="form-box" style="width: 76%"><br><br>
                        <table id="does-uses-table" style="width: 100%;">
                            <tr><td></td><td></td></tr>
                        </table>
                        <table id="excerpt-list">
                            <tr style="border-bottom: solid 1px #D3D3D3;"><td><label>Excerpts Selected: </label></td></tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onclick="saveEntity()"> 
                            <span class="glyphicon glyphicon-saved"> </span> Create Entity
                        </button>
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">Close
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <!-- CRCV Modal -->
        <div class="modal fade" id="crcvModal" tabindex="-1" role="dialog" 
             aria-labelledby="crcvModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content" >
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="entityModalLabel">
                            Entity Vulnerability
                        </h4>
                    </div>
                    <div class="modal-body scroll" id="cr-cv-body" style="overflow: auto; padding-left: 10%; padding-right: 10%;">
                        <table id="cr-cv-table">
                            <tr>
                                <th width="50%">Critical Requirement</th>
                                <th widhth="50%" style="text-align: center;">Vulnerable to Neutralize/Attack?</th>
                            </tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onclick="saveCrCv()"> 
                            <span class="glyphicon glyphicon-saved"> </span> Save Critical Vulnerabilities
                        </button>
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">Close
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <!-- Keyword Modal -->
        <div class="modal fade" id="keywordModal" tabindex="-1" role="dialog" 
             aria-labelledby="keywordModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content" >
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="entityModalLabel">
                            Characteristics Overlay
                        </h4>
                    </div>
                    <div class="modal-body scroll" id="keyword-body" style="overflow: auto; padding-left: 10%; padding-right: 10%;">
                        You have not used all your Keywords for searching. Would you still like to proceed to Center of Gravity Analysis?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onclick="savePCO()" data-dismiss="modal"> 
                            <span class="glyphicon glyphicon-saved"> </span> Proceed
                        </button>
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">Cancel
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <!-- Reset Modal -->
        <div class="modal fade" id="resetModal" tabindex="-1" role="dialog" 
             aria-labelledby="resetModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content" >
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="entityModalLabel">
                            Reset Mission Status
                        </h4>
                    </div>
                    <div class="modal-body" id="view-modal-body" style="overflow: auto; padding-left: 10%; padding-right: 10%;">
                        <label>Making changes on this phase would mean that your mission data will be reset on all other phases. Would you like to proceed? </label> 
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning"
                                data-dismiss="modal" onclick="assignCrCv()">Confirm
                        </button>
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">Cancel
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <!-- Center of Gravity Modal -->
        <div class="modal fade" id="cogModal" tabindex="-1" role="dialog" 
             aria-labelledby="cogModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content" >
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="entityModalLabel">
                            Multiple Centers of Gravity
                        </h4>
                    </div>
                    <div class="modal-body" id="cog-select" style="overflow: auto; padding-left: 10%; padding-right: 10%; min-height: 30vh;">
                        <label>Please select Center of Gravity for this Mission 
                        </label> 

                        <div id="cog-select-div">
                            
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success"
                                data-dismiss="modal" onclick="setMissionCOG()">Confirm
                        </button>
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">Cancel
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <!--Sliding Side Bar Menu-->
        <div id="slidingmenu" style="width: 22vw;">
            <div style="border: solid 1px #D3D3D3; border-radius: 5px; padding-left: 1vw; padding-right: 1vw; margin: 10px 10px 10px 10px; background-color: rgba(250,250,250,1);">
                <h4 style="font-size: 1.2vw; font-weight: 600; ">Mission Keywords</h4>
                <h5>Used Keywords</h5>
                <input id="used-keyword" type="text" data-role="tagsinput" class="form-box used" disabled style="padding-right: 1vw;">
                <h5>Unused Keywords</h5>
                <input id="unused-keyword" type="text" data-role="tagsinput" class="form-box unused" disabled style="padding-right: 1vw;">
            </div>
            <h5 style="text-align: center;"><b>Mission Entities</b></h5>
            <div class="panel-group" id="accordion" style="margin: 10px 10px 10px 10px; ">

            </div>

        </div>

        <!--/Sliding Side Bar Menu-->

        <script src="js/BootSideMenu.js"></script>

        <script type="text/javascript">
                                    $('#slidingmenu').BootSideMenu({side: "left"});
        </script>
        <script type="text/javascript">

            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-36251023-1']);
            _gaq.push(['_setDomainName', 'jqueryscript.net']);
            _gaq.push(['_trackPageview']);

            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();

        </script>

        <!--Notification Alert-->
        <div class="alert-messages text-center">
        </div>
    </body>
</html>