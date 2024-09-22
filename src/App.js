import React, { useState } from 'react';
import { usePostDataMutation } from './app/api/apiSlice';
import { Input, Button, Select, Typography, Alert, Card, Space, message } from 'antd';
import { useTitle } from './hooks/useTitle'; // Import the useTitle hook
import 'antd/dist/reset.css'; // Ant Design default styles

const { TextArea } = Input; 
const { Option } = Select;
const { Title } = Typography;

function App() {
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState(['Alphabets']); // Set default filter to "Alphabets"
    const [postData, { data: response, error, isLoading }] = usePostDataMutation();

    // Set the page title to the roll number from the response
    useTitle(response?.roll_number || 'App');

    const handleSubmit = async () => {
        try {
            // Clear previous error messages
            message.destroy();

            // Parse the input as JSON and wrap it in an object
            const parsedData = JSON.parse(input); // Assuming input is a valid JSON string
            await postData(parsedData).unwrap(); // Send the parsed data directly
        } catch (err) {
            // Display an error message if JSON parsing fails
            message.error('Invalid JSON format. Please check your input.');
            console.error('Invalid JSON format:', err);
        }
    };

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const filteredResponse = {
        numbers: filter.includes('Numbers') ? response?.numbers : [],
        alphabets: filter.includes('Alphabets') ? response?.alphabets : [],
        highest_lowercase_alphabet: filter.includes('Highest lowercase alphabet') ? response?.highest_lowercase_alphabet : []
    };

    return (
        <div className="App" style={{ padding: '20px' }}>
            <Title level={2}>{response?.roll_number || 'Please submit JSON data'}</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
                <TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Enter valid JSON data, e.g., {"data": ["a", "B", "3", "z", "1", "C", " "] }'
                    rows={4}
                    style={{ marginBottom: '10px' }}
                />
                <Button 
                    type="primary" 
                    onClick={handleSubmit} 
                    loading={isLoading}
                >
                    Submit
                </Button>
                {error && (
                    <Alert 
                        message="Error" 
                        description={error.message || 'Error occurred'} 
                        type="error" 
                        showIcon
                    />
                )}
                {response && (
                    <>
                        <Select 
                            mode="multiple" 
                            value={filter} 
                            onChange={handleFilterChange}
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            <Option value="Alphabets">Alphabets</Option>
                            <Option value="Numbers">Numbers</Option>
                            <Option value="Highest lowercase alphabet">Highest lowercase alphabet</Option>
                        </Select>
                        <Card title="Filtered Response" style={{ width: '100%' }}>
                            {filter.includes('Numbers') && (
                                <Card type="inner" title="Numbers">
                                    <pre>{JSON.stringify(filteredResponse.numbers, null, 2)}</pre>
                                </Card>
                            )}
                            {filter.includes('Alphabets') && (
                                <Card type="inner" title="Alphabets">
                                    <pre>{JSON.stringify(filteredResponse.alphabets, null, 2)}</pre>
                                </Card>
                            )}
                            {filter.includes('Highest lowercase alphabet') && (
                                <Card type="inner" title="Highest Lowercase Alphabet">
                                    <pre>{JSON.stringify(filteredResponse.highest_lowercase_alphabet, null, 2)}</pre>
                                </Card>
                            )}
                        </Card>
                    </>
                )}
            </Space>
        </div>
    );
}

export default App;
