import { Box, Heading, Input, Tooltip } from '@chakra-ui/react';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { backend_url } from './backendURL';

const initialState = { name: '', email: '', password: '', confirmPassword: '' };

const Register = () => {
    const [formData, setFormData] = useState(initialState);
    const [isDisabled, setIsDisabled] = useState(true);
    const [showPasswordHelp, setShowPasswordHelp] = useState(false);
    const [showConfirmPasswordHelp, setShowConfirmPasswordHelp] = useState(false);
    const [showEmailHelp, setShowEmailHelp] = useState(false);
    const [nameError, setNameError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      const sanitizedValue = DOMPurify.sanitize(value); // Sanitize input
      if (name === 'name') {
          if (sanitizedValue === '') {
              setNameError('');
          } else {
              const isValidName = /^[A-Za-z\s]+$/.test(sanitizedValue);
              if (!isValidName) {
                  setNameError('Name can only contain letters and spaces.');
                  return;
              } else {
                  setNameError('');
              }
          }
      }
      setFormData({ ...formData, [name]: sanitizedValue });
    };

    const validateForm = useCallback(() => {
        const { name, email, password, confirmPassword } = formData;
        const isNameValid = name.length >= 2 && name.length <= 50 && /^[A-Za-z\s]+$/.test(name);
        const isEmailValid = /^[0-9a-zA-Z._%+-]+@gmail\.com$/.test(email);
        const isPasswordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password);
        const isConfirmPasswordValid = password === confirmPassword;
        return isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
    }, [formData]);

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backend_url}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful, You can now log in.');
                navigate('/login');
            } else if (data.message) {
                alert(data.message);
            }
        } catch (err) {
            alert('An error occurred during registration');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        if (token) {
            alert('You are already a registered user, if you are trying to access the register page, please log out first.');
            navigate(`/${userId}/profile`);
        }
    }, [navigate]);

    useEffect(() => {
        setIsDisabled(!validateForm());
    }, [formData, validateForm]);

    const { name, email, password, confirmPassword } = formData;

    return (
        <Box style={{ textAlign: 'center' }}>
            <Heading mb='10px' style={{ textAlign: 'center' }}>
                Register
            </Heading>
            <form onSubmit={onSubmit} style={{ textAlign: 'center' }}>
                <Box className='input-icons'>
                    <i className='fa fa-user icon'></i>
                    <Input
                        className='input-field'
                        w='300px'
                        type='text'
                        placeholder='Name'
                        value={name}
                        name='name'
                        onChange={handleChange}
                    />
                    {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                </Box>
                <Box className='input-icons'>
                    <i className='fa fa-envelope icon'></i>
                    <Tooltip
                        hasArrow
                        label='Only gmail.com mail is accepted'
                        isOpen={showEmailHelp}
                        placement='top'
                    >
                        <Input
                            className='input-field'
                            w='300px'
                            type='email'
                            value={email}
                            name='email'
                            placeholder='Email'
                            onChange={handleChange}
                            onFocus={() => setShowEmailHelp(true)}
                            onBlur={() => setShowEmailHelp(false)}
                        />
                    </Tooltip>
                </Box>
                <Box className='input-icons'>
                    <i className='fa fa-key icon'></i>
                    <Tooltip
                        hasArrow
                        label='Password must be 8-15 characters long consisting of at least one number, uppercase letter, lowercase letter, and special character.'
                        isOpen={showPasswordHelp}
                        placement='top'
                    >
                        <Input
                            className='input-field'
                            w='300px'
                            type='password'
                            value={password}
                            name='password'
                            placeholder='Password'
                            onChange={handleChange}
                            onFocus={() => setShowPasswordHelp(true)}
                            onBlur={() => setShowPasswordHelp(false)}
                        />
                    </Tooltip>
                </Box>
                <Box className='input-icons'>
                    <i className='fa fa-key icon'></i>
                    <Tooltip
                        hasArrow
                        label='Confirm password should be the same as Password'
                        isOpen={showConfirmPasswordHelp}
                        placement='top'
                    >
                        <Input
                            className='input-field'
                            w='300px'
                            type='password'
                            value={confirmPassword}
                            name='confirmPassword'
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            onFocus={() => setShowConfirmPasswordHelp(true)}
                            onBlur={() => setShowConfirmPasswordHelp(false)}
                        />
                    </Tooltip>
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
                    value='Register'
                    disabled={isDisabled}
                />
            </form>
            <p>
                Already a member?{' '}
                <Link style={{ textDecoration: 'none', color: 'green' }} to={'/login'}>
                    Login
                </Link>
            </p>
        </Box>
    );
};

export default Register;
