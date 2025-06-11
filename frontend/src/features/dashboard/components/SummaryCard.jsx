import React from 'react';
import { Box, Heading, Text, Flex, Icon, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';

const SummaryCard = ({ title, value, label, icon, isPositive, iconBg, iconColor }) => {
  return (
    <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
      <Flex alignItems="center" justifyContent="space-between" mb="4">
        <Heading as="h3" size="md" fontFamily="secondary" color="neutral.700">
          {title}
        </Heading>
        {icon && (
          <Flex 
            alignItems="center" 
            justifyContent="center" 
            w="10" 
            h="10" 
            borderRadius="full" 
            bg={iconBg || 'gray.100'}
          >
            <Icon as={icon} boxSize="5" color={iconColor || 'gray.500'} />
          </Flex>
        )}
      </Flex>
      
      <Stat>
        <StatNumber fontSize="3xl" fontWeight="bold" fontFamily="secondary" color="neutral.800" mb="1">
          {value}
        </StatNumber>
        <StatHelpText fontSize="sm" color="neutral.500">
          {typeof isPositive === 'boolean' && (
            <StatArrow type={isPositive ? 'increase' : 'decrease'} mr="1" />
          )}
          {label}
        </StatHelpText>
      </Stat>
    </Box>
  );
};

export default SummaryCard;
