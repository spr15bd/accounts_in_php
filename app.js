const app = Vue.createApp({
                    data() {
                        return {
                            supplierReview: false,
                            supplierPayment: Number.parseFloat(0.00),
                            totalToPay: Number.parseFloat(0.00),
                            addInvoice: false,
                            payments: false,
                            paymentsSelected: {},
                            checkedInvoices: [],
                            vendorInvoices: {},
                            invoices: [ { id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) } ],
                            supplier: null,
                            paymentsSummaryPage: false,
                            invoiceNumber: null,
                            invoiceDate: null,
                            invoiceDescription: null,
                            office: null,
                            overhead: null,
                            invoiceAmount: null,
                            statusMessage: null,
                            paymentProcessing: false,
                            selected: false,
                            suppl: null,
                            paid: []
                        }
                    },
                    methods: {
                        
                        async getSupplier() {
                            let payload = { data: { supplierName: this.suppl } }
                            const res = await axios.post("database_queries.php", payload )
                            if (res.data) {
                                this.vendorInvoices[this.suppl] =  res.data // TODO -change all this.vendorInvoices to array of the chosen supplier
                            } 
                                          
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        },
                        async processPayments() {
                            this.paymentProcessing = true
                            await this.getSupplier()
                            if (!this.paymentsSelected[this.suppl]) {
                                this.paymentsSelected[this.suppl] = this.vendorInvoices[this.suppl]
                            }
                        },
                        updatePayment(index) {
                            console.log("vendorInvoices[index] before update: ", this.vendorInvoices[this.suppl][index])
                            console.log("supplier is ", this.suppl)
                            console.log("paymentsSelected ", this.paymentsSelected)
                            if (this.paymentsSelected[this.suppl][index]?.paid == 0.00 || this.paymentsSelected[this.suppl][index]?.paid === undefined) {
                                this.paymentsSelected[this.suppl][index].paid = parseFloat(this.vendorInvoices[index].amount).toFixed(2)
                                this.totalToPay += parseFloat(this.vendorInvoices[index].amount)
                            } else {
                                this.paymentsSelected[this.suppl][index].paid = parseFloat(0.00).toFixed(2)
                                this.totalToPay -= parseFloat(this.vendorInvoices[index].amount)
                            }
                        },
                        paymentsSum(invoices) {
                            let sum = 0
                            console.log("app.js->paymentsSum: ", invoices)
                            invoices?.forEach((invoice) => {
                                sum += parseFloat(invoice.amount)
                            })
                            return sum
                        },
                        reviewTotalSum(invoices) {
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
                        },
                        amountPaid(index) {
                            if (this.paymentsSelected[this.suppl]) {
                                this.paid[index] = this.paymentsSelected[this.suppl][index].paid
                                return this.paymentsSelected[this.suppl][index].paid     
                            } else {
                                return this.paid[index]
                            }
                            
                        }
                    },
                    computed: {
                       
                    }
})

app.mount('#app')
