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
            vendorInvoices: [],
            allInvoices: [],
            invoices: [ { id: Number, supplier: null, number: null, date: null, description: null, office: null, overhead: null, amount: parseFloat(0.00).toFixed(2), paid: parseFloat(0.00).toFixed(2) } ],
            supplier: null,
            suppliers: {},
            paymentsSummaryPage: false,
            invoiceNumber: null,
            invoiceDate: null,
            invoiceDescription: null,
            invoicePosted: false,
            office: null,
            overhead: null,
            invoiceAmount: null,
            statusMessage: null,
            paymentProcessing: false,
            selected: false,
            suppl: null,
            totalPaid: [],
            paid: [],
            selectedPayments: [],
            checked: {},
            paymentsRecord: []
        }
    },
    mounted() {
        this.refresh()
	},
    methods: {
        async refresh() {
            await this.getAllSuppliers()
		},
        async getSupplier() {
            let payload = { data: { supplierName: this.suppl } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                console.log("typeof (vendorInvoices): ", typeof this.vendorInvoices)
                this.vendorInvoices = res.data
                Object.values(this.vendorInvoices).forEach(invoice=>{
                    
                    invoice.amount = (Math.round(invoice.amount * 100) / 100).toFixed(2)
                    invoice.paid = invoice.paid?invoice.amount:"0.00"
				})
                payload = null
            } 
        },
        async getAllSuppliers() {
            let payload = { data: { supplierName: 'all' } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                this.allInvoices =  Object.values(res.data)
                payload = null
            } 
        },
        async setPaid(invs) {
            let payload = { data: { paid: invs } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                payload = null
            } 
		},
        async update() {
            let payload = {info: { supplier: this.supplier, invoiceNumber: this.invoiceNumber, invoiceDate: this.invoiceDate, invoiceDescription: this.invoiceDescription, office: this.office, overhead: this.overhead, invoiceAmount: this.invoiceAmount }}
            const res = await axios.post("database_queries.php", payload )
            const {results} = res
            this.invoicePosted = true
        },
        async processPaymentsScreen() {
            this.paymentProcessing = true
            await this.getSupplier()
            if (!this.paymentsSelected[this.suppl]) {
                this.paymentsSelected[this.suppl] = this.vendorInvoices[this.suppl]
            }
        },
        displayPaid(inv) {
            if (this.checked[inv.id]) {
                return inv.amount 
            } else {
                return 0.00
            }
        },
        currentSupplierSum(supplier) {
            // sum of supplier's payments
            // filter out all other supplier invoices
            let invoiceToAdd = null
            let supplierInvoices = this.allInvoices.filter(inv=>inv.supplier===supplier)
            console.log("supplier: ", supplier)
            console.log("supplierInvoices.length is: ", supplierInvoices?.length)
            // only sum supplier payments if it's an existing supplier with invoices on the system
            if (supplierInvoices.length > 0) {
                let sum = 0
                this.selectedPayments.forEach((payment) => {
                    invoiceToAdd = supplierInvoices.find(inv=>inv.id === String(payment.idx))
                    console.log("invoiceToAdd: ", invoiceToAdd)
                    if (invoiceToAdd) {
                        sum += Number(this.displayPaid(invoiceToAdd))
                        console.log("sum is now ", sum)
                    }
                })
                if (!invoiceToAdd) {
                    console.log("about to delete record")
                    // if there are no invoices to pay to the supplier, remove supplier from the payments record
                    delete this.paymentsRecord.supplier
                }
                
                this.paymentsRecord[supplier] = sum
                // filter out any payments with no invoices allocated
                
                console.log("PR as object: ", this.paymentsRecord)
                console.log("PR as array: ", Object.entries(this.paymentsRecord))
                
                // if paymentsRecord === 0, remove them from paymentsRecord array
                //console.log(typeof Object.entries(this.paymentsRecord), " (typeof)")
                
                //Object.values(this.paymentsRecord).filter(payment=>payment.value !== 0)
                
                //console.log("sum: ", sum)
                return sum
            }
        },
        reviewTotalSum(invoices) {
            let sum = 0
            invoices.forEach((invoice)=> {
                sum += parseFloat(invoice["amount"])
            })
            return sum
        },
        reviewPaidSum(invoices) {
            console.log("reviewPaidSum: ", invoices)
            let sum = 0
            invoices.forEach((invoice)=> {
                sum += parseFloat(invoice["paidAmount"])
            })
            console.log("sum is: ", sum)
            return sum
        },
        reviewOutstandingSum(invoices) {
            let sum = 0
            invoices.forEach((invoice)=> {
                // temp - todo add in total outstanding on the inv, new table id and paid
                //sum += invoice.id?0.00:parseFloat(invoice["amount"]) 18.09.2023
                sum += invoice.amount - invoice.paidAmount
            })
            return sum
        },
        amountPaid(idx) {
             // if index is selected, return amount outstanding on invoice
            // otherwise return zero
            let selectedInvoice
            if (this.selectedPayments.includes(idx)) {
                selectedInvoice = this.allInvoices.find(inv=>
                    String(inv['id']) === String(idx)
                )
                // show the balance owed ie total minus already paid
                return Number(selectedInvoice['amount']).toFixed(2)
            } else {
                // show zero
                return 0.00
            }
            
            let vendorInvoices = Object.values(this.vendorInvoices)
            
            selectedInvoice = vendorInvoices.find(inv=>
                inv.id === idx
            )
            return selectedInvoice['amount'] - selectedInvoice['paid']
        },
        grandTotalPaid() {
            // convert to array
            let supplierPayments = Object.entries(this.paymentsRecord)

            let sum = 0
            supplierPayments.forEach((supplier) => {
                sum += supplier[1]
            })

            return sum
        },
        async confirmProcessPayments() {
            this.confirmProcessPaymentsScreen = true
            this.paymentsSummaryPage=false
            
            // check there are paid invoices, if so process payment
            if (this.selectedPayments.length > 0) {
                // send array of inv indexes to db, add them to the paid table
                await this.setPaid(this.selectedPayments)
                this.confirmProcessPaymentsScreen = false
            }
            
           
        },
        updatePayments(idx, amount) {
            // add the invoice id to an array ('this.selectedPayments') if the invoice is selected for payment
            // if the invoice has already been selected for payment, deselect it ie remove it from the array
            if (!this.selectedPayments.some(payment => payment.idx === idx)) {
                this.selectedPayments.push({idx: idx, amount: amount});
            } else {
                this.selectedPayments = this.selectedPayments.filter(id=>id!==idx)
                console.log("removed inv, id: ", idx)
            } 
        },
        async showPaymentsSummary() {
            this.supplierReview=false
            this.addInvoice=false
            this.payments=false
            this.paymentsSummaryPage=true
            await this.getAllSuppliers()
        }
    },
    computed: {
        displaySelectedPayments () {
            let sum={}
            this.selectedPayments.forEach(sp=>{
                // get the invoice from its id
                let foundInv = this.allInvoices.find(inv=>inv.id===sp)
                // sum over 1 x supplier
                if (sum[foundInv?.supplier]) {
                    sum[foundInv?.supplier] += Number(foundInv?.amount)        
                } else {
                    sum[foundInv?.supplier] = 0
                    sum[foundInv?.supplier] += Number(foundInv?.amount)
                }
                
                return sum
                
            })
            return this.suppliers
        },
        vendorInvoicesArray() {
            return Object.values(this.vendorInvoices)  
		}
    }
})

app.mount('#app')
