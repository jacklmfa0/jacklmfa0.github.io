document.addEventListener('DOMContentLoaded', function() {
    // Create basic form structure
    const form = document.createElement('form');
    form.id = 'labelForm';
    form.style.margin = '20px';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.alignItems = 'center';
    form.style.justifyContent = 'center';
    form.style.height = '100vh';

    // Define form fields
    const fields = ['Weight', 'ASN', 'MPN', 'Pallet ID', 'Quantity', 'Country'];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.style.marginBottom = '20px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.width = '100%';
        div.style.maxWidth = '300px';

        const label = document.createElement('label');
        label.textContent = field + ': ';
        label.style.marginRight = '10px';
        label.style.flex = '1';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = field.toLowerCase().replace(/ /g, '_');
        input.name = field.toLowerCase().replace(/ /g, '_');
        input.required = true;
        input.style.width = '200px';
        input.style.flex = '2';

        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });

    // Add print button
    const printButton = document.createElement('button');
    printButton.textContent = 'Print Label';
    printButton.type = 'submit';
    form.appendChild(printButton);

    // Add form to document
    document.body.appendChild(form);

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const formValues = {};
        fields.forEach(field => {
            const id = field.toLowerCase().replace(/ /g, '_');
            const value = document.getElementById(id).value;
            formValues[id] = value;
        });

        // Create print window
        const printWindow = window.open('', '_blank');
        
        // Convert formValues to a JSON string to pass between windows
        const formValuesString = JSON.stringify(formValues);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                <style>
                    @media print {
                        @page {
                            size: 4in 80in portrait;
                            margin: 0;
                        }
                        body {
                            width: 4in;
                            height: 80in;
                            margin: 0;
                            padding: 0.25in;
                            box-sizing: border-box;
                            font-family: Arial, sans-serif;
                        }
                        .label-content {
                            width: 100%;
                            height: 100%;
                            position: relative;
                        }
                        .field {
                            margin-bottom: 0.2in;
                            font-size: 12pt;
                            page-break-inside: avoid;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                        }
                        .field-label {
                            margin-bottom: 0.05in;
                            font-weight: bold;
                        }
                        .header {
                            position: absolute;
                            top: 0.25in;
                            right: 0.25in;
                            padding: 0.1in;
                        }
                        svg {
                            display: block;
                            margin-top: 0.05in;
                            max-width: 3.5in;
                            height: 0.5in;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="label-content">
                    <div class="header">CVG110</div>
                    <div class="field">
                        <div class="field-label"><strong>Weight:</strong> <span id="weightValue"></span></div>
                    </div>
                    <div class="field">
                        <div class="field-label"><strong>ASN:</strong> <span id="asnValue"></span></div>
                        <svg id="asnBarcode"></svg>
                    </div>
                    <div class="field">
                        <div class="field-label"><strong>MPN:</strong> <span id="mpnValue"></span></div>
                        <svg id="mpnBarcode"></svg>
                    </div>
                    <div class="field">
                        <div class="field-label"><strong>Pallet ID:</strong> <span id="palletValue"></span></div>
                        <svg id="palletBarcode"></svg>
                    </div>
                    <div class="field">
                        <div class="field-label"><strong>Quantity:</strong> <span id="quantityValue"></span></div>
                        <svg id="quantityBarcode"></svg>
                    </div>
                    <div class="field">
                        <div class="field-label"><strong>Country:</strong> <span id="countryValue"></span></div>
                        <svg id="countryBarcode"></svg>
                    </div>
                </div>
                <script>
                    const formValues = ${formValuesString};

                    document.addEventListener('DOMContentLoaded', function() {
                        // Populate text values
                        document.getElementById('weightValue').textContent = formValues.weight || '';
                        document.getElementById('asnValue').textContent = formValues.asn || '';
                        document.getElementById('mpnValue').textContent = formValues.mpn || '';
                        document.getElementById('palletValue').textContent = formValues.pallet_id || '';
                        document.getElementById('quantityValue').textContent = formValues.quantity || '';
                        document.getElementById('countryValue').textContent = formValues.country || '';

                        const barcodeConfig = {
                            format: "CODE128",
                            width: 2,
                            height: 40,
                            displayValue: true
                        };

                        // Generate barcodes if values are present
                        if (formValues.asn) {
                            JsBarcode("#asnBarcode", formValues.asn, barcodeConfig);
                        }
                        if (formValues.mpn) {
                            JsBarcode("#mpnBarcode", formValues.mpn, barcodeConfig);
                        }
                        if (formValues.pallet_id) {
                            JsBarcode("#palletBarcode", formValues.pallet_id, barcodeConfig);
                        }
                        if (formValues.quantity) {
                            JsBarcode("#quantityBarcode", formValues.quantity, barcodeConfig);
                        }
                        if (formValues.country) {
                            JsBarcode("#countryBarcode", formValues.country, barcodeConfig);
                        }
                    });

                    window.onload = function() {
                        setTimeout(() => {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        }, 1000);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    });
});
