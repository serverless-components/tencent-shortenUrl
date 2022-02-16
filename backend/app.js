import Koa from "koa";
import KoaRouter from "koa-router";
import koaBasicAuth from "koa-basic-auth";
import koaBody from "koa-body";
import isValidHttpUrl from "is-valid-http-url";

import { getUrl, deleteUrl, listUrls, addUrl, checkTable } from "./db.js";

await checkTable();
const app = new Koa();
const router = new KoaRouter();

app.use(koaBody());

router.use(
  ["/list", "/add", "/delete"],
  koaBasicAuth({
    pass: process.env.authPass,
  })
);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.set("WWW-Authenticate", "Basic");
      ctx.body = "cant haz that";
    } else {
      throw err;
    }
  }
});

// Routes
router.get(`/list`, async (ctx) => {
  const urls = await listUrls();
  ctx.response.type = "application/json";
  ctx.response.body = {
    data: urls,
  };
});

router.get("/:urlKey", async (ctx) => {
  const { urlKey } = ctx.params;
  const url = await getUrl(urlKey);
  if (url) {
    ctx.redirect(url);
    ctx.status = 301;
  } else {
    ctx.status = 404;
    ctx.response.body = `${urlKey} 无法找到，请确认已经配置短链接`;
  }
});

router.post("/add", async (ctx) => {
  const { url } = ctx.request.body;
  if (!isValidHttpUrl(url)) {
    ctx.status = 400;
    ctx.body = `${url} 不是合法url，请修改后重试`;
  } else {
    await addUrl(url);
    ctx.response.body = {
      result: 1,
    };
  }
});

router.post("/delete", async (ctx) => {
  const { urlKey } = ctx.request.body;
  await deleteUrl(urlKey);
  ctx.response.body = {
    result: 1,
  };
});

app.use(router.allowedMethods()).use(router.routes());

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
