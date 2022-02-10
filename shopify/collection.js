const Shopify = require('shopify-api-node');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class Collections {
  constructor() { }
  getCollections(shop, accessToken, id) {
    return new Promise(async function (res, rej) {
        try {
          await delay(500);
          const shopify = new Shopify({
            shopName: shop,
            accessToken: accessToken
          });
          let params = {};
          if (id == '') {
            params = { limit: 50 };
          } else {
            params = id;
          }
          const smartCollect = await shopify.customCollection.list(params);
          return res({ nextpage: smartCollect.nextPageParameters, prevpage: smartCollect.previousPageParameters, smartCollect: smartCollect })
        } catch (ev) {
          console.log(ev);
        }
    });
  }
}
module.exports = new Collections();