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

    // Create a new window and print the content
    const printWindow = window.open('', '', 'width=6in,height=4in');
    printWindow.document.write('<html><head><title>Print Label</title>');
    printWindow.document.write('<link rel="stylesheet" href="style.css">');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
});
