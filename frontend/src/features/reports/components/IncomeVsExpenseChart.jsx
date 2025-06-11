import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Flex
} from '@chakra-ui/react';
import { LuBarChart, LuTrendingUp, LuTrendingDown, LuDollarSign } from 'react-icons/lu';

const IncomeVsExpenseChart = ({ data }) => {
  if (!data) {
    return (
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" h="100%">
        <Heading size="md" fontFamily="secondary" mb={4} color="neutral.700">
          <Icon as={LuBarChart} mr={2} verticalAlign="middle" />
          Income vs. Expenses
        </Heading>
        <Flex alignItems="center" justifyContent="center" h="200px">
            <Text color="neutral.500">No income/expense data available for the selected period.</Text>
        </Flex>
      </Box>
    );
  }

  const { income, expenses } = data;
  const netBalance = income - expenses;

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md" h="100%">
      <Heading size="md" fontFamily="secondary" mb={4} color="neutral.700">
        <Icon as={LuBarChart} mr={2} verticalAlign="middle" />
        Income vs. Expenses
      </Heading>

      {/* Placeholder for actual chart */}
      <Flex alignItems="center" justifyContent="center" h="200px" bg="neutral.50" borderRadius="md" mb={6}>
        <Text color="neutral.400" fontSize="lg" fontWeight="medium">Bar Chart Placeholder</Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Stat>
          <HStack>
            <Icon as={LuTrendingUp} color="success.500" boxSize={5}/>
            <StatLabel color="neutral.600">Total Income</StatLabel>
          </HStack>
          <StatNumber color="success.600" fontSize="2xl">${income.toFixed(2)}</StatNumber>
        </Stat>

        <Stat>
          <HStack>
            <Icon as={LuTrendingDown} color="error.500" boxSize={5}/>
            <StatLabel color="neutral.600">Total Expenses</StatLabel>
          </HStack>
          <StatNumber color="error.600" fontSize="2xl">${expenses.toFixed(2)}</StatNumber>
        </Stat>

        <Stat>
          <HStack>
            <Icon as={LuDollarSign} color={netBalance >= 0 ? "primary.500" : "error.500"} boxSize={5}/>
            <StatLabel color="neutral.600">Net Balance</StatLabel>
          </HStack>
          <StatNumber color={netBalance >= 0 ? "primary.600" : "error.600"} fontSize="2xl">
            ${netBalance.toFixed(2)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type={netBalance >= 0 ? 'increase' : 'decrease'} />
            {netBalance >= 0 ? 'Positive' : 'Negative'} Balance
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default IncomeVsExpenseChart;
