<?php
	$content = "";
	// connect to database
	$conn = mysqli_connect('localhost', 'root', '', 'accounts');
	
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	} else {
		if (isset($_GET["view"])&&htmlspecialchars($_GET["view"])=="supplier_review") {
			// display a textbox enabling user to select a supplier
			
			$content.=("
				<form class='white' action='index.php?view=supplier_review' method='POST'>
					<label>Supplier name:</label>
					<input type='text' name='supplier'>
				</form>
			");
				
			
			
		}
	}
?>


<!doctype html>


<?php
include('templates/header.php');
include('templates/footer.php');

echo $content; 
if (isset($_POST["supplier"])) {
	

	// write query for all invoices
	$sql_query = "SELECT * FROM invoices WHERE supplier='".htmlspecialchars($_POST["supplier"])."'";

	// make the query and get result
	$result = mysqli_query($conn, $sql_query);

	// fetch the resulting query as an associative array
	if ($result) {
		$invoices = mysqli_fetch_all($result, MYSQLI_ASSOC);
		// free result from memory
		mysqli_free_result($result);
		if (count($invoices) > 0) {
?>
			<table><th><?php echo htmlspecialchars($_POST["supplier"])?></th>
				<tr>
					
					<td>Invoice Number</td>
					<td>Reference</td>
					<td>Invoice Date</td>
					<td>Description</td>
					<td>Total</td>
				</tr>
<?php
			foreach ($invoices as $invoice) {
?>
				
				<tr>
					
					<td><?php echo $invoice["number"]?></td>
					<td><?php echo $invoice["id"]?></td>
					<td><?php echo $invoice["date"]?></td>
					<td><?php echo $invoice["description"]?></td>
					<td><?php echo "£".number_format($invoice["amount"], 2)?></td>
				</tr>
<?php		
			}
?>
			</table>
<?php
		}
	}
	

	

	// close connection
	mysqli_close($conn);
	
}
?>


</html>