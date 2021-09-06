<head>
	<title>Accounts System</title>
	<!--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">-->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	
	
	<style type="text/css">
		.brand{
			background: #adbbec;
		}
		.brand-text{
			color: #aabbec !important;
		}
		form{
			max-width: 460px;
			margin: 20px auto;	
			padding: 20px;		
		}
	</style>
</head>
	<body class="grey lighten-2">
		<div id="app">
			
			
			<div class="container-fluid">
				<div class="row bg-dark">
					<div class="col-lg-12>
						<nav class="white" z-depth-3>
							<div>
								
								<p class="text-center text-light display-5 p-8">
									An accounting system
									
									
									
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
                        <form class="white" action="database_queries.php?supplier=suppl" method="POST">
                            <label>Supplier Name:</label>
                            <input type="text" name="supplier" v-model="suppl"></input>
                        </form>
				</div>
				<div class="row" v-if="supplierReview">
					<p class="text-center py-5">
					{{suppl}}
				</div>
			</div>
			
				
				
				
			
	
			
			<footer class="section"></footer>
			<div class="center grey-text">Copyright 2021 Bevan Dady</div>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js"></script>
			
            <script>
                var app = new Vue({
                    el: '#app',
                    data: {

                            supplierReview: false,
                            message: 'Hello vue!',
                            suppl: "None"

                    }
                });


            </script>
		</div>
	


		
		

