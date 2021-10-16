let app = Vue.createApp({
                    data: function() {
                        return {                                    
                            errorMsg: 'yo',                                                                
                            supplierReview: false,
                            suppl: null,
                            invoices: []
                        }
                    },
                    methods: {
                        getSupplier(supplier) {
                            console.log("getting supplier data for "+supplier);                         
                            axios.get("database_queries.php", { params: { supplierName: supplier } }).then(function(response){
                                console.log("index.php:  got database_queries.php");   
                                if (response.data.error) {
                                    app.errorMsg = response.data.message 
                                    
                                    console.log("error")            
                                } else {
                                    console.log("vue:  Success getting database_queries response")
                                    invoices = JSON.stringify(response.data);   
                                    console.log("Result is "+this.invoices)
                                    for(let property in this.invoices[0]) {
                                        console.log(property + "=" + this.invoices[0][property])
                                    }
                                }                                                     
                            })         
                        }             
                                            
                    }
                })
                app.mount('#app')
</script>