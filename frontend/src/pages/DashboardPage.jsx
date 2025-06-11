import React from 'react';
import { Box, Heading, Grid, Button, Flex, Icon, Text, VStack, Progress } from '@chakra-ui/react';
import { LuPlus, LuMinus, LuTrendingUp, LuTrendingDown, LuDollarSign, LuListChecks, LuLayoutList } from 'react-icons/lu';
import SummaryCard from '../features/dashboard/components/SummaryCard';

const DashboardPage = () => {
  // Placeholder data - to be replaced with API data
  const summaryData = [
    {
      title: 'Current Balance',
      value: '$12,345.67',
      label: 'As of today',
      icon: LuDollarSign,
      iconBg: 'blue.100',
      iconColor: 'blue.500'
    },
    {
      title: 'Income This Month',
      value: '$5,800.00',
      label: '+15% from last month',
      isPositive: true,
      icon: LuTrendingUp,
      iconBg: 'green.100',
      iconColor: 'green.500'
    },
    {
      title: 'Expenses This Month',
      value: '$2,150.75',
      label: '-5% from last month',
      isPositive: false,
      icon: LuTrendingDown,
      iconBg: 'red.100',
      iconColor: 'red.500'
    },
  ];

  const recentTransactions = [
    { id: 1, description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, type: 'expense', date: '2024-07-28' },
    { id: 2, description: 'Salary Deposit', category: 'Income', amount: 2500.00, type: 'income', date: '2024-07-28' },
    { id: 3, description: 'Groceries', category: 'Food', amount: -75.40, type: 'expense', date: '2024-07-27' },
    { id: 4, description: 'Coffee Shop', category: 'Food & Drink', amount: -5.25, type: 'expense', date: '2024-07-26' },
  ];

  const budgetOverview = [
    { id: 1, category: 'Groceries', spent: 195, total: 300, colorScheme: 'yellow' },
    { id: 2, category: 'Entertainment', spent: 60, total: 200, colorScheme: 'indigo' },
    { id: 3, category: 'Shopping', spent: 180, total: 200, colorScheme: 'red' },
  ];

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb="6">
        <Heading as="h1" size="xl" fontFamily="secondary" color="neutral.800">
          Dashboard
        </Heading>
        <Flex gap="4">
          <Button 
            leftIcon={<Icon as={LuPlus} />} 
            bg="accent.500" 
            color="white" 
            _hover={{ bg: 'accent.600' }}
            onClick={() => alert('Prototype: Add Income functionality')}
          >
            Add Income
          </Button>
          <Button 
            leftIcon={<Icon as={LuMinus} />} 
            bg="primary.500" 
            color="white" 
            _hover={{ bg: 'primary.600' }}
            onClick={() => alert('Prototype: Add Expense functionality')}
          >
            Add Expense
          </Button>
        </Flex>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6" mb="6">
        {summaryData.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            value={data.value}
            label={data.label}
            icon={data.icon}
            isPositive={data.isPositive}
            iconBg={data.iconBg}
            iconColor={data.iconColor}
          />
        ))}
      </Grid>

      {/* Main Dashboard Layout: Recent Transactions and Budget Overview */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="6" mb="6">
        {/* Recent Transactions Card */}
        <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="md" fontFamily="secondary" color="neutral.700" mb="4">
            Recent Transactions
          </Heading>
          <VStack spacing="3" align="stretch">
            {recentTransactions.map(tx => (
              <Flex key={tx.id} justifyContent="space-between" alignItems="center" borderBottomWidth="1px" borderColor="neutral.200" pb="2">
                <Flex alignItems="center">
                  <Icon 
                    as={tx.type === 'income' ? LuTrendingUp : LuTrendingDown} 
                    color={tx.type === 'income' ? 'success.500' : 'error.500'} 
                    boxSize="5" 
                    mr="3" 
                  />
                  <Box>
                    <Text fontWeight="medium" color="neutral.700">{tx.description}</Text>
                    <Text fontSize="sm" color="neutral.500">{tx.category}</Text>
                  </Box>
                </Flex>
                <Text fontWeight="semibold" color={tx.type === 'income' ? 'success.500' : 'error.500'}>
                  {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </Text>
              </Flex>
            ))}
            {recentTransactions.length === 0 && <Text color="neutral.500">No recent transactions.</Text>}
          </VStack>
        </Box>

        {/* Budget Overview Card */}
        <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="md" fontFamily="secondary" color="neutral.700" mb="4">
            Budget Overview
          </Heading>
          <VStack spacing="4" align="stretch">
            {budgetOverview.map(budget => (
              <Box key={budget.id}>
                <Flex justifyContent="space-between" mb="1">
                  <Text fontWeight="medium" color="neutral.600">{budget.category}</Text>
                  <Text fontSize="sm" color="neutral.500">${budget.spent} / ${budget.total}</Text>
                </Flex>
                <Progress 
                  value={(budget.spent / budget.total) * 100} 
                  size="sm" 
                  colorScheme={budget.colorScheme} 
                  borderRadius="md"
                />
                 <Text fontSize="xs" color="neutral.500" mt="1">
                  {(( (budget.total - budget.spent) / budget.total) * 100).toFixed(0)}% remaining
                </Text>
              </Box>
            ))}
            {budgetOverview.length === 0 && <Text color="neutral.500">No budgets set.</Text>}
          </VStack>
        </Box>
      </Grid>
      
      {/* Spending vs Income Chart Placeholder */}
      <Box p="6" bg="white" borderRadius="lg" boxShadow="md">
        <Heading as="h2" size="md" fontFamily="secondary" color="neutral.700" mb="4">
          Spending vs Income (Monthly)
        </Heading>
        <Box h="250px" bg="neutral.200" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
          <Text color="neutral.500" fontWeight="medium">Chart Placeholder (Bar Chart)</Text>
        </Box>
      </Box>

    </Box>
  );
};

export default DashboardPage;
