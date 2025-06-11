import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <Flex h="100vh" bg="neutral.100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <Box flexGrow={1} p="8" overflowY="auto" as="main">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default MainLayout;
