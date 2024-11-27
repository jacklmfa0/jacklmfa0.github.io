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
        <div class="printable-page">
            <div class="top-right-box">CVG110</div> 
            <div class="section">
                <strong>Weight:</strong> ${weight}
            </div>
            <br>
            <br>
            <hr class="full-width">
            <div class="section">
                <strong>ASN:</strong> ${asn}<br>
                <svg id="asnBarcode"></svg>
            </div>
            <hr class="full-width">
            <div class="section">
                <strong>MPN:</strong> ${mpn}<br>
                <svg id="mpnBarcode"></svg>
            </div> 
            <hr class="full-width">
            <div class="section">
                <strong>Pallet ID:</strong> ${pallet}<br>
                <svg id="palletBarcode"></svg>
            </div>
            <hr class="full-width">
            <div class="section">
                <strong>Quantity:</strong> ${quantity}<br>
                <svg id="quantityBarcode"></svg>
            </div>
            <hr class="full-width">
            <div class="section">
                <strong>Country of Origin:</strong> ${country}<br>
                <svg id="countryBarcode"></svg>
            </div>
        </div>
    `;

    // Open the printable content in a new tab
    const printTab = window.open('', '_blank');
    printTab.document.write('<html><head><title>Print Label</title>');
    printTab.document.write(`
        <style>
            @page {
                size: 4in 6in; /* Ensure portrait mode is enforced */
                margin: 0; /* Set margin to none by default */
            }
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                height: 100%; /* Ensure body height is 100% */
                width: 100%; /* Ensure body width is 100% */
            }
            .printable-page {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 10px;
                box-sizing: border-box;
                position: relative; /* Ensure absolute elements are positioned correctly */
            }
            .top-right-box {
                position: absolute;
                top: 0;
                right: 0;
                padding: 10px;
                background-color: #f0f0f0;
            }
            .section {
                margin-bottom: 10px;
                text-align: left; /* Align text to the left */
                margin-left: 5px;
                overflow: hidden; /* Prevent overflow issues */
            }
            .barcode {
                display: block;
                margin-top: 1px; /* Adjust margin below the text */
            }
            .full-width {
                width: 90%; /* Make hr span the full width */
                margin: auto; /* Center hr horizontally */
            }
        </style>
    `);
    printTab.document.write('</head><body>');
    printTab.document.write(printContent);
    printTab.document.write(`
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
            JsBarcode("#asnBarcode", "${asn}", { format: "CODE39", width: 1, height: 30, fontSize: 10, margin: 1 });
            JsBarcode("#mpnBarcode", "${mpn}", { format: "CODE39", width: 1, height: 30, fontSize: 10, margin: 1 });
            JsBarcode("#palletBarcode", "${pallet}", { format: "CODE39", width: 1, height: 30, fontSize: 10, margin: 1 });
            JsBarcode("#quantityBarcode", "${quantity}", { format: "CODE39", width: 1, height: 30, fontSize: 10, margin: 1 });
            JsBarcode("#countryBarcode", "${country}", { format: "CODE39", width: 1, height: 30, fontSize: 10, margin: 1 });
        </script>
    `);
    printTab.document.write('</body></html>');
    printTab.document.close();
    printTab.focus();
    printTab.print();
    printTab.close();
});
