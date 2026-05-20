function parseFormattedNumber(value) {
    return parseFloat(String(value).replace(/,/g, '')) || 0;
}

function formatNumberWithCommas(value) {
    const cleaned = String(value).replace(/[^\d.]/g, '');
    const firstDot = cleaned.indexOf('.');
    const intRaw = firstDot === -1 ? cleaned : cleaned.slice(0, firstDot);
    const decRaw = firstDot === -1 ? '' : cleaned.slice(firstDot + 1).replace(/\./g, '').slice(0, 2);
    const intFormatted = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return firstDot === -1 ? intFormatted : `${intFormatted}.${decRaw}`;
}

function attachCommaFormatter(input) {
    const reformat = () => {
        const oldValue = input.value;
        const cursorPos = input.selectionStart ?? oldValue.length;
        const digitsBefore = oldValue.slice(0, cursorPos).replace(/[^\d.]/g, '').length;
        const formatted = formatNumberWithCommas(oldValue);
        if (formatted === oldValue) return;
        input.value = formatted;
        let newPos = 0;
        let count = 0;
        while (newPos < formatted.length && count < digitsBefore) {
            if (/[\d.]/.test(formatted[newPos])) count++;
            newPos++;
        }
        try { input.setSelectionRange(newPos, newPos); } catch (e) { /* ignore */ }
    };
    input.addEventListener('input', reformat);
    // Format any initial value
    input.value = formatNumberWithCommas(input.value);
}

function calculateMortgage() {
    const homePrice = parseFormattedNumber(document.getElementById('homePrice').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTermYears = parseFloat(document.getElementById('loanTerm').value);
    const annualPropertyTax = parseFormattedNumber(document.getElementById('propertyTax').value);
    const annualInsurance = parseFormattedNumber(document.getElementById('insurance').value);
    
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
    const homePrice = parseFormattedNumber(document.getElementById('homePrice').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTermYears = parseFloat(document.getElementById('loanTerm').value);
    const annualPropertyTax = parseFormattedNumber(document.getElementById('propertyTax').value);
    const annualInsurance = parseFormattedNumber(document.getElementById('insurance').value);
    
    if (!homePrice || homePrice <= 0) {
        alert('Please calculate mortgage first');
        return;
    }
    
    const startDate = document.getElementById('startDate').value;

    const params = new URLSearchParams({
        homePrice: homePrice,
        downPayment: downPaymentPercent,
        interestRate: annualInterestRate,
        loanTerm: loanTermYears,
        propertyTax: annualPropertyTax,
        insurance: annualInsurance,
        startDate: startDate
    });
    
    window.open(`amortization.html?${params.toString()}`, '_blank');
}

function showDepreciation() {
    window.open('depreciation.html', '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    const startDateInput = document.getElementById('startDate');
    if (startDateInput && !startDateInput.value) {
        startDateInput.value = new Date().toISOString().slice(0, 10);
    }

    document.querySelectorAll('input[data-currency]').forEach(attachCommaFormatter);

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateMortgage();
            }
        });
    });
});