<?php
	
	if (isset($_POST['submit'])) {
		if (empty($_POST['inv_no'])) {
			echo "An invoice number is required<br/>";
		} else {
			$invoice_number = $_POST['inv_no'];
			if (!preg_match('/^[a-zA-Z1-9\s]+$/', $invoice_number)) {
				echo "invoice number must be letters, numbers and spaces only";
			}
		}
		if (empty($_POST['inv_date'])) {
			echo "An invoice date is required<br/>";
		} else {
			$invoice_date = $_POST['inv_date'];
			
		}
		if (empty($_POST['inv_net'])) {
			echo "An invoice amount is required<br/>";
		} else {
			$invoice_net_amount = $_POST['inv_net'];
			if (!preg_match('/^[1-9\s]+$/', $invoice_net_amount)) {
				echo "invoice number must be numbers only";
			}
		}
	}

?>

<!doctype html>
<html>


	<?php include('templates/header.php'); ?>
		<section class="container grey-text">
			<h4 class="center">Add Invoice</h4>
			<form class="white" action="add_invoices.php" method="POST">
				<label>Invoice Number:</label>
				<input type="text" name="inv_no">
				<label>Invoice Date:</label>
				<input type="text" name="inv_date">
				<label>Invoice Net Amount:</label>
				<input type="text" name="inv_net">
				<div class="center">
					<input type="submit" name="submit" value="submit" class="btn brand z-depth-0">
				</div>
			</form>
		</section>
	<?php include('templates/footer.php'); ?>

</html>