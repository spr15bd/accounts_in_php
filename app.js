const app = Vue.createApp({
    

                    data() {
                        return {
                            supplierReview: false,
                            supplierPayment: Number.parseFloat(0.00),
                            totalToPay: Number.parseFloat(0.00),
                            addInvoice: false,
                            payments: false,
                            checkedInvoices: [],
                            invoices: [ { id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) } ],
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
                        },
                        updatePayment(index) {
                            this.invoices[index].paid = this.invoices[index].paid==0?this.invoices[index].amount:0
                            this.invoices[index].amount = this.invoices[index].amount
                            
                            if (this.checkedInvoices[index] == null || this.checkedInvoices[index] == false) {
                                this.totalToPay += parseFloat(this.invoices[index].amount)
                            } else if (this.checkedInvoices[index] == true) {
                                this.totalToPay -= parseFloat(this.invoices[index].amount)
                            }
                        },
                        paymentsSum(invoices) {
                            
                            console.log("payments sum")
                        }
                    }
})

app.mount('#app')