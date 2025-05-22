import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Helper to get the token and set headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users', {
                headers: getAuthHeaders(),
            });
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            message.error('Unauthorized or failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/users/${id}`, {
                headers: getAuthHeaders(),
            });
            message.success('User deleted');
            fetchUsers();
        } catch (err) {
            message.error('Failed to delete user');
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setModalVisible(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingUser) {
                await axios.put(`/api/users/${editingUser.id}`, values, {
                    headers: getAuthHeaders(),
                });
                message.success('User updated');
            } else {
                await axios.post('/api/auth/register', {
                    ...values,
                    confirmPassword: values.password,
                    role: 'user',
                }, {
                    headers: getAuthHeaders(),
                });
                message.success('User added');
            }
            fetchUsers();
            setModalVisible(false);
        } catch (err) {
            message.error('Failed to submit form');
        }
    };

    const columns = [
        { title: 'First Name', dataIndex: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Role', dataIndex: 'role' },
        {
            title: 'Actions',
            render: (_: any, record: User) => (
                <Space>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={handleAdd} className="mb-4">
                Add User
            </Button>
            <Table rowKey="id" dataSource={users} columns={columns} />

            <Modal
                title={editingUser ? 'Edit User' : 'Add User'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
                        <Input />
                    </Form.Item>
                    {!editingUser && (
                        <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
                            <Input.Password />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
}