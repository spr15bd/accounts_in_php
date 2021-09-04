<?php
	// connect to database
	$conn = mysqli_connect('localhost', 'root', '', 'accounts');
	
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	} else {
		if (isset($_GET["supplier"])) {
			// perform a SELECT sql query
			
			$supplier = htmlspecialchars($_GET["supplier"]);
			$sql_query = "SELECT * FROM invoices WHERE supplier='$supplier'";

			// make the query and get result
			$result = mysqli_query($conn, $sql_query);

			// fetch the resulting query as an associative array
			if ($result) {
				$invoices = mysqli_fetch_all($result, MYSQLI_ASSOC);
				// free result from memory
				mysqli_free_result($result); 	
				
			
			}
		]
	}
?>