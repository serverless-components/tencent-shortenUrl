import ioredis from "ioredis";
import shortid from "shortid";

const client = new ioredis({
    port: Number(process.env.redis_port),
    host: process.env.redis_host,
    password: process.env.redis_password,
    family: 4,
    db: 0,
});

export const listUrls = async () => {
    const urlKeys = await client.keys("*");
    const result = [];
    for (const urlKey of urlKeys) {
        const url = await client.get(urlKey);
        result.push({ urlKey, url });
    }
    return result;
};

export const addUrl = async (url) => {
    const urlKey = shortid();
    await client.set(urlKey, url);
};

export const deleteUrl = async (urlKey) => {
    await client.del(urlKey);
};
export const getUrl = async (urlKey) => {
    const res = await client.get(urlKey);
    return res;
};
