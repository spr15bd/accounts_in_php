<?php
	// connect to database
	$conn = mysqli_connect('localhost', 'root', '', 'accounts');
	
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	} else {
		if (isset($_GET["view"])&&htmlspecialchars($_GET["view"])=="supplier_review") {
			// write query for all invoices
			$sql_query = "SELECT * FROM invoices";

			// make the query and get result
			$result = mysqli_query($conn, $sql_query);

			// fetch the resulting query as an associative array
			$invoices = mysqli_fetch_all($result, MYSQLI_ASSOC);

			// free result from memory
			mysqli_free_result($result);

			// close connection
			mysqli_close($conn);
			print_r($invoices);
		}
	}
?>


<!doctype html>


<?php
include('templates/header.php');
include('templates/footer.php');

?>

</html>