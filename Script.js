document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired");

    // Using mutation observer to detect when content is loaded into the content box
    const content = document.getElementById("content");
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                init();
            }
        });
    });

    observer.observe(content, { childList: true });

    function init() {
        BrowserPrint.getLocalDevices(function(printers) {
            const printersDropdown = document.getElementById("printers");
            const dpiDisplay = document.getElementById("dpiDisplay");
            const previewContainer = document.getElementById("previewContainer");
            
            printers.filter(p => p.type === 'printer').forEach(printer => {
                const option = document.createElement("option");
                option.value = printer.uid;
                option.textContent = printer.name;
                printersDropdown.appendChild(option);
            });

            const printButton = document.getElementById("printButton");
            const previewButton = document.getElementById("previewButton");

            printersDropdown.addEventListener("change", function() {
                const selectedPrinter = printersDropdown.selectedOptions[0];
                dpiDisplay.textContent = selectedPrinter.text.includes("203dpi") ? "203" : "300";
            });

            printButton.addEventListener("click", function() {
                const selectedPrinter = printersDropdown.selectedOptions[0].value;
                const zpl = generateZPL(dpiDisplay.textContent);
                sendToPrinter(zpl, selectedPrinter);
            });
        }, undefined, 'printer');


            previewButton.addEventListener("click", function() {
                const zpl = generateZPL(dpiDisplay.textContent);
                showPreview(zpl);
            });
    }

    function generateZPL(dpi) {
        const weight = document.getElementById("weight").value || "100kg";
        const asn = document.getElementById("asn").value || "123456789";
        const pallet = document.getElementById("pallet").value || "PLT12345";
        const quantity = document.getElementById("quantity").value || "50";
        const country = document.getElementById("country").value || "USA";
    
        
        if (dpi === "203") {
            return `^XA^FO607,67^ADN,40,20^FDCVG110^FS^FO593,33^GB166,100,2^FS^FO33,33^ADN,44,22^FDWeight: ${weight}^FS^FO33,200^GB746,3,2^FS^FO33,233^ADN,44,22^FDASN: ^FS^FO33,320^BCN,53,Y,N,N^FD${asn}^FS^FO33,400^GB746,3,2^FS^FO33,433^ADN,44,22^FDPallet ID: ^FS^FO33,520^BCN,53,Y,N,N^FD${pallet}^FS^FO33,600^GB746,3,2^FS^FO33,633^ADN,44,22^FDQuantity: ^FS^FO33,720^BCN,53,Y,N,N^FD${quantity}^FS^FO33,800^GB746,3,2^FS^FO33,833^ADN,44,22^FDCountry of Origin: ^FS^FO33,920^BCN,53,Y,N,N^FD${country}^FS^FO33,1000^GB746,3,2^FS^XZ`;
        } else {
            return `^XA^FO920,100^ADN,60,30^FDCVG110^FS^FO900,50^GB250,150,3^FS^FO50,50^ADN,50,25^FDWeight: ${weight}^FS^FO50,300^GB1120,5,3^FS^FO50,350^ADN,50,25^FDASN: ^FS^FO50,480^BCN,80,Y,N,N^FD${asn}^FS^FO50,600^GB1120,5,3^FS^FO50,650^ADN,50,25^FDPallet ID: ^FS^FO50,780^BCN,80,Y,N,N^FD${pallet}^FS^FO50,900^GB1120,5,3^FS^FO50,950^ADN,50,25^FDQuantity: ^FS^FO50,1080^BCN,80,Y,N,N^FD${quantity}^FS^FO50,1200^GB1120,5,3^FS^FO50,1250^ADN,50,25^FDCountry of Origin: ^FS^FO50,1380^BCN,80,Y,N,N^FD${country}^FS^FO50,1500^GB1120,5,3^FS^XZ`;
        }
    }

    function sendToPrinter(zpl, printerName) {
        const config = new BrowserPrint.Config();
        config.printer = printerName;
        config.jobName = "ZPL Label";
        BrowserPrint.write(zpl, config, (response) => {
            console.log("Print response:", response);
        }, (error) => {
            console.error("Print error:", error);
        });
    }

    function showPreview(zpl) {
        const previewIframe = document.getElementById("previewIframe");
        const encodedZPL = encodeURIComponent(zpl);
        const labelaryUrl = `https://api.labelary.com/v1/printers/12dpmm/labels/4x6/0/${encodedZPL}`;
        console.log(`Fetching from URL: ${labelaryUrl}`);
    
        fetch(labelaryUrl, {
            headers: {
                "Accept": "application/pdf"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            previewIframe.src = url;
        })
        .catch(error => {
            console.error("Error fetching preview:", error);
            previewIframe.src = '';
            previewIframe.alt = `Error: ${error.message}`;
        });
    }
    
    window.onload = function() {
        setupPrinters();
        init();
    }
});
