const jwt = require("jsonwebtoken");
const { SECRET_KEY, emailUsername, emailPassword, emailService } = require("../config/index");
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require('fs').promises;
const path = require('path');

module.exports.ValidateSignature = async (req) => {
  try {
    const token = req.headers.authorization;
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

module.exports.FormatDate = () => {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDate = currentDate.toLocaleString("en-US", options);

  const formattedDateWithHyphens = formattedDate.replace(/[\s,:]+/g, '-');
  return formattedDateWithHyphens;
};

module.exports.createBillPDF = async (BillData) => {
  const {
    BillNumber,
    BillDate,
    ShipmentAddress,
    Products,
    User,
    Profile,
    PaymentMethod,
    Quantity,
    SumTotal
  } = BillData;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 700]);

  // Define a font
  const font = await pdfDoc.embedFont("Helvetica", { subset: true });

  // Set the font size and color
  const fontSize = 10;
  const fontColor = rgb(0, 0, 0);

  // Function to add text to the PDF
  function addText(x, y, text, width) {
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: fontColor,
      width: width 
    });
  }

  // Add the title
  addText(50, 650, "Product Bill Invoice");

  // Add company information
  addText(50, 630, "Your Company Name");
  addText(50, 615, "Company Address");
  addText(50, 600, "City, State, ZIP Code");
  addText(50, 585, "Phone Number");
  addText(50, 570, "Email Address");
  addText(50, 555, "Website");

  // Add invoice details
  addText(50, 520, `Invoice Number: ${BillNumber}`);
  addText(50, 505, `Invoice Date: ${BillDate}`);
  addText(50, 475, `Customer Name: ${Profile[0].name}`);
  addText(50, 460, `Customer Address: ${ShipmentAddress}`);
  addText(50, 445, `Customer Email: ${User.email}`);
  addText(50, 430, `Customer Phone: ${User.phoneNo}`);
  
  // Add product list
  // Define the table header
  addText(50, 390, "Product ID", 150);
  addText(200, 390, "Name", 100);
  addText(300, 390, "Description", 120);
  addText(420, 390, "Quantity", 50);
  addText(470, 390, "Unit Price", 50);
  addText(520, 390, "Total Price", 50);

  let yOffset = 370;
    yOffset -= 20; // Adjust the vertical spacing as needed
    addText(50, yOffset, Products._id, 150);
    addText(200, yOffset, Products.name, 100);
    addText(300, yOffset, Products.description, 120);
    addText(430, yOffset, Quantity, 50);
    addText(475, yOffset, `$${Products.finalPrice.toFixed(2)}`, 50);
    addText(525, yOffset, `$${(Products.finalPrice * Quantity).toFixed(2)}`, 50);
  
  // Add total price and payment method
  addText(50, 300, `Total Price: $${SumTotal.toFixed(2)}`);
  addText(50, 280, `Payment Method: ${PaymentMethod}`);

  // Add footer and signature
  addText(50, 40, "Notes/Additional Information");
  addText(50, 25, "Contact Information for Inquiries");
  addText(50, 10, "Disclaimer: Payments are non-refundable");

  const dirName = path.join(__dirname, 'BillPDFs');
  try {
    await fs.mkdir(dirName, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  // Save the PDF to the directory
  const pdfFileName = path.join(dirName, `${BillNumber}.pdf`);
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(pdfFileName, pdfBytes);

  return pdfFileName;
};

module.exports.EmailSend = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    });

    const mailOptions = {
      from: emailUsername,
      to: data,
      subject: "Verify your account",
      text: `Hello,\n\nYour Order has been created :\n\nThank you`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);

    return { message: 'Verification email sent.' };
  } catch (error) {
    console.error(error);
  }
}