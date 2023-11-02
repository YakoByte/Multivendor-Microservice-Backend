const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/index");
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");

module.exports.ValidateSignature = async (req) => {
  try {
    const token = req.headers.authorization;
    // console.log(token);
    const splitToken = token.split(" ")[1];
    const payload = await jwt.verify(splitToken, SECRET_KEY);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    return { message: "Data Not found!" };
  }
};

module.exports.createTaxPDF = async (invoiceData) => {
  const {
    InvoiceNumber,
    InvoiceDate,
    buyerName,
    buyerAddress,
    buyerEmail,
    buyerNumber,
    products,
    paymentMethod,
    payerName,
    cardNumber,
    cardExpiry,
    SumTotal,
  } = invoiceData;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 700]);

  // Define a font
  const font = await pdfDoc.embedFont("Helvetica", { subset: true });

  // Set the font size and color
  const fontSize = 12;
  const fontColor = rgb(0, 0, 0);

  // Function to add text to the PDF
  function addText(x, y, text, width) {
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: fontColor,
      width,
    });
  }

  // Add the title
  addText(200, 670, "Product Tax Invoice");  

  // Add company information
  addText(50, 630, "Your Company Name");
  addText(50, 615, "Company Address");
  addText(50, 600, "City, State, ZIP Code");
  addText(50, 585, "Phone Number");
  addText(50, 570, "Email Address");
  addText(50, 555, "Website");

  // Add invoice details
  addText(50, 530, `Invoice Number: ${InvoiceNumber}`); 
  addText(50, 515, `Invoice Date: ${InvoiceDate}`);
  addText(50, 500, `Customer Name: ${buyerName}`);
  addText(50, 485, `Customer Address: ${buyerAddress}`);
  addText(50, 470, `Customer Email: ${buyerEmail}`);
  addText(50, 455, `Customer Phone: ${buyerNumber}`);

  // Add product list
  // Define the table header
  addText(50, 425, "Product ID", 100);
  addText(150, 425, "Name", 100);
  addText(250, 425, "Description", 200);
  addText(450, 425, "Quantity", 50);
  addText(500, 425, "Unit Price", 80);
  addText(580, 425, "Total Price", 80);

  // Loop through the product data and populate the table
  let yOffset = 405;  // Adjusted Y coordinate
  products.forEach((product) => {
    yOffset -= 20;
    addText(50, yOffset, product.productId, 100);
    addText(150, yOffset, product.name, 100);
    addText(250, yOffset, product.description, 200);
    addText(450, yOffset, product.quantity.toString(), 50);
    addText(500, yOffset, `$${product.price.toFixed(2)}`, 80);
    addText(580, yOffset, `$${product.totalPrice.toFixed(2)}`, 80);
  });

  // Add payment details
  addText(50, 150, `Total Price: $${SumTotal.toFixed(2)}`);  
  addText(50, 130, `Payment Method: ${paymentMethod}`);
  addText(50, 115, `Cardholder Name: ${payerName}`);
  addText(50, 100, `Card Number: **** **** **** ${cardNumber}`);
  addText(50, 85, `Expiry Date: ${cardExpiry}`);

  // Add footer and signature
  addText(50, 60, "Notes/Additional Information");
  addText(50, 45, "Contact Information for Inquiries");
  addText(50, 30, "Disclaimer: Payments are non-refundable");

  // Save the PDF to a file
  const pdfFileName = `${InvoiceNumber}.pdf`;
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfFileName, pdfBytes);

  return pdfFileName;
};