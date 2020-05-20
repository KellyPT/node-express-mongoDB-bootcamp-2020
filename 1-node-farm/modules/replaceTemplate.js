module.exports = (template, productData) => {
  let output = template.replace(/{%PRODUCT_NAME%}/g, productData.productName);
  output = output.replace(/{%IMAGE%}/g, productData.image);
  output = output.replace(/{%PRODUCT_QUANTITY%}/g, productData.quantity);

  output = output.replace(/{%PRODUCT_PRICE%}/g, productData.price);
  output = output.replace(/{%PRODUCT_ID%}/g, productData.id);
  output = output.replace(/{%PRODUCT_ORIGIN%}/g, productData.from);
  output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, productData.nutrients);
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, productData.description);

  if (!productData.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return output;
};
