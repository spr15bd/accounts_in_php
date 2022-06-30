const app = Vue.createApp({
                    data() {
                        return {
                            supplierReview: false,
                            supplierPayment: Number.parseFloat(0.00),
                            totalToPay: Number.parseFloat(0.00),
                            addInvoice: false,
                            payments: false,
                            paymentsSelected: [],
                            checkedInvoices: [],
                            vendorInvoices: [],
                            invoices: [ { id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) } ],
                            supplier: null,
                            paymentsSummaryPage: false,
                            //paymentsSupplier: null,
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
                            this.vendorInvoices =  res.data
                            this.paymentsSelected['Ulreco'].push(this.vendorInvoices)
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        },
                        async processPayments() {
                            console.log("Processing payments")
                            this.paymentProcessing = true
                            this.getSupplier()
                        },
                        updatePayment(index) {
                            console.log("vendorInvoices: ", this.vendorInvoices)
                            console.log("index is ", index)
                            if (this.paymentsSelected['Ulreco'][index] == 0.00 || this.paymentsSelected['Ulreco'][index] === undefined) {
                                this.paymentsSelected['Ulreco'][index] = parseFloat(this.vendorInvoices[index].amount)
                                this.totalToPay += parseFloat(this.vendorInvoices[index].amount)
                            } else {
                                this.paymentsSelected['Ulreco'][index] = 0.00
                                this.totalToPay -= parseFloat(this.vendorInvoices[index].amount)
                            }
                            console.log("total to pay: ", this.totalToPay)
                            console.log("invoice selected: ", this.vendorInvoices[index].amount)
                        },
                        paymentsSum(invoices) {
                            console.log("invoices ", invoices)
                            let sum = 0
                            invoices?.forEach((invoice, index) => {
                                sum += parseFloat(invoice.amount)
                                console.log("sum is now ", sum)
                            })
                            return sum
                        },
                        reviewTotalSum(invoices) {
                            console.log("invoices", invoices)
                            let sum = 0
                            invoices.forEach((invoice)=> {
                                sum += parseFloat(invoice.amount)
                            })
                            return sum
                        },
                        reviewPaidSum(invoices) {
                            let sum = 0
                            invoices.forEach((invoice)=> {
                                sum += parseFloat(invoice.paid)
                            })
                            return sum
                        },
                        reviewOutstandingSum(invoices) {
                            let sum = 0
                            invoices.forEach((invoice)=> {
                                sum += parseFloat(invoice.amount - invoice.paid)
                            })
                            return sum
                        }
                    },
                    computed: {
                        
                    }
})

app.mount('#app')