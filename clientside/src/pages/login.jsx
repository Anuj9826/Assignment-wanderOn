import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Import DOMPurify
import { backend_url } from './backendURL';
import { Box, Heading, Input } from '@chakra-ui/react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        let { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value); // Sanitize input
        setFormData({ ...formData, [name]: sanitizedValue });
    };

    const validateForm = useCallback(() => {
        const { email, password } = formData;
        const isEmailValid = /^[0-9a-zA-Z._%+-]+@gmail\.com$/.test(email);
        const isPasswordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password);
        return isEmailValid && isPasswordValid;
    }, [formData]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backend_url}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.data.token);
                localStorage.setItem('userId', data.data.userId);
                alert('Login successful');
                navigate(`/${data.data.userId}/profile`);
            } else if (data.message) {
                alert(data.message);
            }
        } catch (err) {
            alert('An error occurred during login');
        }
    };

    useEffect(() => {
        setIsDisabled(!validateForm());
    }, [formData, validateForm]);

    return (
        <Box style={{ textAlign: 'center' }}>
            <Heading mb='10px'>Login</Heading>
            <form onSubmit={onSubmit}>
                <Box className='input-icons'>
                    <i className='fa fa-envelope icon'></i>
                    <Input
                        className='input-field'
                        w='300px'
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Box>
                <Box className='input-icons'>
                    <i className='fa fa-key icon'></i>
                    <Input
                        className='input-field'
                        w='300px'
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Box>
                <Input
                    w='300px'
                    style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px',
                    }}
                    type='submit'
                    value='Login'
                    disabled={isDisabled}
                />
            </form>
            <p>
                Not a member?{' '}
                <Link style={{ textDecoration: 'none', color: 'green' }} to={'/register'}>
                    Register
                </Link>
            </p>
        </Box>
    );
};

export default Login;