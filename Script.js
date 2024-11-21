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
            <p><strong>Weight:</strong> ${weight}</p>
            <p><strong>ASN:</strong> ${asn}</p>
            <p><strong>MPN:</strong> ${mpn}</p>
            <p><strong>Pallet ID:</strong> ${pallet}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Country of Origin:</strong> ${country}</p>
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
