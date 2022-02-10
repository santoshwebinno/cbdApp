const knex = require("knex");
//# DATABASE_URL
const pool = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 1,
    max: 50,
  },
});
//# PGSSLMODE : no-verify 
// const pool = knex({
//   client: "pg",
//   connection: {
//     user: process.env.PGUSER, // e.g. 'my-user'
//     password: process.env.PGPASSWORD, // e.g. 'my-user-password'
//     database: process.env.PGDATABASE, // e.g. 'my-database'
//     host: process.env.PGHOST, // e.g. '127.0.0.1'
//     port: process.env.PGPORT, // e.g. '5432'
//   },
//   debug: true,
// });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class UserPostdb {
  constructor() {}
  getAllShop(shop) {
    return new Promise(async function (res, rej) {
      try {
        await pool
          .select("*")
          .where("name", shop)
          .from("shops")
          .first()
          .then((rows) => {
            return res(rows.password);
          });
      } catch (ev) {
        console.log(ev);
      }
    });
  }

  makeMongo(shop, accessToken) {
    return new Promise(async function (res, rej) {
      pool
        .select("*")
        .where("name", shop)
        .from("shops")
        .then((rows) => {
          if (rows.length > 0) {
            pool("shops")
              .where("name", shop)
              .update({ password: accessToken })
              .catch((ex) => {
                console.log(ex);
              });
            return res("done");
          } else {
            pool("shops")
              .insert({ name: shop, password: accessToken })
              .catch((ex) => {
                console.log(ex);
              });
            return res("done");
          }
        })
        .catch((ex) => {
          console.log(ex);
        });
    });
  }
  makeProducts(shop, products){
    return new Promise(async function (res, rej) {
        for (let product of products) {
            var image = '';
            if (product.images.length > 0) {
                image = product.images[0].src;
            }
            await delay(300);
            pool
            .select("*")
            .where("shop_id", shop)
            .where("product_id", product.id)
            .from("products")
            .then((rows) => {
              if (rows.length > 0) {
                pool("products")
                .where("product_id", product.id)
                .update({ 
                    title: product.title,
                    handle: product.handle,
                    image: image
                })
                .catch((ex) => {
                    console.log(ex);
                });  
              } else {
                pool("products")
                  .insert({
                    shop_id: shop,
                    product_id: product.id,
                    title: product.title,
                    handle: product.handle,
                    image: image,
                  })
                  .catch((ex) => {
                    console.log(ex);
                  });
              }
            });
        }
        return res("Done");
    });
  }

  getProducts(shop, id){
    return new Promise(async function (res, rej) {
        pool
        .select("*")
        .where("shop_id", shop)
        .limit(50)
        .from("products")
        .then((rows) => {
            return res(rows);
        })
    }); 
  }

  saveSelectedPro(shop, body){
    return new Promise(async function (res, rej) {
      pool
      .select("*")
      .where("shop_id", shop)
      .from("selectedproducts")
      .then((rows) => {
        if (rows.length > 0) {
          pool("selectedproducts")
          .where("shop_id", shop)
          .update({ 
              product_ids: JSON.stringify(body.selectProduct),
              allselect: body.checked
          })
          .catch((ex) => {
              console.log(ex);
          });  
        } else {
          pool("selectedproducts")
          .insert({
            shop_id: shop,
            product_ids: JSON.stringify(body.selectProduct),
            allselect: body.checked
          })
          .catch((ex) => {
            console.log(ex);
          });
        }
      })
      return res("Done");
    })
  }
  getselectedProduct(shop){
    return new Promise(async function (res, rej) {
      pool
      .select("*")
      .where("shop_id", shop)
      .from("selectedproducts")
      .first()
      .then((rows) => {
        return res(rows);
      }) 
    });
  }
  /** */
  saveSelectedCollect(shop, body){
    return new Promise(async function (res, rej) {
      pool
      .select("*")
      .where("shop_id", shop)
      .from("selectedcollections")
      .then((rows) => {
        if (rows.length > 0) {
          pool("selectedcollections")
          .where("shop_id", shop)
          .update({ 
            collection_ids: JSON.stringify(body.selectCollection),
          })
          .catch((ex) => {
              console.log(ex);
          });  
        } else {
          pool("selectedcollections")
          .insert({
            shop_id: shop,
            collection_ids: JSON.stringify(body.selectCollection)
          })
          .catch((ex) => {
            console.log(ex);
          });
        }
      })
      return res("Done");
    })
  }
  getselectedCollections(shop){
    return new Promise(async function (res, rej) {
      pool
      .select("collection_ids")
      .where("shop_id", shop)
      .from("selectedcollections")
      .first()
      .then((rows) => {
        return res(rows);
      }) 
    });
  }
}
module.exports = new UserPostdb();