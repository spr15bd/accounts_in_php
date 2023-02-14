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
	$result = array();
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	} else {
        $items = json_decode(file_get_contents('php://input'), true);
        
		if ($items['data']) {
            if ($items['data']['supplierName']) {
                $str = implode(" ", $items['data']);
                echo $str;
                if ($str==='all') {
                    $query = "SELECT * FROM invoices";
                } else {
                    $query = "SELECT * FROM invoices WHERE supplier='".$str."'";
                }
                $sql_query = $conn->query($query);
                $invoices = array();
                while ($row=$sql_query->fetch_assoc()){
                    array_push($invoices, $row);
                }

                echo json_encode($invoices);
            } else {
                echo $items['data'];
            }
            
        } else if ($items) {
            if ($items['info']) {
                if ($items['info']['supplier']) {
                    $result = $items['info'];
                    $query = "INSERT INTO invoices (supplier, number, date, description, office, overhead, amount) VALUES ('".$result['supplier']."','".$result['invoiceNumber']."','".$result['invoiceDate']."','".$result['invoiceDescription']."','".$result['office']."','".$result['overhead']."','".$result['invoiceAmount']."')";
                    echo $query;
                    $sql_query = $conn->query($query);
                    if ($sql_query) {
                        echo "success after running else in database_queries";
                    } else {
                        echo "failure";
                    }
                }
            }
        } else {
            $str = implode(" ", $items['data']);
            $query = "SELECT number, date, amount, paid FROM invoices WHERE supplier='".$str."' AND paid='true'";
            $sql_query = $conn->query($query);
            $invoices = array();
            while ($row=$sql_query->fetch_assoc()){
                array_push($invoices, $row);
            }
            echo json_encode($invoices);
        }
        
	}
?>