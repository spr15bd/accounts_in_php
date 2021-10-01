<?php
	// connect to database
    //echo "database_queries: Connecting to db";
	$conn = new mysqli('localhost', 'root', '', 'accounts');
	$result = array;//('error'=>false);
	// check connection
	if (!$conn) {
		//echo "Conection error: " . mysqli_connect_error();
	} else {
        //echo "Successful connection.";
		if (isset($_POST["supplier"])) {
            //echo "Successful connection and input is populated.";
			// perform a SELECT sql query - make the query and get result
			$supplier = htmlspecialchars($_POST["supplier"]);
			$sql_query = $conn->query("SELECT * FROM invoices WHERE supplier='$supplier'");
            $invoices = array();
            while ($row=$sql_query->fetch_assoc()){
                array_push($invoices, $row);
            }
            $result['invoices'] = $invoices;
           
            echo $invoices;
				
				
			
			
        }
	}



?>