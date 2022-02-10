// import Shopify, { ApiVersion } from "@shopify/shopify-api";
const Shopify = require('shopify-api-node');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class Products {
  constructor() { }
  getProducts(shop, accessToken, id) {
    return new Promise(async function (res, rej) {
      try {
        await delay(500);
        const shopify = new Shopify({
          shopName: shop,
          accessToken: accessToken
        });
        let params = {};
        if (id == '') {
          params = { limit: 50, status: 'active' };
        } else {
          params = id;
        }
        const productApi = await shopify.product.list(params);
        /* do {
           const productApi = await shopify.product.list(params);
           await connect.makeProducts(shop, productApi);
         //  products.push(productApi);
          // console.log(products.length);
           params = productApi.nextPageParameters;
           console.log(params)
         } while (params !== undefined);*/
        return res({ nextpage: productApi.nextPageParameters, prevpage: productApi.previousPageParameters, products: productApi })
      } catch (ev) {
        console.log(ev);
      }
    });
  }
  getProduct(shop, accessToken, id) {
    return new Promise(async function (res, rej) {
      try {
        const shopify = new Shopify({
          shopName: shop,
          accessToken: accessToken
        });
        const productApi = await shopify.product.get(id);
        return res(productApi);
      } catch (ev) {
        console.log(ev);
      }
    });
  }
}
module.exports = new Products();