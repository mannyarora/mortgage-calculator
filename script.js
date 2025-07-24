function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('homePrice').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTermYears = parseFloat(document.getElementById('loanTerm').value);
    const annualPropertyTax = parseFloat(document.getElementById('propertyTax').value);
    const annualInsurance = parseFloat(document.getElementById('insurance').value);
    
    if (!homePrice || homePrice <= 0) {
        alert('Please enter a valid home price');
        return;
    }
    
    const downPaymentAmount = (downPaymentPercent / 100) * homePrice;
    const loanAmount = homePrice - downPaymentAmount;
    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    const totalPayments = loanTermYears * 12;
    
    let monthlyPayment;
    if (monthlyInterestRate === 0) {
        monthlyPayment = loanAmount / totalPayments;
    } else {
        monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
                        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    }
    
    const monthlyPropertyTax = annualPropertyTax / 12;
    const monthlyInsurance = annualInsurance / 12;
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance;
    
    const totalCost = monthlyPayment * totalPayments;
    const totalInterest = totalCost - loanAmount;
    
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('monthlyPropertyTax').textContent = formatCurrency(monthlyPropertyTax);
    document.getElementById('monthlyInsurance').textContent = formatCurrency(monthlyInsurance);
    document.getElementById('totalMonthlyPayment').textContent = formatCurrency(totalMonthlyPayment);
    document.getElementById('loanAmount').textContent = formatCurrency(loanAmount);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalCost').textContent = formatCurrency(totalCost + downPaymentAmount);
    
    document.getElementById('results').style.display = 'block';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function showAmortization() {
    const homePrice = parseFloat(document.getElementById('homePrice').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTermYears = parseFloat(document.getElementById('loanTerm').value);
    const annualPropertyTax = parseFloat(document.getElementById('propertyTax').value);
    const annualInsurance = parseFloat(document.getElementById('insurance').value);
    
    if (!homePrice || homePrice <= 0) {
        alert('Please calculate mortgage first');
        return;
    }
    
    const params = new URLSearchParams({
        homePrice: homePrice,
        downPayment: downPaymentPercent,
        interestRate: annualInterestRate,
        loanTerm: loanTermYears,
        propertyTax: annualPropertyTax,
        insurance: annualInsurance
    });
    
    window.open(`amortization.html?${params.toString()}`, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateMortgage();
            }
        });
    });
});