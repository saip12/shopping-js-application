var removedItem,
    sum = 0;

(function(){
  // calculate the values at the start
  

  //Generate the Dynamic HTML for products
  loadJSON(function(data){
    data=JSON.parse(data);
    
    var html='';

    for(var key in data.products){
      
    
     html=html+`<tr><td>
          <div class="item">
            <div class="item-front">
              <img src="images/products.jpg" />
            </div>
            <div class="item-back">
              <img src="images/products.jpg" />
            </div>
          </div>
          <p>`+
            key+`<sup>&reg;</sup><br />
            <span class="itemNum">CM-6A</span>
          </p>
          <p class="description">`+data.products[key].description+`</p>
        </td>
        <td>$`+data.products[key].MSRPPrice+` </td>
        <td>
          <input type="number" class="quantity" value="1" min="1" />
          <a href="#" class="remove">Remove</a>
        </td>
        <td class="itemTotal"> $`+data.products[key].MSRPPrice+ `</td></tr>`;

        


      }

      var div=document.createElement('tbody');
        div.innerHTML=html;
     document.getElementById("productsID").appendChild(div);

  });
  
  // Click to remove an item
  window.onload=function(){

    calculatePrices();
  
  
  var a_remove_elements=document.querySelectorAll("a.remove");
  for(var i=0;i<a_remove_elements.length;i++){

    a_remove_elements[i].addEventListener("click",function(){
     removeItem.apply(this);
  })

  }

  var removeAlert_a=document.querySelectorAll(".removeAlert a");
  for(var i=0;i<removeAlert_a;i++){

    removeAlert_a[i].addEventListener("click",function(){
      addItemBackIn();
      hideRemoveAlert();
    })
  }

 var input_Quantity=document.querySelectorAll("input.quantity");

 for(var i=0;i<input_Quantity.length;i++){
  input_Quantity[i].addEventListener("change",function(){
    var val = this.value,
        pricePer,
        total

    if ( val <= "0") {
      removeItem.apply(this);
    } else {
      // reset the prices
      sum = 0;
      
      // get the price for the item

      pricePer = this.parentNode.previousElementSibling.textContent;
      // set the pricePer to a nice, digestable number
      pricePer = formatNum(pricePer);
      // calculate the new total
      total = parseFloat(val * pricePer).toFixed(2);
      // set the total cell to the new price

      
      this.parentNode.nextElementSibling.textContent="$" + total;
      
      // recalculate prices for all items
      calculatePrices();
    };

  })
 }
  
  
}
  
})();



function fadeOutEffect() {
    var fadeTarget = document.querySelector(".removeAlert");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity < 0.1) {
            clearInterval(fadeEffect);
        } else {
            fadeTarget.style.opacity -= 0.1;
        }
    }, 200);
}


function removeItem() {
 // store the html
  removedItem = this.closest("tr").cloneNode()
  // fade out the item row
  
    this.closest("tr").remove()
    sum = 0;
    calculatePrices();
 
  // fade in the removed confirmation alert
  
  
  // default to hide the removal alert after 5 sec
  
}

function hideRemoveAlert() {
  
  fadeOutEffect();
}

function addItemBackIn() {
  sum = 0;
//removedItem).prependTo("table.items tbody").hide(); 

  removedItem[0].insertBefore(document.querySelector("table.items tbody"),document.querySelector("table.items tbody").childNode);
  calculatePrices();
}

function updateSubTotal(){
  var tableItems=document.querySelectorAll("table.items td.itemTotal");
  for(var key in tableItems){
      var value=tableItems[key].textContent;
   if(value){

      value = formatNum(value);

      sum += parseFloat(value);
      console.log("sum is "+sum);
      document.querySelector("table.pricing td.subtotal").textContent="$" + sum.toFixed(2);
    }

  }

}

function addTax() {
  var tax = parseFloat(sum * 0.085).toFixed(2);
  document.querySelector("table.pricing td.tax").textContent="$" + tax;
}

function calculateTotal() {
  var subtotal = document.querySelector("table.pricing td.subtotal").textContent,
      tax = document.querySelector("table.pricing td.tax").textContent,
      
      total;
  
  subtotal = formatNum(subtotal);
  tax = formatNum(tax);

   
  total = (subtotal + tax ).toFixed(2);
  
  document.querySelector("table.pricing td.orderTotal").textContent="$" + total;
}

function calculatePrices() {
  updateSubTotal();
  addTax();
  calculateTotal();
}

function formatNum(num) {
  return parseFloat(num.replace(/[^0-9-.]/g, ''));
}

 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'products.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }