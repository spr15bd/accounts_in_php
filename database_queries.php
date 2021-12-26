<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
	// connect to database
    //echo "database_queries: Connecting to db";
	$conn = new mysqli('localhost', 'root', '', 'accounts');
	$result = array();//('error'=>false);
	// check connection
	if (!$conn) {
		//echo "Conection error: " . mysqli_connect_error();
	} else {
        $data = json_decode(file_get_contents('php://input'),true);
        echo 'data is '.$data['data'];
		if ($data) {
            //echo "Successful connection and input is populated.";
			// perform a SELECT sql query - make the query and get result
            echo $data;
            $result = $data['supplierName'];

			$supplier = htmlspecialchars($_GET["supplierName"]);
			$sql_query = $conn->query("SELECT * FROM invoices WHERE supplier='".$result['supplierName']."'");
            $invoices = array();
            while ($row=$sql_query->fetch_assoc()){
                array_push($invoices, $row);
            }
            //$result['invoices'] = $invoices;
            echo "success! ". $sql_query. $invoices;
           
            
				
				
			
			
        } /*else {
            $result = $data['info'];
            $sql_query = $conn->query("INSERT INTO invoices (supplier, number, date, description, office, overhead, amount) VALUES ('".$result['supplier']."','".$result['invoiceNumber']."','".$result['invoiceDate']."','".$result['invoiceDescription']."','".$result['office']."','".$result['overhead']."','".$result['invoiceAmount']."')");
            if ($sql_query) {
                echo "success after running else in database_queries";
            } else {
                echo "failure";
            }
            
            
            
        }
        */
	}



?>