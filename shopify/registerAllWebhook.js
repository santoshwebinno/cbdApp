import Shopify, { DataType } from "@shopify/shopify-api";
class registerAllWebhooks {
  constructor() {}
  async registerUninstallWebhook(shop, accessToken, host) {
    return new Promise(async function (res, rej) {
      console.log("Work ON Uninstalled");
      const client = new Shopify.Clients.Rest(shop, accessToken);
      const webhooksdata = await client.get({
        path: "webhooks",
      });
      var check = false;
      if (webhooksdata.body.webhooks.length > 0) {
        var availCheck = webhooksdata.body.webhooks.find(
          (x) => x.address == `${host}/uninstall`
        );
        if (availCheck == undefined) {
          check = true;
        } else {
          check = false;
          console.log("webhook Already Exist");
          return res("Already exist webhook");
        }
      } else {
        check = true;
      }
      if ((check = true)) {
        const data = await client.post({
          path: "webhooks",
          data: {
            webhook: {
              topic: "app/uninstalled",
              address: `${host}/uninstall`,
              format: "json",
            },
          },
          type: DataType.JSON,
        });
        return res(data);
      }
    });
  }
}
module.exports = new registerAllWebhooks();
