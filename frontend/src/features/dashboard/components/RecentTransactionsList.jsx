import React from 'react';
import { Box, Heading, VStack, HStack, Text, Icon, Divider, useColorModeValue, Flex } from '@chakra-ui/react';
import { LuArrowUpRight, LuArrowDownLeft } from 'react-icons/lu';

// TransactionItem component for displaying a single transaction
const TransactionItem = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'success.500' : 'error.500';
  const iconColor = isIncome ? 'success.500' : 'error.500';
  const iconBg = isIncome ? useColorModeValue('green.100', 'green.700') : useColorModeValue('red.100', 'red.700');
  const TransactionIcon = isIncome ? LuArrowUpRight : LuArrowDownLeft;

  // Format amount to currency (e.g., $1,234.56)
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // This could be dynamic based on user settings
  }).format(transaction.amount);

  return (
    <HStack justifyContent="space-between" w="100%" py={3}>
      <HStack spacing={3}>
        <Flex
          as="span"
          alignItems="center"
          justifyContent="center"
          bg={iconBg}
          color={iconColor}
          borderRadius="full"
          boxSize="40px"
        >
          <Icon as={TransactionIcon} boxSize="20px" />
        </Flex>
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontWeight="medium" color={useColorModeValue('neutral.800', 'neutral.100')}>{transaction.description || 'Transaction'}</Text>
          <Text fontSize="sm" color={useColorModeValue('neutral.500', 'neutral.400')}>{transaction.category}</Text>
        </VStack>
      </HStack>
      <Text fontWeight="semibold" color={amountColor}>
        {isIncome ? '+' : '-'}{formattedAmount.replace('$-','-').replace('$','')}
      </Text>
    </HStack>
  );
};

// RecentTransactionsList component
const RecentTransactionsList = ({ transactions = [] }) => {
  const cardBg = useColorModeValue('white', 'neutral.800');
  const borderColor = useColorModeValue('neutral.200', 'neutral.700');

  return (
    <Box p={6} bg={cardBg} borderRadius="lg" boxShadow="md" h="100%">
      <Heading as="h3" size="md" mb={4} fontFamily="font.secondary" color={useColorModeValue('neutral.700', 'neutral.200')}>
        Recent Transactions
      </Heading>
      {transactions.length === 0 ? (
        <Text color={useColorModeValue('neutral.500', 'neutral.400')}>No recent transactions.</Text>
      ) : (
        <VStack spacing={0} divider={<Divider borderColor={borderColor} />}>
          {transactions.slice(0, 5).map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default RecentTransactionsList;
