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
            paid: [],
            selectedPayments: [],
            checked: []
        }
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
            console.log("index is ", idx)
            /*if (this.paymentsSelected[this.suppl]) {
                this.paid[index] = this.paymentsSelected[this.suppl][index].paid
                return this.paymentsSelected[this.suppl][index].paid     
            } else {
                return this.paid[index]
            }*/
            console.log("amountPaid vIs ", this.vendorInvoices['Ulreco'], "data type ", typeof this.vendorInvoices)
            
            let vendorInvoices = Object.entries(this.vendorInvoices['Ulreco'])
            console.log(vendorInvoices, typeof vendorInvoices)
            vendorInvoices.forEach(inv=>{
                console.log("inv is ", inv, "typeof ", typeof inv[1].id, "typeof indx ", typeof idx, "index of inv: ", inv[1].id)
            })
            let selectedInvoice = vendorInvoices.find(inv=>{
                Number(inv[1].id) === Number(idx)
            })
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
            updatePayments(id) {
            if (!this.selectedPayments.includes(id)) {
                this.selectedPayments.push(id);
            }
            console.log("update payment", id);   
        }
    },
    computed: {
        
    }
})

app.mount('#app')
