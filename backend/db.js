import knex from "knex";
import shortid from "shortid";

const client = knex({
    client: "pg",
    connection: process.env.dbConnUrl,
    searchPath: ["public"],
});

const TABLE_NAME = "shorten-url";
export const checkTable = async () => {
    if (!(await client.schema.hasTable(TABLE_NAME))) {
        await client.schema.createTable(TABLE_NAME, (table) => {
            table.string("urlKey"); // notice the urlKey will have a default 255 length limit if not specify
            table.text("url");
        });
        console.log(`create table ${TABLE_NAME} successfully!!`);
    }
};

export const listUrls = async () => {
    const res = await client.select().from(TABLE_NAME);
    return res;
};

export const addUrl = async (url) => {
    const urlKey = shortid();
    await client(TABLE_NAME).insert({ urlKey, url });
};

export const deleteUrl = async (urlKey) => {
    await client(TABLE_NAME).where("urlKey", urlKey).del();
};

export const getUrl = async (urlKey) => {
    const res = await client
        .select("url")
        .from(TABLE_NAME)
        .where("urlKey", urlKey);

    if (res[0] && res[0].url) {
        return res[0].url;
    }
    return null;
};
