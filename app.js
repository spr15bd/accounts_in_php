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
                            console.log("getSupplier() returned ", this.vendorInvoices)
                            
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        },
                        async processPayments() {
                            console.log("Processing payments")
                            this.paymentProcessing = true
                            await this.getSupplier()
                            if (!this.paymentsSelected[this.suppl]) {
                                this.paymentsSelected[this.suppl] = this.vendorInvoices
                            }
                            console.log("paymentsSelected: ", this.paymentsSelected)
                        },
                        updatePayment(index) {
                            console.log("vendorInvoices[index] before update: ", this.vendorInvoices[index])
                            console.log("index is ", index)
                            console.log("paymentsSelected ", this.paymentsSelected)
                            if (this.paymentsSelected['Ulreco'][index].paid == 0.00 || this.paymentsSelected['Ulreco'][index].paid === undefined) {
                                this.paymentsSelected['Ulreco'][index].paid = parseFloat(this.vendorInvoices[index].amount).toFixed(2)
                                this.totalToPay += parseFloat(this.vendorInvoices[index].amount)
                            } else {
                                this.paymentsSelected['Ulreco'][index].paid = 0.00
                                this.totalToPay -= parseFloat(this.vendorInvoices[index].amount)
                            }
                            console.log("vendorInvoices[index] after update: ", this.vendorInvoices[index])
                            console.log("total to pay: ", this.totalToPay)
                            console.log("invoice selected: ", this.vendorInvoices[index].amount)
                        },
                        paymentsSum(invoices) {
                            console.log("invoices ", invoices)
                            let sum = 0
                            invoices?.forEach((invoice) => {
                                sum += parseFloat(invoice.amount)
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
                        },
                        toTwoDecimalPlaces(value) {
                            return value.toFixed(2)
                        }
                    },
                    computed: {
                        
                    }
})

app.mount('#app')