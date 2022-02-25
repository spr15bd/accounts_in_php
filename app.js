const app = Vue.createApp({
    

                    data() {
                        return {
                            supplierReview: false,
                            supplierPayment: 0,
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
                            console.log("app.js->getSupplier(): invoices ", this.invoices)
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        },
                        async processPayments() {
                            this.paymentProcessing = true
                            let payload = { data: { supplierName: this.paymentsSupplier } }
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                            this.invoices = res.data
                        }
                    }
})

app.mount('#app')