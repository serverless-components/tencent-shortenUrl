import { useEffect, useState } from "react";
import { Input, message, List, Button } from "antd";
import "./App.css";

import { getUrls, delUrl, addUrl } from "../../apis";

function App() {
  const [listLoading, setListLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [url, setUrl] = useState("");

  async function getUrlsAction() {
    setListLoading(true);
    const res = await getUrls();
    setUrls(res);
    setListLoading(false);
  }

  const delUrlAction = async (urlKey) => {
    await delUrl(urlKey);
    message.success("删除成功", 1, async () => {
      await getUrlsAction();
    });
  };

  const addUrlAction = async () => {
    try {
      await addUrl(url);
      message.success("添加成功", 1, async () => {
        setUrl("");
        await getUrlsAction();
      });
    } catch (e) {
      if (e.status === 400) {
        message.error("请填写合法的url");
      }
    }
  };

  useEffect(() => {
    getUrlsAction();
  }, []);

  return (
    <div className="app">
      <h1>
        使用 Serverless + Tencent Cloud 构建的
        <a
          target={"_blank"}
          rel="noreferrer"
          href="https://github.com/serverless-components/tencent-shortenUrl"
        >
          shortenUrl 短链接服务
        </a>
      </h1>
      <div className="urls">
        <List
          locale={{ emptyText: "当前没有短链接数据，请新建" }}
          loading={listLoading}
          dataSource={urls}
          renderItem={(item) => (
            <div className="urlItem" key={item.urlKey}>
              <a
                style={{ minWidth: 100 }}
                href={`${window.env.apiUrl}${item.urlKey}`}
                target={"_blank"}
                rel="noreferrer"
              >
                {item.urlKey}
              </a>
              <div style={{ marginRight: 20, flex: 1 }}>{item.url}</div>
              <Button
                onClick={() => delUrlAction(item.urlKey)}
                size="small"
                danger
              >
                删除
              </Button>
            </div>
          )}
        />
      </div>
      <div className="addUrl">
        <Input
          value={url}
          placeholder={`请填写完整的url地址，比如: https://www.google.com`}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={() => addUrlAction()} disabled={!url} type="primary">
          添加
        </Button>
      </div>
    </div>
  );
}

export default App;
