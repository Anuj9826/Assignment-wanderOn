import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import withAuthentication from './withAuthenication';
import {
    Box,
    Heading,
    Input,
    Stack,
    FormControl,
    FormLabel,
    Button,
} from '@chakra-ui/react';
import { backend_url } from './backendURL';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [nameError, setNameError] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();

  // Fetch user profile from server
  const fetchUserProfile = useCallback(async () => {
      try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
              navigate('/login');
              return;
          }

          const headers = new Headers();
          headers.append('Authorization', `Bearer ${token}`);

          const response = await fetch(`${backend_url}/user/${userId}/profile`, {
              headers: headers,
          });

          if (response.ok) {
              const data = await response.json();
              setUserData(data);
          } else {
              navigate('/login');
          }
      } catch (error) {
          console.error('Error fetching user profile:', error);
          navigate('/login');
      }
  }, [userId, navigate]);

  useEffect(() => {
      fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle toggle edit mode
  const toggleEditMode = () => {
      setEditMode(!editMode);
      setEditedData({
          name: DOMPurify.sanitize(userData?.data?.name || ''),
          email: DOMPurify.sanitize(userData?.data?.email || '')
      });
      setNameError('');
  };

  // Handle input field change
  const handleFieldChange = (field, value) => {
      value = DOMPurify.sanitize(value); // Sanitize input field
      if (field === 'name' && !/^[A-Za-z\s]+$/.test(value)) {
          setNameError('Name can only contain letters and spaces.');
          return;
      }
      setEditedData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Save changes and validate form
  const saveChanges = async () => {
      if (editedData.password !== editedData.confirmPassword) {
          alert("Password and confirm password don't match.");
          return;
      }

      try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
              navigate('/login');
              return;
          };

            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);
            headers.append('Content-Type', 'application/json');

            const response = await fetch(`${backend_url}/user/${userId}/profile`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(editedData),
            });

            const data = await response.json();
            if (response.ok) {
                setEditMode(false);
                fetchUserProfile();
                alert(data.message);
            } else if (data.message) {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred:', error);
        }
    };

    return (
        <Box textAlign='center'>
            <Heading mb='10px'> Here are Your Details </Heading>
            <form style={{ textAlign: 'center' }}>
                <Stack spacing={4}>
                    <FormControl>
                        <FormLabel textAlign='center'> NAME </FormLabel>
                        {editMode ? (
                            <>
                                <Input
                                    className='input-field'
                                    w='300px'
                                    type='text'
                                    placeholder='Name'
                                    value={editedData.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                />
                                {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                            </>
                        ) : (
                            <Input
                                className='input-field'
                                w='300px'
                                type='text'
                                placeholder='Name'
                                value={userData?.data?.name || ''}
                                isReadOnly
                            />
                        )}
                    </FormControl>
                    <FormControl>
                        <FormLabel textAlign='center'>EMAIL</FormLabel>
                        {editMode ? (
                            <Input
                                className='input-field'
                                w='300px'
                                type='text'
                                placeholder='Email'
                                value={editedData.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                            />
                        ) : (
                            <Input
                                className='input-field'
                                w='300px'
                                type='text'
                                placeholder='Email'
                                value={userData?.data?.email || ''}
                                isReadOnly
                            />
                        )}
                    </FormControl>
                    {editMode && (
                        <>
                            <FormControl>
                                <FormLabel textAlign='center'>PASSWORD</FormLabel>
                                <Input
                                    className='input-field'
                                    w='300px'
                                    type='password'
                                    placeholder='Password'
                                    onChange={(e) =>
                                        handleFieldChange('password', e.target.value)
                                    }
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel textAlign='center'>CONFIRM PASSWORD</FormLabel>
                                <Input
                                    className='input-field'
                                    w='300px'
                                    type='password'
                                    placeholder='Confirm Password'
                                    onChange={(e) =>
                                        handleFieldChange('confirmPassword', e.target.value)
                                    }
                                />
                            </FormControl>
                        </>
                    )}
                </Stack>
                {editMode ? (
                    <Button style={{ marginTop: '20px' }} onClick={saveChanges}>
                        Update Details
                    </Button>
                ) : (
                    <Button style={{ marginTop: '20px' }} onClick={toggleEditMode}>
                        Edit Details
                    </Button>
                )}
            </form>
        </Box>
    );
};

export default withAuthentication(Dashboard);
