var product_object = [];

function getCafe() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/cafe", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = () => {
    product_object = JSON.parse(xhr.responseText);
    console.log("product array", product_object);
    displayAllCafe(product_object);
  };
  xhr.send();
}

function displayAllCafe(productArray) {
  var productGrid = document.querySelector(".product-listing");
  while (productGrid.firstChild) {
    productGrid.firstChild.remove();
  }

  var productCount = productArray.result;
  var productDetails = productArray.cafe_details;

  console.log("cafe like count", productCount, productArray);

  var totalCafe = productDetails.length;
  console.log("total cafe count:", totalCafe);

  for (var iter = 0; iter < totalCafe; iter++) {
    if (productCount[iter] === undefined || null) {
      likeCount = 0;
    } else if (
      productCount[iter].liked_cafe_id === productDetails[iter].cafe_id
    ) {
      likeCount = productCount[iter].count;
    }
    var cafeId = productDetails[iter].cafe_id;
    var cafeImage =
      productDetails[iter].images_path ??
      "./images/christina-rumpf-LMzwJDu6hTE-unsplash.jpg";
    var cafeName = productDetails[iter].cafe_name;
    var cafeDescription = productDetails[iter].description ?? "No description";
    var cafeRating = productDetails[iter].rating ?? "No reviews yet";
    var contact = productDetails[iter].telephone_no ?? "No contact available";
    var display_address =
      productDetails[iter].display_address ?? "Not yet found";
    var opening_hours = productDetails[iter].opening_hours ?? "Not yet found";

    var cafeCell = `<a class="cafe-item" item="${cafeId}" href="http://localhost:3000/indiv-cafe.html?id=${cafeId}">\
      <div class="circular--landscape">\
          <img src="${cafeImage}" alt="${cafeImage} Image">\
      </div>\
      <div class="cafe-content">\
          <h3 class="cafe-name medium-heading">${cafeName}</h3>\
          <div class="flex-content">\
              <div class="rating-wrapper">\
                  <h4 class="small-heading rating">Rating</h4>\
                  <p class="rating">${cafeRating}</p>\
              </div>\
              <div class="likes-wrapper">\
                  <h4 class="small-heading likes">Likes</h4>\
                  <p class="likes">${likeCount}</p>\
              </div>\
          </div>\
          <div class="cafe-details">\
              <div class="location">\
                  <h4 class="small-heading location">Visit Us</h4>\
                  <p class="display-location">${display_address}</p>\
              </div>\
              <div class="flex-content">\
                  <div class="opening-hours">\
                      <h4 class="small-heading">Opening Hours</h4>\
                      <p class="cafe-opening-hours">${opening_hours}</p>\
                  </div>\
                  <div class="contact">\
                      <h4 class="small-heading">Contact</h4>\
                      <p class="cafe-number">${contact}</p>\
                  </div>\
              </div>\
          </div>\
          <div class="cafe-description">\
              <h4 class="small-heading">Description</h4>\
              <p class="cafe-desc">${cafeDescription}</p>\
          </div>
      </div>
  </a>`;
    productGrid.insertAdjacentHTML("beforeend", cafeCell);
  }
}
