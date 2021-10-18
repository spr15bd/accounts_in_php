const app = Vue.createApp({
    

                    data() {
                        return {
                            errorMsg: 'yo',                                                                
                            supplierReview: false,
                            suppl: "Ulreco",
                            invoices: null
                        }
                    },
                    methods: {
                        async getSupplier(supplier) {
                            console.log("getting supplier data for "+supplier);                         
                            const res = await axios.get("database_queries.php", { params: { supplierName: supplier } })
                            const {results} = await res.json()
                            console.log("index.php:  got database_queries.php"+res);   
                            
                                console.log("vue:  Success getting database_queries response")
                                this.invoices =  {results}.data
                                console.log("Result is "+this.invoices)
                                for(let property in this.invoices) {
                                    console.log(property + "=" + this.invoices[property])
                                    console.log(this.invoices)
                                }                                                    
                                  
                        }             
                    }
})

app.mount('#app')