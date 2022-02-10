import Shopify, { DataType } from "@shopify/shopify-api";

class ScrptTag {
  constructor() {}
  create(shop, accessToken, HOST) {
    return new Promise(async function (res, rej) {
      console.log("Work ON script tag");
      const client = new Shopify.Clients.Rest(shop, accessToken);
      const getScript = await client.get({
        path: "script_tags",
      });
      var check = false;
      if (getScript.body.script_tags.length > 0) {
        var availCheck = getScript.body.script_tags.find(
          (x) => x.src == `${HOST}/productscript`
        );
        if (availCheck == undefined) {
          check = true;
        } else {
          check = false;
          console.log("Script Already Exist");
          return res("Already Exist");
        }
      } else {
        check = true;
      }
      if (check == true) {
        const data = await client.post({
          path: "script_tags",
          data: {
            script_tag: {
              event: "onload",
              src: `${HOST}/productscript`,
              display_scope: "online_store",
            },
          },
          type: DataType.JSON,
        });
        return res(data);
      }
    });
  }
}
module.exports = new ScrptTag();