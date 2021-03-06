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

        <!--Data Table-->
        <link rel="stylesheet" href="https://cdn.datatables.net/1.10.9/css/dataTables.bootstrap.min.css">
        <script src="https://cdn.datatables.net/1.10.9/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.10.9/js/dataTables.bootstrap.min.js"></script>

        <!--Layout-->
        <link href="css/layout.css" rel="stylesheet" type="text/css">
        <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>

        <!--General Scripts-->
        <script src="js/util.js"></script>
        <script  src="js/alert.js"></script>

        <!--Page Script-->
        <script src="encoder/pagescripts/en_home.js"></script>
        <script>
            var userFullName = '<%=session.getAttribute("userFullName")%>';
            var clssJSON = <%=request.getAttribute("clssJSON")%>;
            var table, excerptSummaryTable;
        </script>
    </head>
    <body onload="initialize()">

        <!--Navigation Bar-->
        <script src="js/en_navigation.js"></script>

        <div id="container-fluid">
            <div id="content-shield" style="border-top: none;">
                <div class="col-md-12">
                    <button type="submit" class="btn btn-success btn-sm" data-toggle="modal" data-target="#addSource" style="margin-right: 1vw; margin-bottom: 1vw;"><span class="glyphicon glyphicon-plus"></span> Add New Source</button>
                    <button class="btn btn-default btn-sm" data-toggle="modal" data-target="#viewExcerptSummary" style="margin-right: 1vw; margin-bottom: 1vw;"><span class="glyphicon glyphicon-th-list"></span> View Excerpt Summary</button>
                    <button class="btn btn-default btn-sm" data-toggle="modal" data-target="#findSource" style=" margin-bottom: 1vw;"><span class="glyphicon glyphicon-search"></span> Find Source with Excerpt Number</button>

                    <table id="source-table" class="table table-bordered table-hover list-table" width="100%">
                        <thead style="background-color: #D3D3D3;">
                        <th width="11%">Type</th>
                        <th width="20%">Name</th>
                        <th width="45%">Description</th>
                        <th width="12%">Date Published</th>
                        <th width="12%">Date Encoded</th>
                        </thead>
                        <tbody id="source-table-body">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add Source Modal -->
        <div class="modal fade" id="addSource" tabindex="-1" role="dialog" 
             aria-labelledby="addSourcelabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="myModalLabel">
                            Add New Source
                        </h4>
                    </div>
                    <div class="modal-body">
                        <table style="width: 90%;">
                            <tr>
                                <td><h5>Type: </h5></td>
                                <td><select id="source-type" required class="form-box"></select></td>
                            </tr>
                            <tr>
                                <td><h5>Name: </h5></td>
                                <td><input type="text" id="source-name" required class="form-box" placeholder="Enter Source Name"></td>
                            </tr>
                            <tr>
                                <td><h5>Description: </h5></td>
                                <td><input type="text" id="source-description" class="form-box" required placeholder="Enter Description"></td>
                            </tr>
                            <tr>
                                <td><h5>Date Published: </h5></td>
                                <td><input type="date" id="source-date" class="form-box" required></td>
                            </tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onclick="saveSource()" class="btn btn-success"><span class="glyphicon glyphicon-saved"> </span>
                            Add New Source
                        </button>
                        <button type="button" class="btn btn-default" 
                                data-dismiss="modal">Close
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <!-- Excerpt Summary Modal -->
        <div class="modal fade" id="viewExcerptSummary" tabindex="-1" role="dialog" 
             aria-labelledby="addSourcelabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="myModalLabel">
                            Excerpt Summary
                        </h4>
                    </div>
                    <div class="modal-body">
                        <table id="excerpt-summary-table" class="table table-bordered table-hover list-table">
                            <thead style="background-color: #D3D3D3;">
                            <th width="30%">Island Group</th>
                            <th width="40%">Region</th>
                            <th width="30%">Number of Excerpts</th>
                            </thead>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" 
                                data-dismiss="modal">Close
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>
        
        <!-- Find Source Modal -->
        <div class="modal fade" id="findSource" tabindex="-1" role="dialog" 
             aria-labelledby="findSourcelabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" 
                                data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="myModalLabel">
                            Find Source based on Excerpt Number
                        </h4>
                    </div>
                    <div class="modal-body">
                        Excerpt Number: <input type="number" id="excerpt-id" class="form-box" style="width: 60%;">
                    </div>
                    <div class="modal-footer">
                        <button type="button" onclick="findSource()" class="btn btn-primary"><span class="glyphicon glyphicon-search"> </span>
                            Find Source
                        </button>
                        <button type="button" class="btn btn-default" 
                                data-dismiss="modal">Close
                        </button>

                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal -->
        </div>

        <div class="alert-messages text-center">
        </div>
    </body>
</html>
