import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
const bodyParser = require("koa-bodyparser");
import cors from "@koa/cors";

import Products from "../shopify/product";
import allCollections from "../shopify/collection";
import connect from '../connection/dbPost'
import scripts from '../shopify/scriptTagCreate'
import script from '../shopify/scripttag';
import DraftOrder from '../shopify/draftorder';
import registerWebhook from '../shopify/registerAllWebhook';
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
let ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.use(bodyParser());
  server.use(cors());
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        // const response = await Shopify.Webhooks.Registry.register({
        //   shop,
        //   accessToken,
        //   path: "/webhooks",
        //   topic: "APP_UNINSTALLED",
        //   webhookHandler: async (topic, shop, body) =>
        //     delete ACTIVE_SHOPIFY_SHOPS[shop],
        // });

        // if (!response.success) {
        //   console.log(
        //     `Failed to register APP_UNINSTALLED webhook: ${response.result}`
        //   );
        // }
        await registerWebhook.registerUninstallWebhook(
          shop,
          accessToken,
          process.env.HOST
        );
        await scripts.create(shop, accessToken, process.env.HOST);
        await connect.makeMongo(shop, accessToken);
       //  const products = await Products.getProducts(shop, accessToken);
        // await connect.makeProducts(shop, products);
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/uninstall", async (ctx) => {
    ACTIVE_SHOPIFY_SHOPS = {};
    console.log("We got a Uninstall webhook!");
    ctx.body = ctx.request.body;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });
  // router.post("/webhooks", async (ctx) => {
  //   try {
  //     await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
  //     console.log(`Webhook processed, returned status code 200`);
  //   } catch (error) {
  //     console.log(`Failed to process webhook: ${error}`);
  //   }
  // });
  router.use("/productscript", async (ctx) => {
    var shop = ctx.query.shop;
    var data = await script.makeScript(shop);
    ctx.body = data;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  });
  router.post('/createdraft', async (ctx) => {
    const shop = ctx.query.shop;
    const accessToken = await connect.getAllShop(shop);
    const data = await DraftOrder.createDraft(shop, accessToken, ctx.request.body.cart);
    ctx.body = data;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  })
  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );
  router.post("/getProducts", async (ctx) => {
    // const currentSession = await Shopify.Utils.loadCurrentSession(
    //   ctx.req,
    //   ctx.res
    // );
   // const shop = currentSession.shop;
   const shop = ctx.request.body.shop;
   const accessToken = await connect.getAllShop(shop);
   // const accessToken = currentSession.accessToken;
    const products = await Products.getProducts(shop, accessToken, ctx.request.body.id);
    ctx.body = products;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  })
  router.post("/selectProducts", async (ctx) => {
    // const currentSession = await Shopify.Utils.loadCurrentSession(
    //   ctx.req,
    //   ctx.res
    // );
    // const shop = currentSession.shop;
    const shop = ctx.request.body.shop;
    const products = await connect.saveSelectedPro(shop, ctx.request.body);
    ctx.body = products;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  })
  router.get("/getselectProducts", async (ctx) => {
    var shop = ctx.query.shop;
    var products = await connect.getselectedProduct(shop);
    ctx.body = products;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  })
  /** */
  router.post("/getCollection", async (ctx) => {
    const currentSession = await Shopify.Utils.loadCurrentSession(
      ctx.req,
      ctx.res
    );
    const shop = currentSession.shop;
    const accessToken = currentSession.accessToken;
    const collecion = await allCollections.getCollections(shop, accessToken, ctx.request.body.id);
    ctx.body = collecion;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  })
  router.post("/selectCollections", async (ctx) => {
    const shop = ctx.request.body.shop;
    const products = await connect.saveSelectedCollect(shop, ctx.request.body);
    ctx.body = products;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  })
  router.get("/getselectCollections", async (ctx) => {
    var shop = ctx.query.shop;
    var products = await connect.getselectedCollections(shop);
    ctx.body = products;
    ctx.respond = true;
    ctx.res.statusCode = 200;
  })
  /** */
  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
