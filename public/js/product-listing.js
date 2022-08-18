var product_object = [];

function getProduct() {
  console.log("frontend getProduct invoked");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/product/getAllProduct", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = () => {
    product_object = JSON.parse(xhr.responseText);
    console.log("product array", product_object);
    displayAllProduct(product_object);
  };
  xhr.send();
}

function displayAllProduct(productArray) {
  // removes all products if have
  var productGrid = document.querySelector(".product-listing");
  while (productGrid.firstChild) {
    productGrid.firstChild.remove();
  }

  var product_object = productArray.result;
  console.log("product object returned:", product_object);

  var totalproduct = Object.keys(product_object).length;
  console.log("total product count:", totalproduct);

  //iterate through all products and add them in html
  for (var iter = 0; iter < totalproduct; iter++) {
    var productId = product_object[iter].product_id;
    var productPrice = product_object[iter].product_price;
    var productImage =
      product_object[iter].product_image_pdath ?? "./images/black-forrest.png";
    console.log(productImage);
    var productName = product_object[iter].product_name;

    var productCell = `<div class="product-container">
    <a class="product-item" item="${productId}" href="public/indiv-product.html?id=${productId}">
        <div class="img-container">
            <img src="${productImage}" alt="">
        </div>
        <h2 class="product-name">${productName}</h2>
        <p class="product-price">${productPrice}</p>
    </a>
</div>`;
    productGrid.insertAdjacentHTML("beforeend", productCell);
  }
}
