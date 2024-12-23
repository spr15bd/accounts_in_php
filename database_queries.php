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
                    			// Show all invoices
                    			$query = "SELECT * FROM invoices";
                		} else {
                    			// Show all invoices for a chosen supplier
                    			$str = implode(" ", $items['data']);
					// TODO ADD DATE COLUMN TO PAID TABLE
                    			$query = "SELECT i.id, i.supplier, i.date, i.number, i.description, i.office, i.overhead, i.amount, p.paidid, p.amount as paidAmount, p.date as paidDate FROM invoices i ";
			                $query .="LEFT JOIN paid p ON p.id = i.id ";
			        	$query .="WHERE supplier='".$str."'";
			                $query = str_replace("'s", "s", $query);
			        }
			        $sql_query = $conn->query($query);
			        $invoices = array();
			        while ($row=$sql_query->fetch_assoc()){
			                array_push($invoices, $row);
			        }
			        echo json_encode($invoices);
            		} else if (isset($items['data']['supplierNames'])) {
				$query = "SELECT DISTINCT(supplier) FROM invoices";
				$sql_query = $conn->query($query);
		            	$supplierNames = array();
		            	while ($row=$sql_query->fetch_assoc()){
		                	array_push($supplierNames, $row['supplier']);
		            	}
		            	echo json_encode($supplierNames);
	    		} else {
                		// Pay invoices
                		foreach ($items['data']['paid'] as $paidInvoice) {
                    			$query = "SELECT COUNT(*) FROM paid WHERE id = ".$paidInvoice['idx'];
                    			$sql_query = $conn->query($query);
                    			$rows=$sql_query->fetch_row();
                    			$duplicateCount = $rows[0];
                    			if ($duplicateCount > 0) {
                        			echo "Cannot process payment - inv already paid: ".$paidInvoice['invNo'].@" ( ". $paidInvoice['supplier'] ." )";
                    			} else {
                        			$query = "INSERT INTO paid (id, amount, date) VALUES (".$paidInvoice['idx'].", '".$paidInvoice['amount']."', '".$items['data']['paymentDate']."');";
                        			$sql_query = $conn->query($query);
                        			if ($sql_query) {
                        				echo "Payment Allocated: ". $query;
                        			} else {
                            				echo "failure: ", $query;
                        			}
                    			}  
                		}
            		}
       		 } else if (isset($items)) {
            		if (isset($items['info'])) {
                		// Create a new invoice
                		if (isset($items['info']['supplier'])) {
                    			$result = $items['info'];
                    			$query = "INSERT INTO invoices (supplier, number, date, description, office, overhead, amount)
		       			VALUES (
	    					'".$result['supplier']."',
	  					'".$result['invoiceNumber']."',
						'".$result['invoiceDate']."',
      						'".$result['invoiceDescription']."',
	    					'".$result['office']."',
	  					'".$result['overhead']."',
						'".$result['invoiceAmount']."'
      					)";
                    			$sql_query = $conn->query($query);
                    			if ($sql_query) {
                        			echo "success after invoice insert in database_queries.";
                    			} else {
                        			echo "failure after attempted invoice insert in database_queries.";
                    			}
                		}
            		} else if (isset($items['id'])) {
                		$str = implode(" ", $items['id']);
                		$query = "SELECT * FROM paid WHERE id='".$str."'";
                		$sql_query = $conn->query($query);
                		$row=$sql_query->fetch_assoc();
                
                		echo json_encode($row);
            		} else if (isset($items['invData'])) {
				$query = "UPDATE invoices SET 
					number = ".$items['invData']['number'].",
					date = '".$items['invData']['date']."',
					description = '".$items['invData']['description']."', 
					office = '".$items['invData']['office']."',
					overhead = ".$items['invData']['overhead'].",
					amount = ".$items['invData']['amount']."
					WHERE id = ".$items['invData']['id'];
				$sql_query = $conn->query($query);
                		if ($sql_query) {
                			echo "Success after invoice insert in database_queries.";
                		} else {
                        		echo "Failure after attempted invoice insert in database_queries.";
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
