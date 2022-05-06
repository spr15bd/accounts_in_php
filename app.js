const app = Vue.createApp({
                    data() {
                        return {
                            supplierReview: false,
                            supplierPayment: Number.parseFloat(0.00),
                            totalToPay: Number.parseFloat(0.00),
                            addInvoice: false,
                            payments: false,
                            paymentsSelected: {
                                supplier: {
                                    Ulreco: [],
                                       
                                        //{ id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) },
                                        //{ id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) },
                                        //{ id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) },
                                        //{ id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) }
                                    //],
                                    TenSystems: [],
                                    SharpDesign: [],
                                }
                            },
                            //invoices: [],
                            checkedInvoices: [],
                            vendorInvoices: null,
                            invoices: [ { id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) } ],
                            supplier: null,
                            paymentsSummaryPage: false,
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
                            this.vendorInvoices =  res.data
                            this.paymentsSelected['Ulreco'] = vendorInvoices
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
                            this.vendorInvoices = res.data
                            console.log("res from getting invs ", res)
                        },
                        updatePayment(index) {
                            console.log("index is ", index)
                            if (!this.paymentsSelected.supplier['Ulreco'][index].paid) {
                                //this.paymentsSelected.supplier['Ulreco'][index].paid = 0
                            }
                            this.paymentsSelected.supplier['Ulreco'][index] = this.paymentsSelected.supplier['Ulreco'][index]===0.00?this.vendorInvoices.supplier['Ulreco'][index].amount:"0.00"
                            console.log("paymentsSelected: ", this.paymentsSelected)
                            this.invoices[index].amount = this.invoices[index].amount           
                            if (this.checkedInvoices[index] == null || this.checkedInvoices[index] == false) {
                                this.totalToPay += parseFloat(this.invoices[index].amount)
                            } else if (this.checkedInvoices[index] == true) {
                                this.totalToPay -= parseFloat(this.invoices[index].amount)
                            }
                            this.paymentsSelected[String(this.paymentsSupplier)] = this.totalToPay
                            console.log("PaymentsSelected ", this.paymentsSelected)
                            this.paymentsSelected.grandTotal = 0
                            for (supplier in this.paymentsSelected) {
                              this.paymentsSelected.grandTotal += supplier  
                            }
                        },
                        paymentsSum(invoices) {
                            let sum = 0
                            invoices.forEach((invoice) => {
                                sum += parseFloat(invoice['amount'])
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