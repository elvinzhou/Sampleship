const ShipEngine = require('shipengine');
const engine = new ShipEngine('TEST_G73rnPl8Acj8QNLnY/Rt/jRxRQrlhnd10VJxzoG9LU4');

async function listCarriers() {
  const carrierIds = ["se-626019","se-886198","se-623344"];
  return carrierIds;
}

async function listSandboxCarriers() {
  const carrierIds = ["se-621611", "se-621612"];
  return carrierIds;
}

async function getRates(shipmentdeets) {
  const carrierIds = await listSandboxCarriers();
  const params = {
    rateOptions: {
      carrierIds:carrierIds,
    },
    shipment:shipmentdeets
  };
  console.log(params)
  try {
    const result = await engine.getRatesWithShipmentDetails(params);
    console.log(result);
    return result;
  } catch (e) {
    console.log("Error creating rates: ", e.message);
    return e;
  }
}

async function createlabel(chosenrate) {
  const params = {
    rateId: chosenrate,
    validateAddress: "no_validation",
    labelLayout: "4x6",
    labelFormat: "pdf",
    labelDownloadType: "url",
    displayScheme: "label"
  }

  try {
  const result = await engine.createLabelFromRate(params);

  console.log("The label that was created:");
  console.log(result);
  return result;
} catch (e) {
  console.log("Error creating label: ", e.message);
}
}

async function validateAddresses(address) {
  console.log(address);
  const params = [{
    name: address.name,
    companyName: address.company,
    addressLine1: address.line1,
    addressLine2: address.line2,
    cityLocality: address.city,
    stateProvince: address.state,
    postalCode: address.zip,
    countryCode: address.countryCode,
  }];

  try {
    const result = await engine.validateAddresses(params);

    if (result[0].status === 'verified') {
      // Success! Print the formatted address
      console.log("Successfully normalized the address!");
      console.log(result);
   }
   else {
     // Bad address. Print the warning & error messages
     console.log("The address is not valid");
     console.log(result);
     console.log(result[0].messages);
   }
  } catch (e) {
    console.log("Error validating address: ", e.message);
  }
}

async function trackUsingCarrierCodeAndTrackingNumber(carrierCode, trackingNumber) {
  try {
    const result = await engine.trackUsingCarrierCodeAndTrackingNumber({carrierCode: carrierCode, trackingNumber: trackingNumber});

    console.log("Tracking info:");
    console.log(result);
  } catch (e) {
    console.log("Error tracking shipment: ", e.message);
  }
}

module.exports = {getRates, createlabel, validateAddresses, trackUsingCarrierCodeAndTrackingNumber}
