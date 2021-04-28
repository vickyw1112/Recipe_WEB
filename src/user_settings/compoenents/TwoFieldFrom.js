import React, { useState } from "react";
import "antd/dist/antd.css";
import { Form, Select, Button, Upload, Input, Space } from "antd";
import {
    UploadOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import "../css/TwoFieldForm.css";

// the name of the from is the field name in the return json object

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const normFile = (e) => {
    console.log("Upload event:", e.value);

    if (Array.isArray(e)) {
        return e;
    }
    // e.target.value = "aaa";
    // console.log("e is" + e.target.value);

    return e && e.fileList;
};

const TwoFieldFrom = (props) => {
    const [data, setData] = useState("");

    const onFinish = (values) => {
        // the origin value of this field to the event that call some api
        // but since we need to post the image with other form data at the same time
        // we are not sending it to backend directly, instead we read it into a base64 binary string
        // and store it in frontend and stick it into the form data when submitting
        values.image = data;

        console.log("Received values of form: ", values);

        fetch("http://localhost:5000/recipe/list", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((res) => {  if(!res.ok){alert("Add recipe failed")   } else{

                alert("Successfully add recipe");

            }}  );
    };
    const { ingredients } = props;
    const types = ["Cuisine", "Diet", "Meal type", "Others"];

    const [tagsByType, setTagsByType] = useState([]);
    return (
        <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
            <Form.Item label="Plain Text">
                <span className="ant-form-text">Add Recipe</span>
            </Form.Item>
            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="instruction" label="Instruction">
                <Input.TextArea />
            </Form.Item>
            {/* upload image here */}
            <Form.Item
                name="image"
                label="image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="recipe image"
            >
                <Upload
                    name="logo"
                    listType="picture"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        const reader = new FileReader();

                        reader.onload = (e) => {
                            // console.log(e.target.result);
                            setData(e.target.result);
                        alert(

                            "Upload image successfully"
                        );
                        };
                        
                        reader.readAsDataURL(file);

                        // Prevent upload
                        return false;
                    }}
                >
                    <Button>
                        <UploadOutlined /> Click to upload
                    </Button>
                </Upload>
            </Form.Item>

            <div className="form-filed">
                <h3 style={{ marginLeft: 100 }}>Ingredient</h3>
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
                                            name={[field.name, "ingredient"]}
                                            fieldKey={[
                                                field.fieldKey,
                                                "ingredient",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Missing ingredient name",
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Please select a ingredient"
                                                style={{ width: 200 }}
                                            >
                                                {ingredients.map((item) => (
                                                    <Option value={item}>
                                                        {item}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "amount"]}
                                            fieldKey={[
                                                field.fieldKey,
                                                "amount",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Missing amount",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Amount" />
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

                <h3 style={{ marginLeft: 100 }}>Tags</h3>
                <Form.List name="tags">
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
                                            name={[field.name, "type"]}
                                            fieldKey={[field.fieldKey, "type"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Missing type name",
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Please select a type"
                                                style={{ width: 200 }}
                                                onChange={(value) => {
                                                    fetch(
                                                        "http://localhost:5000/tag/gettag",
                                                        {
                                                            method: "POST",
                                                            credentials:
                                                                "include",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/json",
                                                                "Access-Control-Allow-Origin":
                                                                    "http://127.0.0.1:5000",
                                                                "Access-Control-Allow-Credentials": true,
                                                            },
                                                            body: JSON.stringify(
                                                                { type: value }
                                                            ),
                                                        }
                                                    )
                                                        .then((res) =>
                                                            res.json()
                                                        )
                                                        .then((result) =>
                                                            setTagsByType(
                                                                result.tags
                                                            )
                                                        );
                                                }}
                                            >
                                                {types.map((item, index) => (
                                                    <Option
                                                        value={item}
                                                        key={index}
                                                    >
                                                        {item}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, "tag"]}
                                            fieldKey={[field.fieldKey, "tag"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Missing tag",
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Please select a type"
                                                style={{ width: 200 }}
                                            >
                                                {tagsByType.map(
                                                    (item, index) => (
                                                        <Option
                                                            value={item}
                                                            key={index}
                                                        >
                                                            {item}
                                                        </Option>
                                                    )
                                                )}
                                            </Select>
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
            </div>
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
    );
};

export default TwoFieldFrom;
