import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Box, Flex, Heading, VStack, Link, Text, Icon } from '@chakra-ui/react';
import { LuLayoutDashboard, LuArrowRightLeft, LuPieChart, LuClipboardList, LuSettings2, LuWallet } from 'react-icons/lu';

const NavItem = ({ icon, children, to }) => {
  const activeStyle = {
    bg: 'primary.500', // Using Chakra's theme scale for primary color
    color: 'white',
    fontWeight: '600',
  };

  return (
    <Link
      as={RouterNavLink}
      to={to}
      display="flex"
      alignItems="center"
      p="3"
      mx="2"
      borderRadius="md"
      role="group"
      fontWeight="medium"
      color="neutral.300"
      _hover={{
        bg: 'neutral.700',
        color: 'white',
      }}
      _activeLink={activeStyle}
      style={({ isActive }) => isActive ? activeStyle : {}}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="xl"
          as={icon}
          _groupHover={{
            color: 'primary.300',
          }}
        />
      )}
      {children}
    </Link>
  );
};

const Sidebar = () => {
  const linkItems = [
    { name: 'Dashboard', icon: LuLayoutDashboard, to: '/' },
    { name: 'Transactions', icon: LuArrowRightLeft, to: '/transactions' },
    { name: 'Reports', icon: LuPieChart, to: '/reports' },
    { name: 'Budgets', icon: LuClipboardList, to: '/budgets' },
    { name: 'Settings', icon: LuSettings2, to: '/settings' },
  ];

  return (
    <Box
      as="aside"
      w={{ base: 'full', md: '260px' }}
      bg="neutral.900" // Matches --color-neutral-900
      color="neutral.200" // Matches --color-neutral-200
      p="6"
      display={{ base: 'none', md: 'flex' }} // Hidden on mobile by default, shown on md and up
      flexDirection="column"
      minH="100vh"
    >
      <Flex align="center" mb="8">
        <Icon as={LuWallet} w={8} h={8} color="primary.500" mr="3" />
        <Heading as="h1" size="lg" fontFamily="secondary" color="white">
          FinTrack
        </Heading>
      </Flex>
      <VStack spacing="1" align="stretch" flexGrow={1}>
        {linkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} to={link.to}>
            {link.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
