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
        
		if (isset($items['data'])) {
            if (isset($items['data']['supplierName'])) {
                if ($items['data']['supplierName']==='all') {
                    $query = "SELECT * FROM invoices";
                } else {
                    //var_dump("supplier: ".$items['data']['supplierName']);
                    $str = implode(" ", $items['data']);
                    $query = "SELECT i.id, i.supplier, i.date, i.number, i.description, i.office, i.overhead, i.amount, p.paidid, p.amount as paidAmount FROM invoices i ";
                    $query .="LEFT JOIN paid p ON p.id = i.id ";
                    $query .="WHERE supplier='".$str."'";
                    $query = str_replace("'s", "s", $query);
                    //var_dump("Query: ".$query);
                }
                $sql_query = $conn->query($query);
                $invoices = array();
                while ($row=$sql_query->fetch_assoc()){// changed from fetch_assoc
                    array_push($invoices, $row);
                }
                echo json_encode($invoices);
            } else {
                $query="";
                //var_dump("items[data][paid]: " . $items['data']['paid'][0]['idx']);
                
                foreach ($items['data']['paid'] as $paidInvoice) {
                    $query = "INSERT INTO paid (id, amount) VALUES (".$paidInvoice['idx'].", '".$paidInvoice['amount']."');";
                    $sql_query = $conn->query($query);
                    if ($sql_query) {
                    echo "success after running insert into paid table database_queries";
                    } else {
                        echo "failure";
                    }
                }
                echo $query;
            }
        } else if (isset($items)) {
            if (isset($items['info'])) {
                if (isset($items['info']['supplier'])) {
                    $result = $items['info'];
                    $query = "INSERT INTO invoices (supplier, number, date, description, office, overhead, amount) VALUES ('".$result['supplier']."','".$result['invoiceNumber']."','".$result['invoiceDate']."','".$result['invoiceDescription']."','".$result['office']."','".$result['overhead']."','".$result['invoiceAmount']."')";
                    echo $query;
                    $sql_query = $conn->query($query);
                    if ($sql_query) {
                        echo "success after invoice insert in database_queries";
                    } else {
                        echo "failure";
                    }
                }
            } else if ($items['id']) {
                $str = implode(" ", $items['id']);
                $query = "SELECT * FROM paid WHERE id='".$str."'";
                
                $sql_query = $conn->query($query);
                
                $row=$sql_query->fetch_assoc();
                
                echo json_encode($row);
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