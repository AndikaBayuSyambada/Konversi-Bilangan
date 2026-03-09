function convertNumber() {
    const fromBase = parseInt(document.getElementById("fromBase").value);
    const toBase = parseInt(document.getElementById("toBase").value);
    const number = document.getElementById("number").value.trim();
    
    if (number === "") {
        alert("Silakan masukkan bilangan!");
        return;
    }
    
    // Validasi input berdasarkan basis asal
    let validChars = '';
    if (fromBase === 2) {
        validChars = /^[01]+$/; 
    } else if (fromBase === 8) {
        validChars = /^[0-7]+$/; 
    } else if (fromBase === 10) {
        validChars = /^[0-9]+$/; 
    } else if (fromBase === 16) {
        validChars = /^[0-9A-Fa-f]+$/;
    }

    // Periksa validitas input
    if (!validChars.test(number)) {
        if (fromBase === 2) {
            alert("Bilangan tidak valid untuk biner! Gunakan hanya 0 dan 1.");
        } else if (fromBase === 8) {
            alert("Bilangan tidak valid untuk oktal! Gunakan angka 0-7.");
        } else if (fromBase === 10) {
            alert("Bilangan tidak valid untuk desimal! Gunakan angka 0-9.");
        } else if (fromBase === 16) {
            alert("Bilangan tidak valid untuk heksadesimal! Gunakan angka 0-9 dan huruf A-F.");
        }
        return;
    }

    // Konversi dari basis asal ke desimal
    const decimalValue = parseInt(number, fromBase);

    // Periksa apakah hasil konversi adalah NaN (gagal konversi)
    if (isNaN(decimalValue)) {
        alert("Bilangan tidak dapat dikonversi ke desimal!");
        return;
    }

    // Konversi dari desimal ke basis tujuan
    let result;
    if (toBase === 2) {
        result = decimalValue.toString(2);
    } else if (toBase === 8) {
        result = decimalValue.toString(8);
    } else if (toBase === 10) {
        result = decimalValue.toString(10);
    } else if (toBase === 16) {
        result = decimalValue.toString(16).toUpperCase();
    }

    // Tampilkan hasil
    document.getElementById("result").textContent = result;
    
    // Perlihatkan penjelasan
    document.getElementById("explanationBox").style.display = "block";
    
    // Buat penjelasan langkah demi langkah
    generateExplanation(number, fromBase, result, toBase, decimalValue);
}

function generateExplanation(input, fromBase, output, toBase, decimalValue) {
    const explanationElement = document.getElementById("explanationSteps");
    explanationElement.innerHTML = "";
    
    // Definisikan nama basis
    const baseNames = {
        2: "Biner",
        8: "Oktal",
        10: "Desimal",
        16: "Heksadesimal"
    };
    
    // Langkah 1: Konversi dari basis asal ke desimal
    const step1 = document.createElement("div");
    step1.className = "step";
    
    if (fromBase !== 10) {
        step1.innerHTML = `<strong>Langkah 1:</strong> Konversi ${baseNames[fromBase]} ke desimal<br>Langkah-langkah konversi ${baseNames[fromBase]} ke desimal:<br>`;
        
        const digits = input.toUpperCase().split('');
        let calculation = "";
        let total = 0;
        
        for (let i = 0; i < digits.length; i++) {
            const position = digits.length - 1 - i;
            const digitValue = parseInt(digits[i], fromBase);
            const positionValue = Math.pow(fromBase, position);
            const termValue = digitValue * positionValue;
            
            // Konversi digit heksadesimal jika perlu
            let displayDigit = digits[i];
            if (fromBase === 16 && /[A-F]/.test(digits[i])) {
                const digitMap = {'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15};
                displayDigit = `${digits[i]} (=${digitMap[digits[i]]})`;
            }
            
            calculation += `${displayDigit} × ${fromBase}<sup>${position}</sup> = ${displayDigit} × ${positionValue} = ${termValue}`;
            
            if (i < digits.length - 1) {
                calculation += " + ";
            }
            
            total += termValue;
        }
        
        calculation += ` = ${total}`;
        step1.innerHTML += calculation + `<br>Jumlahkan semua hasil: ${total}`;
    } else {
        step1.innerHTML = `<strong>Langkah 1:</strong> Nilai Desimal: ${input} (sudah dalam bentuk desimal)`;
    }
    
    explanationElement.appendChild(step1);
    
    // Langkah 2: Konversi dari desimal ke basis tujuan
    const step2 = document.createElement("div");
    step2.className = "step";
    
    if (toBase !== 10) {
        step2.innerHTML = `<strong>Langkah 2:</strong> Konversi desimal ke ${baseNames[toBase]}<br>h-langkah konversi desimal ke ${baseNames[toBase]}:<br>`;
        
        let decimalTemp = decimalValue;
        let remainders = [];
        
        while (decimalTemp > 0) {
            const remainder = decimalTemp % toBase;
            remainders.unshift(remainder);
            decimalTemp = Math.floor(decimalTemp / toBase);
        }
        
        // Tampilkan proses pembagian
        let lastDivision = decimalValue;
        let divisionStep = `${lastDivision} ÷ ${toBase} = ${Math.floor(lastDivision / toBase)} sisa ${lastDivision % toBase}`;
        
        // Konversi sisa bagi ke format heksadesimal jika diperlukan
        let remainderDisplay = lastDivision % toBase;
        if (toBase === 16 && remainderDisplay >= 10) {
            const hexDigits = ['A', 'B', 'C', 'D', 'E', 'F'];
            remainderDisplay = `${remainderDisplay} (huruf ${hexDigits[remainderDisplay - 10]})`;
        }
        
        step2.innerHTML += `${lastDivision} ÷ ${toBase} = ${Math.floor(lastDivision / toBase)} sisa ${remainderDisplay}<br>`;
        step2.innerHTML += `Sisa terakhir: ${lastDivision % toBase} ${toBase === 16 ? `(huruf ${String.fromCharCode(55 + (lastDivision % toBase))})` : ''}<br>`;
        step2.innerHTML += `Baca sisa dari bawah ke atas: ${output}`;
    }
    
    explanationElement.appendChild(step2);
}

function resetForm() {
    document.getElementById("number").value = '';
    document.getElementById("result").textContent = '-';
    document.getElementById("explanationBox").style.display = "none";
}