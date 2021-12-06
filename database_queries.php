<?php
	// connect to database
    //echo "database_queries: Connecting to db";
	$conn = new mysqli('localhost', 'root', '', 'accounts');
	$result = array();//('error'=>false);
	// check connection
	if (!$conn) {
		//echo "Conection error: " . mysqli_connect_error();
	} else {
        //echo "Successful connection.";
		if (isset($_GET["supplier"])) {
            //echo "Successful connection and input is populated.";
			// perform a SELECT sql query - make the query and get result
			$supplier = htmlspecialchars($_GET["supplierName"]);
			$sql_query = $conn->query("SELECT * FROM invoices WHERE supplier='$supplier'");
            $invoices = array();
            while ($row=$sql_query->fetch_assoc()){
                array_push($invoices, $row);
            }
            $result['invoices'] = $invoices;
           
            echo json_encode($invoices);
				
				
			
			
        } else {
            $vars = $_POST['data1'];
            $sql_query = $conn->query("INSERT INTO invoices (supplier, number, date, description, office, overhead, amount)VALUES ('".$vars."','1234','2021-11-23','Stationery','Holwich','7580','30.00')");
            if ($sql_query) {
                $_POST = json_decode(file_get_contents("php://input"),true);
                echo "success".$_POST["data1"];
            } else {
                echo "failure";
            }
            
            
            
        }
	}



?>