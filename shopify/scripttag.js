require("isomorphic-fetch");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
import connect from '../connection/dbPost'
import productFile from '../shopify/product';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class Myscript {
  constructor() { }
  makeScript(shop) {
    return new Promise(async function (res, rej) {
      var dbData = await connect.getselectedProduct(shop);
      dbData = JSON.stringify(dbData);
      var proHandle = '6985177071705';
      if(shop =='test-netzila.myshopify.com'){
        proHandle = '7183093203112';
      }
      var api_url = process.env.API_URL;
      var host = process.env.HOST;
      const accessToken = await connect.getAllShop(shop);
      var apiProduct = await productFile.getProduct(shop, accessToken, proHandle);
      apiProduct = JSON.stringify(apiProduct);
      var stream;
      stream = await fs.createWriteStream("./shopify/script.js");
      stream.on("error", function (err) {
        console.log(err);
      });
      stream.write(`var s = document.createElement('script');
            s.type = "text/javascript";
            s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
            document.head.appendChild(s);`);

      /** */
      stream.write(`var lk = document.createElement('link');
            lk.rel = "stylesheet";
            lk.href = "https://unpkg.com/@shopify/polaris@5.2.1/dist/styles.css"
            document.head.appendChild(lk);`);
      stream.write(`setTimeout(async()=>{
       // if(__st.pageurl.includes("cart")){
          var products = ${dbData};
          var apiProduct = ${apiProduct};
          var api_url = '${api_url}';
          var host = '${host}';
          var ids = [];
          var checked = false;
          if(products != undefined){
            if(products.allselect == true){
              checked = true;
            }
            if(products.product_ids != undefined){
              ids = JSON.parse(products.product_ids);
            }
          }
          var cart = await fetch('/cart.js', {
            method: 'GET'
          })
          .then(response => {
            return response.json();
          })
          .catch((error) => {
            console.error('Error:', error);
          });
          var items = cart.items;
          var check = false;
          if(checked == true){
            check = true;
          }else{
            for(let id of ids){
              var t = items.find(x=> parseInt(x.product_id) == parseInt(id))
              if(t != undefined){
                check = true;
                break;
              }
            }
          }
          
          console.log(check);
          var variantId=apiProduct.variants[0].id;
          var sku = apiProduct.variants[0].sku;
          if(check === true){
           console.log(apiProduct);
            var popup = \`<div class="Polaris-Modal-Dialog__Container" data-polaris-layer="true" data-polaris-overlay="true" style="display:none;"><div><div role="dialog" aria-modal="true" aria-labelledby="Polarismodal-header2" tabindex="-1" class="Polaris-Modal-Dialog">
            <div class="Polaris-Modal-Dialog__Modal">
            <div class="Polaris-Modal-Header" style="border-bottom: none;">
              <button class="Polaris-Modal-CloseButton" style="position: absolute; right: 25px; top: 8px;" aria-label="Close"><span class="Polaris-Icon Polaris-Icon--colorBase Polaris-Icon--applyColor"><span class="Polaris-VisuallyHidden"></span><svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="m11.414 10 6.293-6.293a1 1 0 1 0-1.414-1.414L10 8.586 3.707 2.293a1 1 0 0 0-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 1 0 1.414 1.414L10 11.414l6.293 6.293A.998.998 0 0 0 18 17a.999.999 0 0 0-.293-.707L11.414 10z"></path></svg></span></button>
            </div>
            <div class="Polaris-Modal__BodyWrapper">
            <div class="Polaris-Modal__Body Polaris-Scrollable Polaris-Scrollable--vertical" data-polaris-scrollable="true"><section class="Polaris-Modal-Section">
            <div class="Polaris-TextContainer">
            <div class="">
            <div class="custom_pop_out">
            <div class="pop_hdr">
              <h2>Vape Tax Detected</h2>
              <p>Enter <b>Shipping</b> State & Zip code to Calculate Applicable Vape Tax.</p>
                <div class="formOuter">
                  <div class="code_fm">
                    <label for="State">State</label>
                    <select name="State" id="State">
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AS">American Samoa</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="UM-81">Baker Island</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="GU">Guam</option>
                      <option value="HI">Hawaii</option>
                      <option value="UM-84">Howland Island</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="UM-86">Jarvis Island</option>
                      <option value="UM-67">Johnston Atoll</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="UM-89">Kingman Reef</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="UM-71">Midway Atoll</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="UM-76">Navassa Island</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="MP">Northern Mariana Islands</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="UM-95">Palmyra Atoll</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="PR">Puerto Rico</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UM">United States Minor Outlying Islands</option>
                      <option value="VI">United States Virgin Islands</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="UM-79">Wake Island</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                  </div>

                  <div class="code_fm">
                    <input id="zip" type="text" placeholder="Zip Code">
                  </div>
                </div>
              </div>
              <div class="pop_foot">
                <div class="footer_data">
                  <p>*Federal Law (PACT Act) requires Vape Products to be taxed at all state, 
                    county, city and town levels. 
                    You may not be responsible for vape tax depending on your shipping location.</p>
                    <img src="https://cdn.shopify.com/s/files/1/0048/2384/2905/files/blackTHCXTRACTLOGO_7a328280-9614-4f8c-ace6-7627d469959a_190x.png">
                </div>
              </div>
            </div>
            </div></div></section></div></div>
            <div class="Polaris-Modal-Footer"><div class="Polaris-Modal-Footer__FooterContent">
            <div class="Polaris-Stack Polaris-Stack--alignmentCenter">
            <div class="Polaris-Stack__Item Polaris-Stack__Item--fill">
            </div>
            <div class="Polaris-Stack__Item">
            <div class="Polaris-ButtonGroup"><div class="Polaris-ButtonGroup__Item"><button id="btn-connect" class="Polaris-Button Polaris-Button--primary connctWallect" type="button"><span class="Polaris-Button__Content"><span class="Polaris-Button__Text">Go to Checkout</span></span></button></div></div></div></div></div></div></div></div></div></div> \`;  
           
            $('body').append(popup);
            $('head').append(\`<style>
            .pop_hdr h2 {
              text-align: center;
              text-transform: capitalize;
              font-size: 45px;
              letter-spacing: 0;
              margin-bottom: 30px;
              font-weight: 900;
              color: #000;
              line-height: 45px;
            }
            .pop_hdr p {
              text-align: center;
              color: #000;
              font-size: 17px;
              font-weight: 500;
              margin-bottom: 40px;
            }
            .code_fm select#State {
              border: navajowhite;
              margin: 0;
              padding: 0;
            }
            .code_fm select#State:focus-visible, input#zip:focus-visible {
              outline: none;
              box-shadow: none;
              outline-offset: 0;
          }
            .code_fm {
              border: 1px solid #ffbd00;
              border-radius: 5px;
              padding: 6px 10px;
              width: 48%;
              min-height: 56px;
            }
            .pop_hdr form {
              display: flex;
              margin: 0 auto;
              position: inherit;
              width: 100%;
              max-width: 510px;
              justify-content: center;
              gap: 10px;
              flex-wrap: wrap;
            }
            .pop_hdr label {
              margin-bottom: 0;
              font-weight: bold;
              letter-spacing: 0px !important;
              text-transform: capitalize !important;
            }
            input#zip {
              border: 0;
              display: block;
              width: 100%;
              height: 100%;
              padding: 0;
              margin: 0;
              min-height: 42px;
            }
            input#zip::placeholder {
              opacity: 1;
            }
            .footer_data {
              display: flex;
              align-items: center;
              margin-top: 40px;
              gap: 10px;
              flex-wrap: wrap;
            }
            .custom_pop_out {
              max-width: 680px;
              margin: 0 auto;
              padding: 10px;
            }
            .footer_data p {
              font-family: 'Open Sans';
              font-size: 13px;
              color: #000;
              line-height: 18px;
            }
            .formOuter {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              max-width: 500px;
              margin: 0 auto;
          }
          .code_fm input, .code_fm select, .code_fm select option {
              font-size: 15px;
              color: #000;
              font-weight: bold;
              opacity: 1;
          }
               .formOuter input#zip::placeholder {
              opacity: 1;
              color: #000;
          }
                .footer_data {justify-content: center;}
            select#State { width: 100%;}
            @media screen and (max-width: 450px) {.formOuter {flex-direction: column;} .pop_hdr form{flex-direction: column;}.code_fm {width: 100%;}.footer_data {
              justify-content: center;text-align: center;}.pop_hdr h2 {font-size: 29px;margin-bottom: 24px;line-height: 34px;}.pop_hdr p {
                font-size: 14px;margin-bottom: 35px;}.footer_data{margin-top: 30px;}
              .code_fm select#State, input#zip, input#zip::placeholder{font-size: 14px !important;}section.Polaris-Modal-Section {padding: 1rem;}}  
            @media screen and (min-width: 750px) {.footer_data p {width: 55%;}}
            @media only screen and (min-width: 751px) and (max-width: 991px)  {.Polaris-Modal-Dialog__Modal {max-width: 80%;margin: 0 auto;}}
        
          </style>\`);
            // $('button[name="checkout"]').insertAfter('<button type="button" class="cbd-checkout" style="background: #47c1bf; width: 100%; padding: 10px;">Check Out</button>');
            $('button[name="checkout"]').addClass('cbd-checkout');
            $('button[name="checkout"]').attr('type', 'button');
            $('button[name="checkout"]').attr('name', ''); 
          }
          $('.cbd-checkout').click(function(){
            $('.Polaris-Modal-Dialog__Container').show();
          })
          $('.Polaris-Modal-CloseButton svg').click(function(){
            $('.Polaris-Modal-Dialog__Container').hide();
          })
          $('.skip span').click(function(){
            $('.cbd-checkout').attr('name', 'checkout');
            $('.cbd-checkout').attr('type', 'submit');
            $('.cbd-checkout').click();
          })
          $('#zip').keydown(function(event) {
            if (event.keyCode == 13) {
                var state = $('#State').val();
                var zip=$('#zip').val();
                console.log(zip);
                $.ajax({
                  type: 'GET',
                  url: api_url+'/api/tax/'+state+'/'+zip+'/'+sku,
                  dataType: 'json', 
                  success: function (data) { 
                    console.log(data);
                  }
                });
            }
        });

          $('#btn-connect').click(async function(e){
           // $(this).html('<span class="Polaris-Button__Content"><span class="Polaris-Button__Spinner"><span class="Polaris-Spinner Polaris-Spinner--sizeSmall"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path></svg></span><span role="status"><span class="Polaris-VisuallyHidden">Loading</span></span></span><span class="Polaris-Button__Text">Go to Checkout</span></span>')
            $(this).addClass("Polaris-Button--disabled Polaris-Button--loading");
            $(this).attr("disabled", "disabled");
            $(this).removeClass("Polaris-Button--primary ")
            e.preventDefault();
            var cart = await fetch('/cart.js', {
              method: 'GET'
            })
            .then(response => {
              return response.json();
            })
            .catch((error) => {
              console.error('Error:', error);
            });
            var items = cart.items;
            items.push({'quantity': 1, "price": '22.00', 'title': 'Vape Tax Detected'})
            console.log(items);
            $.ajax({
              type: 'POST',
              url: host+'/createdraft?shop='+Shopify.shop,
              data: {
                'cart': items
              },
              dataType: 'json', 
              success: function (data) { 
                console.log(data)
                window.location.href=data.invoice_url;
                // $('.cbd-checkout').attr('name', 'checkout');
                // $('.cbd-checkout').attr('type', 'submit');
                // $('.cbd-checkout').click();
              } 
            });
          })
        // }
        }, 500)`);
      stream.end();
      await delay(800);
      var readStream = await fs.createReadStream("./shopify/script.js");
      return res(readStream);
    });
  }
}
module.exports = new Myscript();
