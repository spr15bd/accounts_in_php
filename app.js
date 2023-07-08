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
            paymentsRecord: []
        }
    },
    mounted() {
        this.refresh()
	},
    methods: {
        async refresh() {
            await this.getAllSuppliers()
            await this.getPaid(1)
		},
        async getSupplier() {
            let payload = { data: { supplierName: this.suppl } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                this.vendorInvoices = res.data
                this.vendorInvoices.forEach(invoice=>{
                    
                    invoice.amount = (Math.round(invoice.amount * 100) / 100).toFixed(2)
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
        async getPaid(id) {
        console.log("id: ", id)
            let payload = { id: { id: id } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                this.paid =  res.data
                console.log("app.js, this.paid returned ", this.paid)
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
                sum += parseFloat(invoice.amount)
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
        confirmProcessPayments() {
            this.confirmProcessPaymentsScreen = true
            this.paymentsSummaryPage=false
            console.log("selectedPayments ", this.selectedPayments)
            console.log("allInvoices ", this.allInvoices)
            // check there are checked invoices, if so process payment
            let paymentMap = this.allInvoices.map(invoice=>
                invoice['Ulreco'].checked
            )
            console.log("pm ", paymentMap)
            paymentMap.forEach(invoice=>{
                if (invoice===true) {
                    this.totalChecked++
                }
                console.log("total checked invs ", this.totalChecked)
            })
            // send array of inv indexes to db, add them to the paid table
            //await this.setPaid(1)
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
                console.log("inv it belongs to ", foundInv)
                console.log("This is a ", foundInv?.supplier, " invoice.")
                // sum over 1 x supplier
                if (sum[foundInv?.supplier]) {
                    sum[foundInv?.supplier] += Number(foundInv?.amount)        
                } else {
                    sum[foundInv?.supplier] = 0
                    sum[foundInv?.supplier] += Number(foundInv?.amount)
                }
                
                return sum
                
            })
            console.log("sum of invs is ", sum)
            console.log("suppliers record ", this.suppliers)
            return this.suppliers
        },
        vendorInvoicesArray() {
            return Object.values(this.vendorInvoices)  
		}
    }
})

app.mount('#app')
