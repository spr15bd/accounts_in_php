<?php
include('templates/header.php');
?>

<?php
include('templates/footer.php');
?>


<div v-if="suppl">
{{suppl}}

<?php	
	
    //if ($invoices && count($invoices) > 0) {
?>

			<table class="table table-striped">
				<thead>
				<div class="text-center"><b><?php //echo suppl?></b></div>
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
			//foreach ($invoices as $invoice) {
?>
				
				<tr>
					
					<td><?php //echo $invoice["number"]?></td>
					<td><?php //echo $invoice["id"]?></td>
					<td><?php //echo $invoice["date"]?></td>
					<td><?php //echo $invoice["description"]?></td>
					<td><?php //echo "£".number_format($invoice["amount"], 2)?></td>
					<td><?php //echo "£".number_format($invoice["amount"], 2)?></td>
					<td></td>
				</tr>
                
<?php		
			//}
?>
			</table>
<?php
		//}
?>
</div>



<?php	

	// close connection
	
?>
<script src="https://unpkg.com/vue@next"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.4/axios.min.js"></script>
            
			<script>
                let app = Vue.createApp({
                    data: function() {
                        return {                                    
                            errorMsg: '',                                                                
                            supplierReview: false,
                            message: 'Hello vue!',
                            //suppl: 'None',
                            invoices: []
                        }

                    },
                    methods: {
                        getSupplier() {
                            console.log("getting supplier data");                         
                            axios.get("database_queries.php").then(function(response){
                                console.log("index.php:  got database_queries.php");   
                                if (response.data.error) {
                                    app.errorMsg = response.data.message;  
                                    
                                    console.log("error");            
                                } else {
                                    console.log("index.php:  Success getting database_queries response");
                                    app.invoices = response.data;   
                                    console.log(app.invoices);                 
                                }                                                     
                            });            
                        }             
                                            
                    }
                })
                app.mount('#app')
            </script>
</body>

</html>