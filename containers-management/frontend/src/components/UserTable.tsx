import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

// User interface
interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

// Props for the UserTable component
interface UserTableProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    fetchUsers: () => void;
}

export default function UserTable({ users, setUsers, fetchUsers }: UserTableProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Get Authorization headers from localStorage token
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Delete user by ID
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

    // Open edit modal with user data
    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setModalVisible(true);
    };

    // Open add user modal (empty form)
    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setModalVisible(true);
    };

    // Submit form for adding or editing a user
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingUser) {
                // Update existing user
                await axios.put(`/api/users/${editingUser.id}`, values, {
                    headers: getAuthHeaders(),
                });
                message.success('User updated');
            } else {
                // Create new user
                await axios.post(
                    '/api/auth/register',
                    {
                        ...values,
                        confirmPassword: values.password,
                        role: 'user',
                    },
                    {
                        headers: getAuthHeaders(),
                    }
                );
                message.success('User added');
            }
            fetchUsers();
            setModalVisible(false);
        } catch (err) {
            message.error('Failed to submit form');
        }
    };

    // Define columns for the Ant Design Table
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

                    {/* Additional fields for adding a new user only */}
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
