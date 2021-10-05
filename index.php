<?php
include('templates/header.php');
?>

<body class="grey lighten-2">
   
		<div id="app">
			
			<div class="container-fluid">
				<div class="row bg-dark">
					<div class="col-lg-12">
						<nav class="white">
							<div>
								
								<p class="text-center text-light display-5 p-8">
									An accounting system
									{{this.message}}
									
									
								</p>
							</div>
							<div class="btn-group" role="group">
								<div class="col-lg-6">
									<button class="btn btn-info" @click="supplierReview=true">
										Supplier Review 
									</button>
								</div>
								<div class="col-lg-6">
									<button class="btn btn-info" @click="supplierReview=false">
										Add invoice
									</button>
								</div>
							</div>

						</nav>
					</div>
				</div>
				<div class="row" v-if="supplierReview">
					<p class="text-center py-5">
                        
                            <label>Supplier Name:</label>
                            <input type="text" name="supplier" @keyup.enter="getSupplier(suppl)" v-model="suppl"></input>
                            <button class="btn btn-info" @click="getSupplier(suppl)">
				                Supplier Review 
							</button>
                        
                    </p>
				</div>
				
			</div>
			
<?php
include('templates/footer.php');
?>

{{this.message}}
<div v-if="suppl">


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
                            suppl: 'None',
                            invoices: []
                        }

                    },
                    methods: {
                        getSupplier(supplier) {
                            console.log("getting supplier data for "+supplier);                         
                            axios.get("database_queries.php", { params: { supplierName: supplier } }).then(function(response){
                                console.log("index.php:  got database_queries.php");   
                                if (response.data.error) {
                                    app.errorMsg = response.data.message;  
                                    
                                    console.log("error");            
                                } else {
                                    console.log("vue:  Success getting database_queries response");
                                    app.invoices = JSON.stringify(response);   
                                    console.log("Result is "+app.invoices);                 
                                }                                                     
                            });            
                        }             
                                            
                    }
                })
                app.mount('#app')
            </script>
</body>

</html>