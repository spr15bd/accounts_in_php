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
			{{message}}
			<div class="container-fluid">
				<div class="row bg-dark">
					<div class="col-lg-12>
						<nav class="white" z-depth-3>
							<div class="container">
								
								<p class="text-center text-light display-5 p-8">
									An accounting system
									
									
									
								</p>
								<div class="col-lg-3">
						<button class="btn btn-info" @click="supplierReview=true">
							Supplier Review
						</button>
					</div>
					<div class="col-lg-3">
						<button class="btn btn-info" @click="supplierReview=false">
							Add invoice
						</button>
					</div>
							</div>

						</nav>
					</div>
				</div>
			</div>
			
		