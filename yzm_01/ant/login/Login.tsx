import {Form, Input, Button} from 'antd';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {request} from '../../apis/index'
import {debounce} from '../../utils/debounce';
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
export function Login () {
    let history = useHistory();
    const onFinish = (values:any) => {
        const {username, password} = values;
        console.log(username, password);
        // request('post', '/login/open', values).then(values => {
        //     console.log(values);
        // })
        history.push('/content/1');
    }

    const handleChange = debounce((changedvalue: any, allvalues: any) => {
        console.log(changedvalue, allvalues);
    }, 500);

    const initialValues ={
        username: '123',
        password: 'hello'
    }

    return (
        <Form onFinish={onFinish}  {...layout} initialValues ={initialValues} onValuesChange={handleChange}>
            <Form.Item label="username" name="username"><Input style={{width: '200px'}}></Input></Form.Item>
            <Form.Item label="password" name="password"><Input.Password style={{width:'200px'}}></Input.Password></Form.Item>
            <Form.Item>
                <Button type='primary' htmlType="submit" style={{left: '50%', transform: "translate('-50', 0)"}}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}