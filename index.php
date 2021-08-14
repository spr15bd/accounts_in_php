<?php
	// connect to database
	$conn = mysqli_connect('localhost', '', '', 'accounts');
	
	// check connection
	if (!$conn) {
		echo "Conection error: " . mysqli_connect_error();
	}

?>


<!doctype html>


<?php
include('templates/header.php');
include('templates/footer.php');

?>

</html>