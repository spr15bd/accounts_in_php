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
            paymentsRecord: [],
            selectedSupplierSum: 0.00,
            message: null,
            date: null,
            paymentsSummaryMessage: ""
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
            console.log("invs to pay: ", invs)
            console.log("payment date: ", this.date)
            let payload = { data: { paid: invs, paymentDate: this.date } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                console.log("data: ", res.data)
                payload = null
                return res.data
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
            let invoiceToAdd
            let paymentInvoices = []
            let supplierInvoices = this.allInvoices.filter(inv=>inv.supplier===supplier)
            // only sum supplier payments if it's an existing supplier with invoices on the system
            if (supplierInvoices.length > 0) {
                let sum = 0.00
                this.selectedPayments.forEach((payment) => {
                    invoiceToAdd = null   
                    if (this.checked[payment.idx]) {
                        invoiceToAdd = supplierInvoices.find(inv=>inv.id === String(payment.idx))
                    }
                    if (invoiceToAdd) {
                        sum += Number(this.displayPaid(invoiceToAdd))
                        paymentInvoices.push(invoiceToAdd)
                    }
                })
                        
                this.paymentsRecord[supplier] = sum
                if (paymentInvoices.length < 1) {
                    delete this.paymentsRecord[supplier]
                }
                this.selectedSupplierSum = sum
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
            let sum = 0
            invoices.forEach((invoice)=> {
                // make paidAmount non-nullable and zero by default in the db, sum all invs in the array
                if (invoice.paidAmount) {
                    sum += parseFloat(invoice["paidAmount"])
                }
            })
            return sum
        },
        reviewOutstandingSum(invoices) {
            let sum = 0
            invoices.forEach((invoice)=> {
                // temp - todo add in total outstanding on the inv, new table id and paid
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
                console.log("selectedPayments: ", this.selectedPayments, "payment date: ", this.date)
                let res = await this.setPaid(this.selectedPayments, this.date)
                this.confirmProcessPaymentsScreen = false
                if (res) {
                    this.message = res
                } else {
                    this.message = "Payments have been allocated."
                    this.suppl = null
                    // refresh screen so that payments show as allocated. TODO - Supplier payments review screen should be wiped
                    this.supplierReview = false
                    this.vendorInvoices = null
                }
            }
            
           
        },
        updatePayments(idx, amount, invoiceNo, supplier) {
            // add the invoice id to an array ('this.selectedPayments') if the invoice is selected for payment
            // if the invoice has already been selected for payment, deselect it ie remove it from the array
            if (!this.selectedPayments.some(payment => payment.idx === idx)) {
                this.selectedPayments.push({idx: idx, amount: amount, invNo: invoiceNo, supplier: supplier});
            } else {
                this.selectedPayments = this.selectedPayments.filter(payment=>payment.idx!==String(idx))
            } 
        },
        async showPaymentsSummary() {
            if (!this.date) {
                this.paymentsSummaryMessage = "Please enter a payment date."
                return
            }
            this.supplierReview=false
            this.addInvoice=false
            this.payments=false
            this.paymentsSummaryPage=true
            await this.getAllSuppliers()
        },   
        reset () {
            // reset form to input invoices
            this.supplier = null
            this.invoiceNumber = null
            this.invoiceDate = null
            this.invoiceDescription = null
            this.office = null
            this.overhead = null
            this.invoiceAmount = null
        },
        formattedDate (date) {
            return new Date(date)?.toDateString()
            
            //const date = new Date(dateString); // {object Date}            

            //const dateFormatted = new Intl.DateTimeFormat("en-US", {
            //  year: "numeric",
            //  month: "2-digit",
            //  day: "2-digit"
            //}).format(date);
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
            let invoices = []
            if (this.vendorInvoices) {
                invoices = Object.values(Object.values(this.vendorInvoices)?.filter(inv=>inv.paidAmount < inv.amount))            
            }
            invoices.forEach(inv=>{
                inv['amount'] = inv.amount
                inv['date'] = inv.date
                inv['description'] = inv.description
                inv['id'] = inv.id,
                inv['number'] = inv.number
                inv['office'] = inv.office
                inv['overhead'] = inv.overhead
                inv['paid'] = Number(inv.paid)
                inv['paidAmount'] = inv.paidAmount?Number(inv.paidAmount):0.00
                inv['paidid'] = inv.paidid
                inv['supplier'] = inv.supplier
                      
            })
            return invoices            
		},
        // only include unpaid invoices
        unpaidVendorInvoicesArray() {
            let invs = Object.values(this.vendorInvoicesArray.filter(inv=>inv.paidid===null))
            return invs
		}                
    }
})

app.mount('#app')
