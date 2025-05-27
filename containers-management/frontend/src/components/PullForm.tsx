import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

interface PullFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const PullForm: React.FC<PullFormProps> = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const onFinish = async (values: { image: string; tag?: string }) => {
        setLoading(true);
        try {
            await axios.post('/api/pull', { image: values.image, tag: values.tag });
            setFeedback({ type: 'success', text: 'Image pulled successfully' });
            onSuccess?.();
        } catch (error: any) {
            setFeedback({ type: 'error', text: error?.response?.data?.error || 'Failed to pull image' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (feedback) {
            if (feedback.type === 'success') {
                message.success(feedback.text);
            } else {
                message.error(feedback.text);
            }
            setFeedback(null);
        }
    }, [feedback]);

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Image Name" name="image" rules={[{ required: true, message: 'Please enter the image name' }]}>
                <Input placeholder="e.g. nginx" />
            </Form.Item>
            <Form.Item label="Tag" name="tag">
                <Input placeholder="e.g. latest (optional)" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Pull Image
                </Button>
                {onCancel && (
                    <Button style={{ marginLeft: 8 }} onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
};

export default PullForm;
