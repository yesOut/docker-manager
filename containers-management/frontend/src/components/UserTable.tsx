import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Select } from 'antd';
import { useState } from 'react';
import axios from 'axios';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface UserTableProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    fetchUsers: () => void;
}

export default function UserTable({ users, setUsers, fetchUsers }: UserTableProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const roleOptions = [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
    ];

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            message.error('Authentication token not found. Please login again.');
            return {};
        }
        return { Authorization: `Bearer ${token}` };
    };

    const handleDelete = async (id: string) => {
        try {
            const headers = getAuthHeaders();
            if (!headers.Authorization) {
                return;
            }

            await axios.delete(`/api/users/${id}`, {
                headers,
            });
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    message.error('Unauthorized: Please login again');
                } else if (error.response?.status === 403) {
                    message.error('Forbidden: You do not have permission to delete users');
                } else if (error.response?.status === 404) {
                    message.error('User not found');
                } else {
                    message.error(`Failed to delete user: ${error.response?.data?.message || error.message}`);
                }
            } else {
                message.error('Failed to delete user: Network error');
            }
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
        form.setFieldsValue({ role: 'user' });
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers.Authorization) {
                return;
            }

            const values = await form.validateFields();

            if (editingUser) {
                await axios.put(`/api/users/${editingUser.id}`, values, {
                    headers,
                });
                message.success('User updated successfully');
            } else {
                await axios.post(
                    '/api/auth/register',
                    {
                        ...values,
                        confirmPassword: values.password,
                    },
                    {
                        headers,
                    }
                );
                message.success('User added successfully');
            }
            fetchUsers();
            setModalVisible(false);
        } catch (error) {
            console.error('Failed to submit form:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    message.error('Unauthorized: Please login again');
                } else if (error.response?.status === 403) {
                    message.error('Forbidden: You do not have permission to perform this action');
                } else if (error.response?.status === 400) {
                    message.error(`Bad request: ${error.response?.data?.message || 'Invalid data provided'}`);
                } else if (error.response?.status === 409) {
                    message.error('Conflict: User with this email already exists');
                } else {
                    message.error(`Failed to save user: ${error.response?.data?.message || error.message}`);
                }
            } else {
                message.error('Failed to save user: Network error');
            }
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
        <div>
            <Button type="primary" onClick={handleAdd} className="my-4">
                Add User
            </Button>

            <Table
                rowKey="id"
                dataSource={users}
                columns={columns}
                loading={users.length === 0}
                locale={{
                    emptyText: users.length === 0 ? 'Loading users...' : 'No users found'
                }}
            />

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

                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select a role"
                            options={roleOptions}
                            allowClear={false}
                        />
                    </Form.Item>

                    {!editingUser && (
                        <>
                            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="state" label="State" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                label="Confirm Password"
                                dependencies={['password']}
                                rules={[
                                    { required: true },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Passwords do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
}