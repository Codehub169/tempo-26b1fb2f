import React from 'react';
import {
  Box,
  Text,
  Grid,
  GridItem,
  Heading,
  Flex,
  IconButton,
  Progress,
  Tag,
  Tooltip,
  Icon,
  Stack,
  Skeleton
} from '@chakra-ui/react';
import { LuEdit, LuTrash2, LuCalendarDays, LuDollarSign, LuTrendingUp } from 'react-icons/lu';

const BudgetListItem = ({ budget, onEdit, onDelete, isLoadingItem }) => {
  const { id, category, amount, period, spent, createdAt } = budget;
  const spentPercentage = amount > 0 ? (spent / amount) * 100 : 0;
  const remainingAmount = amount - spent;

  let progressBarColor = 'primary';
  if (spentPercentage > 75 && spentPercentage <= 100) {
    progressBarColor = 'yellow'; // Corresponds to warning.500 typically
  } else if (spentPercentage > 100) {
    progressBarColor = 'red'; // Corresponds to error.500 typically
  }

  const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedSpent = spent.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedRemaining = remainingAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <GridItem
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="md"
      borderWidth="1px"
      borderColor="neutral.200"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Skeleton isLoaded={!isLoadingItem}>
        <Box>
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="md" color="neutral.700" noOfLines={1} title={category}>
              {category}
            </Heading>
            <Tag size="sm" colorScheme="primary" variant="subtle" textTransform="capitalize">
              {period}
            </Tag>
          </Flex>

          <Stack spacing={3} color="neutral.600" fontSize="sm" mb={4}>
            <Flex align="center">
              <Icon as={LuDollarSign} mr={2} color="primary.500" /> Budgeted: {formattedAmount}
            </Flex>
            <Flex align="center">
              <Icon as={LuTrendingUp} mr={2} color={spent > amount ? 'error.500' : 'success.500'} /> Spent: {formattedSpent}
            </Flex>
             <Flex align="center" fontWeight="medium">
              <Icon as={LuCalendarDays} mr={2} color="neutral.500" /> Remaining: {formattedRemaining}
            </Flex>
          </Stack>

          <Box mb={1}>
            <Text fontSize="xs" color="neutral.500" textAlign="right">
              {spentPercentage.toFixed(0)}% Used
            </Text>
            <Progress value={spentPercentage} size="sm" colorScheme={progressBarColor} borderRadius="md" />
          </Box>
        </Box>
      </Skeleton>
      <Skeleton isLoaded={!isLoadingItem}>
        <Flex justify="flex-end" mt={4} borderTopWidth="1px" borderColor="neutral.100" pt={3}>
            <Tooltip label="Edit Budget" placement="top">
              <IconButton
                icon={<LuEdit />}
                aria-label="Edit budget"
                variant="ghost"
                colorScheme="neutral"
                onClick={() => onEdit(budget)}
                size="sm"
                mr={2}
              />
            </Tooltip>
            <Tooltip label="Delete Budget" placement="top">
              <IconButton
                icon={<LuTrash2 />}
                aria-label="Delete budget"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(id)}
                size="sm"
              />
            </Tooltip>
          </Flex>
      </Skeleton>
    </GridItem>
  );
};

const BudgetList = ({ budgets, onEdit, onDelete, isLoading }) => {
  if (isLoading && !budgets.length) {
    // Show skeletons if loading initial data
    return (
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {[...Array(3)].map((_, i) => (
          <GridItem key={i} bg="white" p={5} borderRadius="lg" boxShadow="md">
            <Skeleton height="20px" mb={4} />
            <Skeleton height="15px" mb={2} width="80%" />
            <Skeleton height="15px" mb={2} width="60%" />
            <Skeleton height="10px" mt={4} mb={2} />
            <Skeleton height="8px" mb={4} />
            <Flex justify="flex-end" mt={3}>
              <Skeleton height="30px" width="30px" mr={2} />
              <Skeleton height="30px" width="30px" />
            </Flex>
          </GridItem>
        ))}
      </Grid>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6} borderWidth="1px" borderRadius="lg" borderColor="neutral.200" bg="white">
        <Heading as="h2" size="lg" mt={6} mb={2} color="neutral.700">
          No Budgets Found
        </Heading>
        <Text color={'neutral.500'}>
          Get started by adding a new budget. Track your spending and stay on top of your finances!
        </Text>
      </Box>
    );
  }

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
      {budgets.map((budget) => (
        <BudgetListItem
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoadingItem={isLoading} // Could be more granular if needed
        />
      ))}
    </Grid>
  );
};

export default BudgetList;
