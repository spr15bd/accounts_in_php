<?php
	$errors = ['inv_no'=>'', 'inv_date'=>'', 'overhead'=>'', 'inv_net'=>''];
	$invoice_number=$invoice_date=$overhead=$invoice_net_amount="";
	if (isset($_POST['submit'])) {
		if (empty($_POST['inv_no'])) {
			$errors['inv_no'] = "An invoice number is required<br/>";
		} else {
			$invoice_number = $_POST['inv_no'];
			if (!preg_match('/^[a-zA-Z1-9\s]+$/', $invoice_number)) {
				$errors['inv_no'] = "invoice number must be letters, numbers and spaces only";
			}
		}
		if (empty($_POST['inv_date'])) {
			$errors['inv_date'] = "An invoice date is required<br/>";
		} else {
			$invoice_date = $_POST['inv_date'];
			
		}
		if (empty($_POST['overhead'])) {
			$errors['overhead'] =  "An overhead code is required<br/>";
		} else {
			$overhead = $_POST['overhead'];
			
		}
		if (empty($_POST['inv_net'])) {
			$errors['inv_net'] = "An invoice amount is required<br/>";
		} else {
			$invoice_net_amount = $_POST['inv_net'];
			if (!preg_match('/[0-9\s]+$/', $invoice_net_amount)) {
				$errors['inv_net'] = "invoice amount must be numbers only";
			}
		}
		if (array_filter($errors)) {
			//echo('errors in the form');			
		} else {
			//echo('there are no errors in the form');
			
			header('Location: index.php');
		}
	}

?>

<!doctype html>



	<?php include 'templates/header.php';?>
		<section class="container grey-text">
			<h4 class="center">Add Invoice</h4>
			<form class="white" action="add_invoices.php" method="POST">
				<label>Invoice Number:</label>
				<input type="text" name="inv_no" value=<?php echo $invoice_number?>>
				<div class="red-text"><?php echo $errors['inv_no']; ?></div>
				<label>Invoice Date:</label>
				<input type="text" name="inv_date" value=<?php echo $invoice_date?>>
				<div class="red-text"><?php echo $errors['inv_date']; ?></div>
				<label>Overhead:</label>
				<input type="text" name="overhead" value=<?php echo $overhead?>>
				<div class="red-text"><?php echo $errors['overhead']; ?></div>
				<label>Invoice Net Amount:</label>
				<input type="text" name="inv_net" value=<?php echo $invoice_net_amount?>>
				<div class="red-text"><?php echo $errors['inv_net']; ?></div>
				<div class="center">
					<input type="submit" name="submit" value="submit" class="btn brand z-depth-0">
				</div>
			</form>
		</section>
	<?php include 'templates/footer.php';?>

</html>
