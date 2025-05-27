import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import PullForm from './PullForm';

interface DockerImage {
    Id: string;
    RepoTags: string[];
    Size: number;
    Created: number;
    id?: string;
    image?: string;
    tag?: string;
}

interface ImagesTableProps {
    images: DockerImage[];
    setImages: React.Dispatch<React.SetStateAction<DockerImage[]>>;
    fetchImages: () => Promise<void>;
}

const ImagesTable: React.FC<ImagesTableProps> = ({ images, setImages, fetchImages }) => {
    const [pullModalVisible, setPullModalVisible] = useState(false);

    const formatSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const getRepository = (image: DockerImage): string => {
        if (image.RepoTags && image.RepoTags.length > 0) {
            const repoTag = image.RepoTags[0];
            const lastColonIndex = repoTag.lastIndexOf(':');
            return lastColonIndex > 0 ? repoTag.substring(0, lastColonIndex) : repoTag;
        }
        return image.image || '<none>';
    };

    const getTag = (image: DockerImage): string => {
        if (image.RepoTags && image.RepoTags.length > 0) {
            const repoTag = image.RepoTags[0];
            const lastColonIndex = repoTag.lastIndexOf(':');
            return lastColonIndex > 0 ? repoTag.substring(lastColonIndex + 1) : 'latest';
        }
        return image.tag || '<none>';
    };

    const columns = [
        {
            title: 'Repository',
            key: 'repository',
            render: (_: any, record: DockerImage) => getRepository(record),
        },
        {
            title: 'Tag',
            key: 'tag',
            render: (_: any, record: DockerImage) => getTag(record),
        },
        {
            title: 'Image ID',
            key: 'id',
            render: (_: any, record: DockerImage) => {
                const imageId = record.Id || record.id;
                return imageId ? imageId.substring(0, 12) : 'N/A';
            },
        },
    ];

    const onPullSuccess = () => {
        setPullModalVisible(false);
        fetchImages();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Docker Images</h2>
                <Button type="primary" onClick={() => setPullModalVisible(true)}>
                    Pull New Image
                </Button>
            </div>

            <Table
                dataSource={images}
                columns={columns}
                rowKey={(record) => record.Id || record.id || Math.random().toString()}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Pull Docker Image"
                visible={pullModalVisible}
                footer={null}
                onCancel={() => setPullModalVisible(false)}
                destroyOnClose
            >
                <PullForm onSuccess={onPullSuccess} onCancel={() => setPullModalVisible(false)} />
            </Modal>
        </div>
    );
};

export default ImagesTable;
