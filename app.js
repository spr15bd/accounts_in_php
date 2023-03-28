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
            checked: []
        }
    },
    async mounted() {
        console.log("mounted")
    },
    methods: {
        async getSupplier() {
            let payload = { data: { supplierName: this.suppl } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                //console.log("res ", res.data, "data type ", typeof res.data)
                this.vendorInvoices[this.suppl] =  res.data
                payload = null
            } 
        },
        async getAllSuppliers() {
            console.log("get all suppliers")
            let payload = { data: { supplierName: 'all' } }
            const res = await axios.post("database_queries.php", payload )
            if (res.data) {
                console.log("res of all suppliers", res.data, "data type ", typeof res.data)
                this.allInvoices =  res.data
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
        paymentsSum(supplier) {
            if (supplier[this.suppl]) {
                let sum = 0

                if (supplier && this.suppl) {
                    supplier[this.suppl].forEach((invoice) => {
                        sum += parseFloat(invoice.paid)
                    })
                    
                    this.totalPaid[this.suppl] = sum==0?null:sum
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
        amountPaid(idx) {
            // if index is selected, return amount outstanding on invoice
            // otherwise return zero
            if (this.selectedPayments.includes(idx)) {
                let vendorInvoices = Object.values(this.vendorInvoices['Ulreco'])
                let selectedInvoice = vendorInvoices.find(inv=>
                inv.id === idx
            )
                // show the balance owed ie total minus already paid
                return (selectedInvoice['amount'] - selectedInvoice['paid']).toFixed(2)
            } else {
                // show zero
                return 0.00
            }
            console.log("amountPaid vIs ", this.vendorInvoices['Ulreco'], "data type ", typeof this.vendorInvoices)
            
            let vendorInvoices = Object.values(this.vendorInvoices['Ulreco'])
            console.log(vendorInvoices, typeof vendorInvoices)
            vendorInvoices.forEach(inv=>{
                console.log("inv is ", inv, "typeof ", typeof inv.id, "typeof indx ", typeof idx, "index of inv: ", inv.id)
            })
            let selectedInvoice = vendorInvoices.find(inv=>
                inv.id === idx
            )
            console.log("selected inv ", selectedInvoice)
            return selectedInvoice['amount'] - selectedInvoice['paid']
            /*if (this.selectedPayments.includes(idx)) {
                let vendorInvoices = Object.entries(this.vendorInvoices)[0][1]
                console.log(vendorInvoices)
                vendorInvoices.forEach(item=>{
                    if (item.id === idx) {
                        return item.amount
                    }
                })
                
            }*/
        },
        grandTotalPaid() {
            // convert to array
            let supplierPayments = Object.entries(this.totalPaid)

            let sum = 0
            supplierPayments.forEach((supplier) => {
                sum += supplier[1]
            })

            return sum
        },
        confirmProcessPayments() {
            this.confirmProcessPaymentsScreen = true
            this.paymentsSummaryPage=false
            // check there are checked invoices, if so process payment
            let paymentMap = this.paymentsSelected['Ulreco'].map(invoice=>
                invoice.checked
            )
            console.log("pm ", paymentMap)
            paymentMap.forEach(invoice=>{
                if (invoice===true) {
                    this.totalCheckedUlreco++
                }
            })
            
        },
        updatePayments(idx) {
            // add the invoice id to an array if the invoice is selected for payment
            // if the invoice has already been selected for payment, deselct it ie remove it from the array
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
                // sum over supplier
                if (sum['Ulreco']) {
                    sum['Ulreco'] += Number(foundInv?.amount)        
                } else {
                    sum['Ulreco'] = 0
                    sum['Ulreco'] += Number(foundInv?.amount)
                }
                
                return sum
                
            })
            console.log("sum of invs is ", sum)
            console.log("suppliers record ", this.suppliers)
            // return the array for display
            //this.allInvoices.forEach(invoice=>{
            //    console.log(invoice)
            //})
            return this.suppliers
        }
    }
})

app.mount('#app')
