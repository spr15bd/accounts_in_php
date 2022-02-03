<?php
    function varDumpToString($var) {
      ob_start();
      var_dump($var);
      $result = ob_get_clean();
      return $result;
   }


    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
	// connect to database
	$conn = new mysqli('localhost', 'root', '', 'accounts');
	$result = array();//('error'=>false);
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	} else {
        $data = json_decode(file_get_contents('php://input'),true);
		if ($data['data']['supplierName']) {
			// perform a SELECT sql query - make the query and get result
            
            $result = $data['data']['supplierName'];
            $query = "SELECT * FROM invoices WHERE supplier='".$result."'";
			//$supplier = htmlspecialchars($_GET["supplierName"]);
			$sql_query = $conn->query($query);
            $invoices = array();
            while ($row=$sql_query->fetch_assoc()){
                array_push($invoices, $row);
            }
            
            echo json_encode($invoices);
        } else if ($data['info']['supplier']) {
            $result = $data['info'];
            $query = "INSERT INTO invoices (supplier, number, date, description, office, overhead, amount) VALUES ('".$result['supplier']."','".$result['invoiceNumber']."','".$result['invoiceDate']."','".$result['invoiceDescription']."','".$result['office']."','".$result['overhead']."','".$result['invoiceAmount']."')";
            echo $query;
            $sql_query = $conn->query($query);
            if ($sql_query) {
                echo "success after running else in database_queries";
            } else {
                echo "failure";
            }
        } else {
            $result = $data['data']['supplierName'];
            echo "result is ".$data;
            $query = "SELECT * FROM invoices WHERE supplier='".$result."' AND paid='true'";
            $sql_query = $conn->query($query);
            $invoices = array();
            while ($row=$sql_query->fetch_assoc()){
                array_push($invoices, $row);
            }
            echo json_encode($sql_query);
        }
        
	}
?>