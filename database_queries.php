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
        //echo "Successful connection.";
        echo ("GOT ".$data['info']);
		if (isset($_GET['supplier'])) {
            //echo "Successful connection and input is populated.";
			// perform a SELECT sql query - make the query and get result
            $result = $data;
            echo ("GOT ".$data);
			$supplier = htmlspecialchars($_GET["supplierName"]);
			$sql_query = $conn->query("SELECT * FROM invoices WHERE supplier='$supplier'");
            $invoices = array();
            while ($row=$sql_query->fetch_assoc()){
                array_push($invoices, $row);
            }
            $result['invoices'] = $invoices;
           
            
				
				
			
			
        } else {
            $data = json_decode(file_get_contents("php://input"),true);
            $result = $data['info'];
            $sql_query = $conn->query("INSERT INTO invoices (supplier, number, date, description, office, overhead, amount) VALUES ('".$result['supplier']."','".$result['invoiceNumber']."','".$result['invoiceDate']."','".$result['invoiceDescription']."','".$result['office']."','".$result['overhead']."','".$result['invoiceAmount']."')");
            if ($sql_query) {
                echo "success";
            } else {
                echo "failure";
            }
            
            
            
        }
	}



?>