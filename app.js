const app = Vue.createApp({
                    data() {
                        return {
                            confirmProcessPaymentsScreen: false,
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
                            totalPaid: [],
                            paid: []
                        }
                    },
                    methods: {
                        
                        async getSupplier() {
                            let payload = { data: { supplierName: this.suppl } }
                            const res = await axios.post("database_queries.php", payload )
                            if (res.data) {
                                this.vendorInvoices[this.suppl] =  res.data
                                payload = null
                            } 
                                          
                        },
                        async update() {
                            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
                            const res = await axios.post("database_queries.php", payload )
                            const {results} = res
                        },
                        async processPaymentsScreen() {
                            this.paymentProcessing = true
                            await this.getSupplier()
                            if (!this.paymentsSelected[this.suppl]) {
                                this.paymentsSelected[this.suppl] = this.vendorInvoices[this.suppl]
                            }
                        },
                        async processPayments() {
                            console.log("processing payments")
                            
                        },
                        updatePayment(index) {
                            if (this.paymentsSelected[this.suppl][index]?.paid == 0.00 || this.paymentsSelected[this.suppl][index]?.paid === undefined) {
                                this.paymentsSelected[this.suppl][index].paid = parseFloat(this.vendorInvoices[this.suppl][index].amount).toFixed(2)
                            } else {
                                this.paymentsSelected[this.suppl][index].paid = parseFloat(0.00).toFixed(2)
                            }
                        },
                        paymentsSum(supplier) {
                            if (supplier[this.suppl]) {
                                let sum = 0

                                if (supplier && this.suppl) {
                                    supplier[this.suppl].forEach((invoice) => {
                                        sum += parseFloat(invoice.paid)
                                    })
                                    this.totalPaid[this.suppl] = sum
                                }
                            
                                return sum
                            }
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
                       grandTotalPaid() {
                           let supplierPayments = Object.entries(this.totalPaid)
                           console.log("this.totalPaid", this.totalPaid)
                           console.log("this.totalPaid.Ulreco", this.totalPaid['Ulreco'])
                           console.log("totalPaid converted to key-values: ", Object.keys(this.totalPaid).map((key) => [Number(key), this.totalPaid[key]]))
                           console.log("supplierPayments: ", Object.entries(this.totalPaid))
                           //supplierPayments = supplierPayments.map(sp => {
                            //   return sp[1]
                           //})
                           let sum = 0
                           supplierPayments.forEach((value, key) => {
                                sum += value
                                console.log("Sum ", sum)
                           })
                           
                           return sum
                       }
                    }
})

app.mount('#app')
