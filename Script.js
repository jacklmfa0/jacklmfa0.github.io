document.getElementById('printButton').addEventListener('click', function() {
    // Collect the form data
    const weight = document.getElementById('weight').value;
    const asn = document.getElementById('asn').value;
    const mpn = document.getElementById('mpn').value;
    const pallet = document.getElementById('pallet').value;
    const quantity = document.getElementById('quantity').value;
    const country = document.getElementById('country').value;

    // Create the printable content
    const printContent = `
        <div class="container1">
            <div class="static-box">CVG110</div>
            <p><strong>Weight:</strong> ${weight}</p>
            <p><strong>ASN:</strong> ${asn} <br><span class="barcode">[Barcode for ${asn}]</span></p>
            <p><strong>MPN:</strong> ${mpn} <br><span class="barcode">[Barcode for ${mpn}]</span></p>
            <p><strong>Pallet ID:</strong> ${pallet} <br><span class="barcode">[Barcode for ${pallet}]</span></p>
            <p><strong>Quantity:</strong> ${quantity} <br><span class="barcode">[Barcode for ${quantity}]</span></p>
            <p><strong>Country of Origin:</strong> ${country} <br><span class="barcode">[Barcode for ${country}]</span></p>
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
