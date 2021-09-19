<?php
	// connect to database
    echo "Connecting to db";
	$conn = mysqli_connect('localhost', 'root', '', 'accounts');
	
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	} else {
        echo "Successful connection.";
		if (isset($_POST["supplier"])) {
            echo "Successful connection and input is populated.";
			// perform a SELECT sql query
			
			$supplier = htmlspecialchars($_POST["supplier"]);
			$sql_query = "SELECT * FROM invoices WHERE supplier='$supplier'";
            $invoices = array();
            echo $sql_query;
			// make the query and get result
			
                
            $invoices = mysqli_query($conn, $sql_query);

			// fetch the resulting query as an associative array
			if ($invoices) {
				$result['invoices'] = mysqli_fetch_all($invoices, MYSQLI_ASSOC);
                echo json_encode($result);
				// free result from memory
				//mysqli_free_result($result); 	
				
			
			}
        }
	}



?>