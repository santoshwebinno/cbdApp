const Shopify = require('shopify-api-node');
class DraftOrder {
    constructor() {}
    createDraft(shop, accessToken, cart){
        return new Promise(async function (res, rej) {
            try {
                const shopify = new Shopify({
                    shopName: shop,
                    accessToken: accessToken
                  });
                  shopify.draftOrder.create({"line_items": cart}).then(data => {
                    return res(data);
                  }).catch(err => console.log('wawawoowa', err)); 
            } catch (ev) {
                console.log(ev);
                }
            });
    }
}
module.exports = new DraftOrder();