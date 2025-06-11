import React from 'react';
import { Box, Text, Progress, Tag, VStack, HStack, Heading, Icon } from '@chakra-ui/react';
import { LuTarget, LuDollarSign, LuTrendingDown, LuTrendingUp, LuAlertTriangle } from 'react-icons/lu';

const BudgetProgressCard = ({ budget }) => {
  if (!budget) {
    return null;
  }

  const { category, amount: budgetedAmount, spentAmount, period } = budget;
  const remainingAmount = budgetedAmount - spentAmount;
  const progressPercent = budgetedAmount > 0 ? (spentAmount / budgetedAmount) * 100 : 0;

  let progressBarColor = 'primary';
  let statusMessage = 'On Track';
  let statusIcon = LuTrendingUp;

  if (progressPercent >= 100) {
    progressBarColor = 'error';
    statusMessage = 'Over Budget';
    statusIcon = LuAlertTriangle;
  } else if (progressPercent >= 80) {
    progressBarColor = 'warning';
    statusMessage = 'Nearing Limit';
    statusIcon = LuTrendingDown;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      boxShadow="md"
      bg="white"
      w="100%"
    >
      <VStack spacing={3} align="stretch">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="sm" fontFamily="secondary" color="neutral.700">
            {category}
          </Heading>
          {period && (
            <Tag size="sm" colorScheme="gray" variant="outline">
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Tag>
          )}
        </HStack>

        <Box>
          <HStack justifyContent="space-between" fontSize="sm" color="neutral.600">
            <Text>Spent: <Text as="span" fontWeight="medium" color="neutral.800">${spentAmount.toFixed(2)}</Text></Text>
            <Text>Budgeted: <Text as="span" fontWeight="medium" color="neutral.800">${budgetedAmount.toFixed(2)}</Text></Text>
          </HStack>
          <Progress 
            value={progressPercent} 
            size="sm" 
            colorScheme={progressBarColor} 
            borderRadius="full" 
            mt={1}
            aria-label={`${category} budget progress`} 
          />
        </Box>

        <HStack justifyContent="space-between" fontSize="sm">
          <HStack color={`${progressBarColor}.500`}>
            <Icon as={statusIcon} />
            <Text fontWeight="medium">{statusMessage}</Text>
          </HStack>
          <Text color="neutral.600">
            {remainingAmount >= 0 ? `$${remainingAmount.toFixed(2)} remaining` : `$${Math.abs(remainingAmount).toFixed(2)} over`}
          </Text>
        </HStack>

      </VStack>
    </Box>
  );
};

export default BudgetProgressCard;
