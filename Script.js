document.getElementById('printButton').addEventListener('click', function() {
    // Collect the form data
    const weight = document.getElementById('weight').value;
    const asn = document.getElementById('asn').value;
    const mpn = document.getElementById('mpn').value;
    const pallet = document.getElementById('pallet').value;
    const quantity = document.getElementById('quantity').value;
    const country = document.getElementById('country').value;

    // Create the barcode URL (example uses a free online barcode generator)
    const barcodeURL = (text) => `https://barcode.tec-it.com/barcode.ashx?data=${text}&code=Code128&translate-esc=false`;

    // Create the printable content
    const printContent = `
        <div class="container1">
            <div class="static-box">CVG110</div>
            <p><strong>Weight:</strong> ${weight}</p>
            <div class="line"></div>
            <p><strong>ASN:</strong> ${asn}</p>
            <img src="${barcodeURL(asn)}" alt="ASN Barcode" class="barcode"/>
            <div class="line"></div>
            <p><strong>MPN:</strong> ${mpn}</p>
            <img src="${barcodeURL(mpn)}" alt="MPN Barcode" class="barcode"/>
            <div class="line"></div>
            <p><strong>Pallet ID:</strong> ${pallet}</p>
            <img src="${barcodeURL(pallet)}" alt="Pallet ID Barcode" class="barcode"/>
            <div class="line"></div>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <img src="${barcodeURL(quantity)}" alt="Quantity Barcode" class="barcode"/>
            <div class="line"></div>
            <p><strong>Country of Origin:</strong> ${country}</p>
            <img src="${barcodeURL(country)}" alt="Country Barcode" class="barcode"/>
        </div>
    `;

    // Open the printable content in a new tab
    const printTab = window.open('', '_blank');
    printTab.document.write('<html><head><title>Print Label</title>');
    printTab.document.write('<link rel="stylesheet" href="style.css">');
    printTab.document.write('</head><body >');
    printTab.document.write(printContent);
    printTab.document.write('</body></html>');
    printTab.document.close();
    printTab.focus();
    printTab.print();
    printTab.close();
});
