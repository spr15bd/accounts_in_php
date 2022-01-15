const app = Vue.createApp({
    

                    data() {
                        return {
                            supplierReview: false,
                            addInvoice: false,
                            payments: false,
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
                            console.log("app.js->getSupplier(): getting supplier data for "+supplier)
                            let payload = { data: { supplierName: supplier } }
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        
                            this.invoices =  res.data
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        },
                        async processPayments(supplier) {
                            console.log("app.js->processPayments(): processing payments for "+supplier)
                            console.log("Supplier is", supplier)
                            
                        }
                    }
})

app.mount('#app')