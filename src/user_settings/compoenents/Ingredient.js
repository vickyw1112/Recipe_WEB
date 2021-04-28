import React, { useEffect, useState } from "react";

import { Form, Select, Button, Input, Space, Layout } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const Ingredient = (props) => {
    const { Content } = Layout;
    const { className } = props;
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/ingredients/getallcategory", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((result) => setData(result.category));
    }, []);

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
        fetch("http://localhost:5000/ingredients/list", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => { if(!res.ok){alert("Add recipe failed")   } else{

                alert("Successfully add recipe");

            }});
    };
    const { Option } = Select;
    return (
        <Content className={className}>
            <p>Ingredient</p>
            <Form name="validate_other" onFinish={onFinish}>
                <Form.List name="ingredients">
                    {(fields, { add, remove }) => {
                        //console.log("field" + fields);
                        // field is all the add 2 field form
                        // this function seems recusive
                        return (
                            <div>
                                {fields.map((field) => (
                                    <Space
                                        key={field.key}
                                        style={{
                                            display: "flex",
                                            marginBottom: 8,
                                        }}
                                        align="start"
                                    >
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "category"]}
                                            fieldKey={[
                                                field.fieldKey,
                                                "category",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Missing category name",
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Please select a category"
                                                style={{ width: 200 }}
                                            >
                                                {data.map((item) => (
                                                    <Option value={item}>
                                                        {item}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "ingredient"]}
                                            fieldKey={[
                                                field.fieldKey,
                                                "ingredient",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Missing ingredient",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="ingredient" />
                                        </Form.Item>

                                        <MinusCircleOutlined
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                        />
                                    </Space>
                                ))}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add();
                                        }}
                                        block
                                    >
                                        <PlusOutlined /> Add more ingredients
                                    </Button>
                                </Form.Item>
                            </div>
                        );
                    }}
                </Form.List>
                <Form.Item
                    wrapperCol={{
                        span: 12,
                        offset: 6,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Content>
    );
};
export default Ingredient;
