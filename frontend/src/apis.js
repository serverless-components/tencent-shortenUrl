import { message } from "antd";
import ky from "ky";

const rq = ky.extend({
    prefixUrl: window.env.apiUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(
            ":" + window.localStorage.getItem("authPass")
        )}`,
    },
    hooks: {
        afterResponse: [
            (_req, _options, resp) => {
                if (resp.status === 401) {
                    message.info("请先登录，再重试", 1, () => {
                        window.localStorage.removeItem("authPass");
                        window.location.replace("/login");
                    });
                }
            },
        ],
    },
});

export const getUrls = async () => {
    const { data } = await rq.get("list").json();
    return data;
};

export const delUrl = async (urlKey) => {
    const { data } = await rq
        .post("delete", {
            json: { urlKey },
        })
        .json();

    return data;
};

export const addUrl = async (url) => {
    const { data } = await rq
        .post("add", {
            json: { url },
            hooks: {
                afterResponse: [
                    (_req, _opt, resp) => {
                        if (resp.status === 400) {
                            throw resp;
                        }
                    },
                ],
            },
        })
        .json();
    return data;
};
