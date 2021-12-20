const app = Vue.createApp({
    

                    data() {
                        return {
                            supplierReview: false,
                            addInvoice: false,
                            suppl: "Ulreco",
                            invoices: null,
                            supplier: null,
                            invoiceNumber: null,
                            invoiceDate: null,
                            invoiceDescription: null,
                            office: null,
                            overhead: null,
                            invoiceAmount: null,
                            statusMessage: null
                        }
                    },
                    methods: {
                        async getSupplier(supplier) {
                            console.log("getting supplier data for "+supplier);
                        let payload = { info: { supplierName: supplier } }
                            const res = await axios.get("database_queries.php", payload )
                            const {results} = res
                            console.log("app.js:  got database_queries.php", res);   
                            
                                console.log("vue:  Success getting database_queries response")
                                this.invoices =  res.data
                                //console.log("Result is "+this.invoices)
                                //for(let property in this.invoices) {
                                //    console.log(property + "=" + this.invoices[property])
                                //    console.log(this.invoices)
                                //}                                                    
                        },
                        async update() {
                            console.log("updating ", this.supplier, this.invoiceNumber, this.invoiceDate, this.invoiceDescription, this.office, this.overhead, this.invoiceAmount)
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                            console.log("app.js:  got database_queries.php: ", res);   
                        }
                    }
})

app.mount('#app')