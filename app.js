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
            paymentsSummaryMessage: "",
	    selectedInvoice: null,
            viewInvoiceDetails: null,
	    editInvoiceMode: false
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
                this.vendorInvoices.forEach(invoice=>{
                    invoice.amount = (Math.round(invoice.amount * 100) / 100).toFixed(2)
                    invoice.paid = invoice.paid?invoice.amount:"0.00"
		})
                payload = null
            }
	    this.suppl = null
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
            let payload = { data: { paid: invs, paymentDate: this.date } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                payload = null
                return res.data
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
        currentSupplierSum(supplier) {
            if (supplier) {
                let sum = 0
                let supplierInvoices = this.allInvoices.filter(inv=>inv.supplier===supplier)
                this.selectedPayments.forEach((id) => {
                    invoiceToAdd = supplierInvoices.find(inv=>inv.id === String(id))
                    if (invoiceToAdd) {
                        sum += Number(invoiceToAdd.amount)           
                    }
                })
                this.paymentsRecord[supplier] = sum
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
                sum += parseFloat(invoice["paid"])
            })
            return sum
        },
        reviewOutstandingSum(invoices) {
            let sum = 0
            invoices.forEach((invoice)=> {
                // temp - todo add in total outstanding on the inv, new table id and paid
                sum += invoice.paidid?0.00:parseFloat(invoice["amount"])
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
                return "0.00"
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
        updatePayments(idx) {
            // add the invoice id to an array if the invoice is selected for payment
            // if the invoice has already been selected for payment, deselect it ie remove it from the array

            if (!this.selectedPayments.includes(idx)) {
                this.selectedPayments.push(idx);
            } else {
                this.selectedPayments = this.selectedPayments.filter(id=>id!==idx)
            } 
        },
	updateView(view) {
		this.message=null
		this.supplierReview=false
		this.addInvoice=false
		this.suppl=null
		this.payments=false
		this.vendorInvoices = null
		this.viewInvoiceDetails=false
		this.paymentsSummaryPage=false
		this.confirmProcessPaymentsScreen=false
		switch (view) {
			case 0:
				this.supplierReview=true
				break
			case 1:
				this.addInvoice=true
				break
			case 2:
				this.payments=true
				break
			case 3:
				this.viewInvoiceDetails=true
				break
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
        formattedDate (dateStr) {
            if (dateStr !== '0000-00-00' && dateStr !== null && typeof dateStr !== 'undefined') {
                const dateFormatted = null
                const date = new Date(dateStr)
                if (date) {
                    const dateFormatted = new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    }).format(date)
                    return dateFormatted
                } else {
                    return null
                }
            }
        },
	editInvoice() {
		console.log("EDIT INV")
		await this.editInvoice()
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
