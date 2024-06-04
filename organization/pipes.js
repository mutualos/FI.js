const translations = {
    loans: {  //match pipeID
        "Principal": "principal",
        "Rate_Over_Split": "annualRate",
        "Maturity_Date": "maturityDate",
        "Risk_Rating": "riskRating",
        "Class_Code": "type",
        "Portfolio": "ID",
        "Previous_Average_Balance": "balance"
        // Additional mappings as necessary
    },
    checking: {
        "Portfolio": "ID",
        "Previous_Average_Balance": "balance",
        "PMTD_Service_Charge": "charges",
        "PMTD_Service_Charge_Waived": "chargesWaived",
        "PMTD_Other_Charges": "otherCharges",
        "PMTD_Other_Charges_Waived": "otherChargesWaived",
        "PMTD_Interest_Earned": "interestExpense",
        "PMTD_Number_of_Deposits": "deposits"
    }
};
window.translations = translations; 
