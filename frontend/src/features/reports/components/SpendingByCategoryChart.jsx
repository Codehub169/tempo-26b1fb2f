import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useTheme,
  SimpleGrid,
  Tooltip,
  Flex
} from '@chakra-ui/react';
import { LuPieChart, LuShoppingBag, LuUtensils, LuCar, LuTicket, LuEllipsis } from 'react-icons/lu';

// A simple hashing function to get a color from a predefined list based on category name
const categoryColors = [
  'blue.500', 'red.500', 'yellow.500', 'green.500', 'purple.500', 
  'teal.500', 'pink.500', 'orange.500', 'cyan.500', 'indigo.500'
];

const getCategoryColor = (categoryName) => {
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % categoryColors.length);
  return categoryColors[index];
};

const categoryIcons = {
  'Food': LuUtensils,
  'Transport': LuCar,
  'Utilities': LuShoppingBag, // Placeholder, could be more specific
  'Entertainment': LuTicket,
  'Other': LuEllipsis
};

const SpendingByCategoryChart = ({ data }) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" h="100%">
        <Heading size="md" fontFamily="secondary" mb={4} color="neutral.700">
          <Icon as={LuPieChart} mr={2} verticalAlign="middle" />
          Spending by Category
        </Heading>
        <Flex alignItems="center" justifyContent="center" h="200px">
            <Text color="neutral.500">No spending data available for the selected period.</Text>
        </Flex>
      </Box>
    );
  }

  const totalSpending = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md" h="100%">
      <Heading size="md" fontFamily="secondary" mb={4} color="neutral.700">
        <Icon as={LuPieChart} mr={2} verticalAlign="middle" />
        Spending by Category
      </Heading>
      
      {/* Placeholder for actual chart */}
      <Flex alignItems="center" justifyContent="center" h="200px" bg="neutral.50" borderRadius="md" mb={4}>
        <Text color="neutral.400" fontSize="lg" fontWeight="medium">Pie Chart Placeholder</Text>
      </Flex>

      <VStack spacing={2} align="stretch">
        {data.map((item, index) => {
          const percentage = totalSpending > 0 ? (item.amount / totalSpending) * 100 : 0;
          const color = item.color || getCategoryColor(item.category); // Use provided color or generate one
          const IconComponent = categoryIcons[item.category] || LuShoppingBag;
          return (
            <Tooltip key={index} label={`${item.category}: $${item.amount.toFixed(2)} (${percentage.toFixed(1)}%)`} placement="top" hasArrow>
              <HStack justifyContent="space-between" p={2} borderRadius="md" _hover={{bg: "neutral.50"}}>
                <HStack spacing={3}>
                  <Icon as={IconComponent} color={color} boxSize={5} />
                  <Text fontSize="sm" fontWeight="medium" color="neutral.700">{item.category}</Text>
                </HStack>
                <VStack alignItems="flex-end" spacing={0}>
                    <Text fontSize="sm" fontWeight="bold" color="neutral.800">${item.amount.toFixed(2)}</Text>
                    <Text fontSize="xs" color="neutral.500">{percentage.toFixed(1)}%</Text>
                </VStack>
              </HStack>
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
};

export default SpendingByCategoryChart;
