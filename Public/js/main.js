document.getElementById('printButton').addEventListener('click', function() {
    // Collect the form data
    const weight = document.getElementById('weight').value;
    const asn = document.getElementById('asn').value;
    const mpn = document.getElementById('mpn').value;
    const pallet = document.getElementById('pallet').value;
    const quantity = document.getElementById('quantity').value;
    const country = document.getElementById('country').value;

    // Generate barcode URLs
    const barcodeURL = (text) => `https://barcode.tec-it.com/barcode.ashx?data=${text}&code=Code128&translate-esc=false`;

    // Create the printable content
    const printContent = `
        <div class="printable-page">
            <div class="top-right-box">CVG110</div> 
            <div class="section">
                <strong>Weight:</strong> ${weight}
            </div>
            <hr> 
            <div class="section">
                <strong>ASN:</strong> ${asn}<br>
                <img src="${barcodeURL(asn)}" class="barcode" alt="ASN Barcode">
            </div>
            <hr>
            <div class="section">
                <strong>MPN:</strong> ${mpn}<br>
                <img src="${barcodeURL(mpn)}" class="barcode" alt="MPN Barcode">
            </div> 
            <hr> 
            <div class="section">
                <strong>Pallet ID:</strong> ${pallet}<br>
                <img src="${barcodeURL(pallet)}" class="barcode" alt="Pallet ID Barcode">
            </div>
            <hr>
            <div class="section">
                <strong>Quantity:</strong> ${quantity}<br>
                <img src="${barcodeURL(quantity)}" class="barcode" alt="Quantity Barcode">
            </div>
            <hr>
            <div class="section">
                <strong>Country of Origin:</strong> ${country}<br>
                <img src="${barcodeURL(country)}" class="barcode" alt="Country of Origin Barcode">
            </div>
        </div>
    `;

    // Open the printable content in a new tab
    const printTab = window.open('', '_blank');
    printTab.document.write('<html><head><title>Print Label</title>');
    printTab.document.write('<link rel="stylesheet" href="style.css">');
    printTab.document.write('</head><body>');
    printTab.document.write(printContent);
    printTab.document.write('</body></html>');
    printTab.document.close();
    printTab.focus();
    printTab.print();
    printTab.close();
});
