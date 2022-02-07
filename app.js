const app = Vue.createApp({
    

                    data() {
                        return {
                            supplierReview: false,
                            totalToPay: 0,
                            addInvoice: false,
                            payments: false,
                            invoices: null,
                            supplier: null,
                            paymentsSupplier: null,
                            invoiceNumber: null,
                            invoiceDate: null,
                            invoiceDescription: null,
                            office: null,
                            overhead: null,
                            invoiceAmount: null,
                            statusMessage: null,
                            paymentProcessing: false,
                            suppl: null
                        }
                    },
                    methods: {
                        async getSupplier() {
                            console.log("app.js->getSupplier(): getting supplier data for ", this.suppl)
                            let payload = { data: { supplierName: this.suppl } }
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        
                            this.invoices =  res.data
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        },
                        async processPayments() {
                            //console.log("app.js->Processing payments")
                            console.log("1 ", this.paymentsSupplier)
                            this.paymentProcessing = true
                            console.log("2 ")
                            let payload = { data: { supplierName: this.paymentsSupplier } }
                            console.log("3 ")
                            const res = await axios.post("database_queries.php", payload )
                            console.log("4 ")
                            const {results} = res
                            console.log("5 ")
                            //console.log("Result ", res.data)
                            this.invoices = res.data
                            console.log("res ", res.config, "invoices ", this.invoices)
                        }
                    }
})

app.mount('#app')