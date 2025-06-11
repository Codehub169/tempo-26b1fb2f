import React, { useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  VStack
} from '@chakra-ui/react';
import { LuUserCircle, LuTags, LuPalette } from 'react-icons/lu';
import UserProfileForm from '../features/settings/components/UserProfileForm';
import CategoryManagement from '../features/settings/components/CategoryManagement';

// Placeholder for API service calls
const mockSettingsService = {
  updateProfile: async (profileData) => {
    console.log('Updating profile:', profileData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate success or error
    if (profileData.email === 'error@example.com') {
      throw new Error('Failed to update profile.');
    }
    return { message: 'Profile updated successfully!' };
  },
  // Add other mock service functions for categories if needed
};

const SettingsPage = () => {
  const [apiMessage, setApiMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (profileData) => {
    setIsLoading(true);
    setApiMessage(null);
    try {
      const response = await mockSettingsService.updateProfile(profileData);
      setApiMessage({ status: 'success', message: response.message });
    } catch (error) {
      setApiMessage({ status: 'error', message: error.message || 'An unexpected error occurred.' });
    }
    setIsLoading(false);
  };

  const tabColor = useColorModeValue('primary.500', 'primary.300');
  const tabHoverBg = useColorModeValue('neutral.100', 'neutral.700');

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Heading as="h1" size="xl" mb={6} fontFamily="secondary">
        Settings
      </Heading>

      {apiMessage && (
        <Alert 
          status={apiMessage.status} 
          mb={4} 
          borderRadius="md"
          variant="subtle"
        >
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>{apiMessage.status === 'success' ? 'Success!' : 'Error!'}</AlertTitle>
            <AlertDescription>{apiMessage.message}</AlertDescription>
          </Box>
          <CloseButton onClick={() => setApiMessage(null)} position="absolute" right="8px" top="8px" />
        </Alert>
      )}

      <Tabs variant="soft-rounded" colorScheme="primary">
        <TabList mb={4}>
          <Tab 
            _selected={{ color: 'white', bg: tabColor }}
            _hover={{ bg: tabHoverBg }}
            fontWeight="medium"
          >
            <Icon as={LuUserCircle} mr={2} /> Profile
          </Tab>
          <Tab 
            _selected={{ color: 'white', bg: tabColor }}
            _hover={{ bg: tabHoverBg }}
            fontWeight="medium"
          >
            <Icon as={LuTags} mr={2} /> Categories
          </Tab>
          {/* Placeholder for future settings like Appearance/Theme */}
          {/* <Tab 
            _selected={{ color: 'white', bg: tabColor }}
            _hover={{ bg: tabHoverBg }}
            fontWeight="medium"
          >
            <Icon as={LuPalette} mr={2} /> Appearance
          </Tab> */}
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <UserProfileForm 
              onSubmit={handleProfileUpdate} 
              isLoading={isLoading} 
            />
          </TabPanel>
          <TabPanel p={0}>
            <CategoryManagement />
          </TabPanel>
          {/* <TabPanel p={0}>
            <Box p={4} borderWidth="1px" borderRadius="lg" bg={useColorModeValue('white', 'neutral.800')}> 
              <Heading size="md" mb={4}>Appearance Settings</Heading>
              <Text>Theme and display options will be available here.</Text>
            </Box>
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SettingsPage;
