import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'antd';

interface Container {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
}

interface ContainersTableProps {
    containers: Container[];
    setContainers: React.Dispatch<React.SetStateAction<Container[]>>;
}

const ContainersTable: React.FC<ContainersTableProps> = ({ containers, setContainers }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [containerToDelete, setContainerToDelete] = useState<Container | null>(null);
    const [deleting, setDeleting] = useState(false);

    const showDeleteModal = (container: Container) => {
        setContainerToDelete(container);
        setDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        if (!containerToDelete) return;
        setDeleting(true);

        try {
            await axios.delete(`/containers/${containerToDelete.id}`);
            setContainers((prev) => prev.filter((c) => c.id !== containerToDelete.id));
        } catch (err) {
            console.error('Failed to delete container', err);
        } finally {
            setDeleting(false);
            setDeleteModalVisible(false);
            setContainerToDelete(null);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Container) => (
                <Button danger onClick={() => showDeleteModal(record)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Docker Containers</h2>
            <Table
                dataSource={containers}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Delete Container"
                open={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => {
                    setDeleteModalVisible(false);
                    setContainerToDelete(null);
                }}
                okButtonProps={{
                    danger: true,
                    loading: deleting,
                }}
                okText="Delete"
                width={500}
                afterClose={() => setDeleteModalVisible(false)}
            >
                {containerToDelete && (
                    <div className="space-y-4">
                        <p>Are you sure you want to delete this container?</p>
                        <div className="space-y-1 text-sm">
                            <div>
                                <strong>Name:</strong> {containerToDelete.name}
                            </div>
                            <div>
                                <strong>Image:</strong> {containerToDelete.image}
                            </div>
                            <div>
                                <strong>Status:</strong> {containerToDelete.state}
                            </div>
                        </div>
                        <div className="text-red-600 text-sm font-medium">
                            Warning: This action cannot be undone. The container and its data will be permanently deleted.
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ContainersTable;