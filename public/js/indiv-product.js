function getProductId() {
  var url_string = window.location.href;
  var url = new URL(url_string); //creating a new url
  var productId = parseInt(url.searchParams.get("id")); //search the url parameter to find the array_index and take its value
  console.log("here", productId);
  return productId;
}
function getSpecificProduct() {
  var ProductDetails = [];
  var productId = getProductId();
  var getIndiv = new XMLHttpRequest();
  getIndiv.open("GET", `/product/${productId}`, true);
  getIndiv.onload = () => {
    console.log("xhr called");
    ProductDetails = JSON.parse(getIndiv.responseText).data[0];
    console.log(ProductDetails);
    displayProductInfo(ProductDetails);
  };
  getIndiv.send();
}
function displayProductInfo(productInfo) {
  document.querySelector(".product_title").textContent =
    productInfo.product_name;
  document.querySelector(".product_description").textContent =
    productInfo.product_description;
  document.querySelector(".product_price").textContent =
    productInfo.product_price;
  document.querySelector(".product_region").textContent =
    productInfo.product_region;
  document.querySelector(".product_flavour").textContent =
    productInfo.product_flavour;
  document.querySelector(".product_type").textContent =
    productInfo.product_type;
}
