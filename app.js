const app = Vue.createApp({
    

                    data() {
                        return {
                            supplierReview: false,
                            addInvoice: false,
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
                            console.log("app.js->getting supplier data for "+supplier);
                            let payload = { data: { supplierName: supplier } }
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        
                            this.invoices =  res.data
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        }
                    }
})

app.mount('#app')