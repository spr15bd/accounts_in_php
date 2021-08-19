<?php
	$errors = ['inv_no'=>'', 'inv_date'=>'', 'inv_desc'=>'', 'office'=>'', 'overhead'=>'', 'inv_amt'=>'', 'inv_supplier'=>''];
	$invoice_number=$invoice_date=$invoice_description=$office=$overhead=$invoice_amount=$invoice_supplier="";
	// connect to database
	$conn = mysqli_connect('localhost', 'root', '', 'accounts');
	
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	}
	if (isset($_POST['submit'])) {
		if (empty($_POST['inv_supplier'])) {
			$errors['inv_supplier'] = "Please enter a supplier name<br/>";
		} else {
			$invoice_supplier = $_POST['inv_supplier'];
			if (!preg_match('/^[a-zA-Z1-9\s]+$/', $invoice_supplier)) {
				$errors['inv_supplier'] = "Supplier name must be letters, numbers and spaces only";
			}
		}
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
		if (empty($_POST['inv_desc'])) {
			$errors['inv_desc'] =  "A description is required<br/>";
		} else {
			$invoice_description = $_POST['inv_desc'];
			
		}
		if (empty($_POST['office'])) {
			$errors['office'] =  "An office is required<br/>";
		} else {
			$office = $_POST['office'];
			
		}
		if (empty($_POST['overhead'])) {
			$errors['overhead'] =  "An overhead code is required<br/>";
		} else {
			$overhead = $_POST['overhead'];
			
		}
		if (empty($_POST['inv_amt'])) {
			$errors['inv_amt'] = "An invoice amount is required<br/>";
		} else {
			$invoice_amount = $_POST['inv_amt'];
			if (!preg_match('/[0-9\s]+$/', $invoice_amount)) {
				$errors['inv_amt'] = "Invoice amount must be numbers only";
			}
		}
		if (array_filter($errors)) {
			//echo('errors in the form');			
		} else {
			//echo('there are no errors in the form');
			$sql = "INSERT INTO invoices () VALUES ($invoice_supplier, $invoice_number, $invoice_description, $office, $overhead, $invoice_amount)";
			header('Location: add_invoices.php');
		}
	}

?>

<!doctype html>



	<?php include 'templates/header.php';?>
		<section class="container grey-text">
			<h4 class="center">Add Invoice</h4>
			<form class="white" action="add_invoices.php" method="POST">
				<label>Supplier Name:</label>
				<input type="text" name="supplier" value=<?php echo $invoice_supplier?>>
				<div class="red-text"><?php echo $errors['inv_supplier']; ?></div>
				<label>Invoice Number:</label>
				<input type="text" name="inv_no" value=<?php echo $invoice_number?>>
				<div class="red-text"><?php echo $errors['inv_no']; ?></div>
				<label>Invoice Date:</label>
				<input type="text" name="inv_date" value=<?php echo $invoice_date?>>
				<div class="red-text"><?php echo $errors['inv_date']; ?></div>
				<label>Invoice Description:</label>
				<input type="text" name="inv_desc" value=<?php echo $invoice_description?>>
				<div class="red-text"><?php echo $errors['inv_desc']; ?></div>
				<label>Office:</label>
				<input type="text" name="office" value=<?php echo $office?>>
				<div class="red-text"><?php echo $errors['office']; ?></div>
				<label>Overhead:</label>
				<input type="text" name="overhead" value=<?php echo $overhead?>>
				<div class="red-text"><?php echo $errors['overhead']; ?></div>
				<label>Invoice Amount:</label>
				<input type="text" name="inv_amt" value=<?php echo $invoice_amount?>>
				<div class="red-text"><?php echo $errors['inv_amt']; ?></div>
				<div class="center">
					<input type="submit" name="submit" value="submit" class="btn brand z-depth-0">
				</div>
			</form>
		</section>
	<?php include 'templates/footer.php';?>

</html>
