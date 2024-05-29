const organization = {
    attributes: {
        taxRate: {
            description: "The institution tax rate applied to financial calculations.",
            value: 0.27
        }
    },
    dictionaries: {
        loanRiskFactors: {
            description: "Risk factors representing the risk associated with different loan types.",
            values: {"0": 1, "1": 0, "2": 0.5, "3": 1, "3W": 2, "4": 10, "5": 100, "NULL": 1}
        },
        loanTypeID: {
            description: "Mappings of loan types to their respective IDs.",
            values: {
                "Agriculture": [],
                "Commercial": ["31", "32", "33", "34"], 
                "Commercial Real Estate": ["4"],
                "Residential Real Estate": ["1"],
                "Consumer": ["20", "21", "22", "23", "26", "70", "71", "76"], 
                "Equipment": [], 
                "Home Equity": ["24", "25", "46"], 
                "Letter of Credit": ["35"],
                "Commercial Line": ["36", "63", "65"], 
                "Commercial CD Secured": ["30", "38", "39"],
                "Consumer CD Secured": ["27", "28", "29"],
                "Home Equity Line of Credit": ["9", "10", "72", "75"],
                "Municipal": ["37"],
                "Tax Exempt Commercial": ["40"],
                "Tax Exempt Commercial Real Estate": ["42"]
            }
        }
    }
};
window.organization = organization;