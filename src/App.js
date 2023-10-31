import React from "react";
import ProTable from "@ant-design/pro-table";
import "antd/dist/reset.css";
import {
  Button,
  Col,
  ConfigProvider,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
import enUS from "antd/lib/locale/en_US";

import "./App.css";
import logo from "./logo.svg";
import axios from "axios";

const apiKey = "YOUR_KEY_HERE";
const baseURL = "https://anyapi.io/api/v1/exchange";

const columns = [
  { title: "Currency", dataIndex: "currency" },
  { title: "Value", dataIndex: "value", align: "right" },
];

const rates = {
  EUR: 0.943,
  USD: 1,
  JPY: 149.7407,
  BGN: 1.8442,
  CZK: 23.1561,
  DKK: 7.0381,
  GBP: 0.8236,
  HUF: 360.6129,
  PLN: 4.2023,
  RON: 4.6809,
  SEK: 11.1325,
  CHF: 0.9018,
  ISK: 138.7082,
  NOK: 11.1179,
  TRY: 28.2395,
  AUD: 1.5688,
  BRL: 4.9931,
  CAD: 1.3833,
  CNY: 7.3168,
  HKD: 7.8207,
  IDR: 15890.0047,
  ILS: 4.0512,
  INR: 83.2673,
  KRW: 1348.7694,
  MXN: 18.0301,
  MYR: 4.7625,
  NZD: 1.7138,
  PHP: 56.8901,
  SGD: 1.3657,
  THB: 35.9,
  ZAR: 18.7582,
};

const rateOptions = Object.keys(rates).map((currency) => ({
  label: currency,
  value: currency,
}));

const rateMapping = Object.entries(rates).map(([currency, value]) => ({
  currency,
  value,
}));

function App() {
  const [convertData, setConvertData] = React.useState({
    base: "USD",
    convertTo: "EUR",
    amount: "1",
    convertAmount: "0.943",
  });

  const request = () =>
    new Promise(async (resolve) => {
      let data = rateMapping;
      try {
        const params = { apiKey: apiKey, base: "USD" };
        const res = await axios.get(baseURL + "/rates", { params });
        if (res.status === 200) {
          data = Object.entries(res.data.rates).map(([currency, value]) => ({
            currency,
            value,
          }));
        }
      } catch (error) {
        console.log(error);
      }
      resolve({ data: data, success: true });
    });

  const convert = () => {
    const params = {
      base: convertData.base,
      to: convertData.convertTo,
      amount: convertData.amount,
      apiKey: apiKey,
    };
    axios
      .get(baseURL + "/convert", { params })
      .then((res) => {
        if (res.status === 200) {
          message.success("Converted successfully");
          setConvertData({ ...convertData, convertAmount: res.data.converted });
        } else message.error(res.message);
      })
      .catch((err) => {
        console.log(err);
        setConvertData({
          ...convertData,
          convertAmount: +convertData.amount * rates[convertData.convertTo],
        });
      });
  };

  return (
    <ConfigProvider locale={enUS}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h4>Currency Conversion App</h4>
        </header>
        <main className="main-container">
          <div className="convert-container">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={5}>
                <Select
                  value={convertData.base}
                  style={{ width: "100%" }}
                  onChange={(base) => setConvertData({ ...convertData, base })}
                  options={rateOptions}
                />
              </Col>
              <Col xs={24} lg={5}>
                <InputNumber
                  value={convertData.amount}
                  style={{ width: "100%" }}
                  onChange={(amount) =>
                    setConvertData({ ...convertData, amount })
                  }
                />
              </Col>
              <Col xs={24} lg={5}>
                <Select
                  value={convertData.convertTo}
                  style={{ width: "100%" }}
                  onChange={(convertTo) =>
                    setConvertData({ ...convertData, convert: convertTo })
                  }
                  options={rateOptions}
                />
              </Col>
              <Col xs={24} lg={4}>
                <Button block type="primary" onClick={convert}>
                  Convert
                </Button>
              </Col>
              <Col xs={24} lg={5}>
                <InputNumber
                  readOnly
                  style={{ width: "100%" }}
                  value={convertData.convertAmount}
                />
              </Col>
            </Row>
          </div>
          <ProTable
            size="small"
            columns={columns}
            request={request}
            rowKey="key"
            pagination={{ pageSize: 100 }}
          />
        </main>
      </div>
    </ConfigProvider>
  );
}

export default App;
