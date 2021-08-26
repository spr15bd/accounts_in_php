<?php
	$content = "";
	// connect to database
	$conn = mysqli_connect('localhost', 'root', '', 'accounts');
	
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	} else {
		//if (isset($_GET["view"])&&htmlspecialchars($_GET["view"])=="supplier_review") {
			// display a textbox enabling user to select a supplier
			
			$content.=("
				
			");
				
			
			
		//}
	}
?>


<!doctype html>


<?php
include('templates/header.php');
include('templates/footer.php');
?>
<div v-if='supplierReview'>
	<div v-if='supplierReview'>
		<form class='white' action='index.php?view=supplier_review' method='POST'>
			<label>Supplier name:</label>
			<input type='text' name='supplier'>
		</form>
	</div>
</div> 

<div v-if="supplier_review">


<?php
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
			<table class="table table-striped">
				<thead>
				<div class="text-center"><b><?php echo htmlspecialchars($_POST["supplier"])?></b></div>
				<tr class="bg-info">
					
					<th>Invoice Number</th>
					<th>Reference</th>
					<th>Invoice Date</th>
					<th>Description</th>
					<th>Total</td>
					<th>Outstanding</th>
					<th>Payment Date</th>
				</tr>
				</thead>
<?php
			foreach ($invoices as $invoice) {
?>
				
				<tr>
					
					<td><?php echo $invoice["number"]?></td>
					<td><?php echo $invoice["id"]?></td>
					<td><?php echo $invoice["date"]?></td>
					<td><?php echo $invoice["description"]?></td>
					<td><?php echo "£".number_format($invoice["amount"], 2)?></td>
					<td><?php echo "£".number_format($invoice["amount"], 2)?></td>
					<td></td>
				</tr>
<?php		
			}
?>
			</table>
<?php
		}
?>
</div>

</div>	

<?php	

	// close connection
	mysqli_close($conn);
	
}
?>


</html>