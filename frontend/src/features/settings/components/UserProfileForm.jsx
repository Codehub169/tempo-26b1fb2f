import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Text
} from '@chakra-ui/react';
import { LuEye, LuEyeOff, LuSave } from 'react-icons/lu';

const UserProfileForm = ({ onSubmit, isLoading, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const cardBg = useColorModeValue('white', 'neutral.800');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required to set a new password.';
      if (formData.newPassword.length < 6) newErrors.newPassword = 'New password must be at least 6 characters.';
      if (formData.newPassword !== formData.confirmNewPassword) newErrors.confirmNewPassword = 'New passwords do not match.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Only submit password fields if newPassword is set
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.newPassword) {
        dataToSubmit.currentPassword = formData.currentPassword;
        dataToSubmit.newPassword = formData.newPassword;
      }
      onSubmit(dataToSubmit);
    }
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg={cardBg} boxShadow="md">
      <Heading size="lg" mb={6} fontFamily="secondary">
        User Profile
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <Text fontWeight="medium" color={useColorModeValue('neutral.600', 'neutral.400')} pt={4}>Change Password (optional)</Text>

          <FormControl isInvalid={!!errors.currentPassword}>
            <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
            <InputGroup>
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
              />
              <InputRightElement>
                <IconButton
                  icon={showCurrentPassword ? <LuEyeOff /> : <LuEye />}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  variant="ghost"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.newPassword}>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <InputGroup>
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password (min. 6 characters)"
              />
              <InputRightElement>
                <IconButton
                  icon={showNewPassword ? <LuEyeOff /> : <LuEye />}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  variant="ghost"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.confirmNewPassword}>
            <FormLabel htmlFor="confirmNewPassword">Confirm New Password</FormLabel>
            <InputGroup>
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
              <InputRightElement>
                <IconButton
                  icon={showConfirmNewPassword ? <LuEyeOff /> : <LuEye />}
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  variant="ghost"
                  aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirmNewPassword}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="primary"
            isLoading={isLoading}
            leftIcon={<LuSave />}
            mt={4}
            alignSelf="flex-start"
          >
            Save Changes
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UserProfileForm;
