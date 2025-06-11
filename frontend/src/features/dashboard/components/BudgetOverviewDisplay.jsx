import React from 'react';
import { Box, Heading, VStack, HStack, Text, Progress, useColorModeValue } from '@chakra-ui/react';

// BudgetItem component for displaying a single budget's progress
const BudgetItem = ({ budget }) => {
  const spent = budget.spentAmount || 0;
  const total = budget.amount || 1; // Avoid division by zero if amount is 0
  const percentage = Math.min((spent / total) * 100, 100); // Cap at 100%
  const remaining = total - spent;

  let progressBarColor = 'primary';
  if (percentage >= 90) {
    progressBarColor = 'error';
  } else if (percentage >= 70) {
    progressBarColor = 'warning';
  }

  const formattedSpent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(spent);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

  return (
    <Box w="100%" py={2}>
      <HStack justifyContent="space-between" mb={1}>
        <Text fontWeight="medium" color={useColorModeValue('neutral.700', 'neutral.200')}>{budget.category}</Text>
        <Text fontSize="sm" color={useColorModeValue('neutral.500', 'neutral.400')}>
          {formattedSpent.replace('$', '')} / {formattedTotal.replace('$', '')}
        </Text>
      </HStack>
      <Progress value={percentage} size="sm" colorScheme={progressBarColor} borderRadius="md" />
      <HStack justifyContent="space-between" mt={1}>
        <Text fontSize="xs" color={useColorModeValue('neutral.500', 'neutral.400')}>
          {percentage.toFixed(0)}% Used
        </Text>
        <Text fontSize="xs" color={useColorModeValue('neutral.500', 'neutral.400')}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remaining).replace('$', '')} Left
        </Text>
      </HStack>
    </Box>
  );
};

// BudgetOverviewDisplay component
const BudgetOverviewDisplay = ({ budgets = [] }) => {
  const cardBg = useColorModeValue('white', 'neutral.800');

  return (
    <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" h="100%">
      <Heading as="h3" size="md" mb={4} fontFamily="font.secondary" color={useColorModeValue('neutral.700', 'neutral.200')}>
        Budget Overview
      </Heading>
      {budgets.length === 0 ? (
        <Text color={useColorModeValue('neutral.500', 'neutral.400')}>No budgets set up.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {budgets.slice(0, 3).map((budget) => (
            <BudgetItem key={budget.id || budget.category} budget={budget} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default BudgetOverviewDisplay;
