import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Flex, VStack, HStack, Select, Input, Icon, useDisclosure, Text, Spinner, useColorModeValue } from '@chakra-ui/react';
import { LuPlus, LuFilter } from 'react-icons/lu';
import TransactionTable from '../features/transactions/components/TransactionTable';
// import TransactionModal from '../features/transactions/components/TransactionModal'; // To be implemented in a future batch
import { apiClient } from '../services/api'; // Assuming apiClient is set up for requests

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const { isOpen, onOpen, onClose } = useDisclosure(); // For TransactionModal
  // const [editingTransaction, setEditingTransaction] = useState(null); // For TransactionModal

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Placeholder for fetching transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Actual API call: const response = await apiClient.get('/transactions', { params: filters });
        // setTransactions(response.data);
        // Placeholder data for now:
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setTransactions([
          { id: '1', date: '2024-07-28', description: 'Salary Deposit', category: 'Income', type: 'income', amount: 2500.00 },
          { id: '2', date: '2024-07-27', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15.99 },
          { id: '3', date: '2024-07-26', description: 'Groceries from SuperMart', category: 'Food', type: 'expense', amount: 75.40 },
          { id: '4', date: '2024-07-25', description: 'Freelance Project Payment', category: 'Income', type: 'income', amount: 500.00 },
          { id: '5', date: '2024-07-24', description: 'Dinner with friends', category: 'Food', type: 'expense', amount: 45.00 },
        ]);
      } catch (err) {
        setError('Failed to fetch transactions. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []); // Re-fetch when filters change in a real app: [filters]

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleApplyFilters = () => {
    // In a real app, this would trigger a re-fetch of transactions with current filters
    console.log('Applying filters:', filters);
    alert('Filter functionality is a placeholder. Data will be fetched with these filters in a real app.');
  };

  const handleAddTransaction = () => {
    // setEditingTransaction(null);
    // onOpen();
    alert('Add Transaction Modal will open here (to be implemented).');
  };

  const handleEditTransaction = (transaction) => {
    // setEditingTransaction(transaction);
    // onOpen();
    alert(`Edit Transaction Modal for ID: ${transaction.id} will open here (to be implemented).`);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction? (Placeholder)')) {
      // Actual API call: await apiClient.delete(`/transactions/${transactionId}`);
      // setTransactions(prev => prev.filter(t => t.id !== transactionId));
      alert(`Transaction with ID: ${transactionId} would be deleted (placeholder).`);
    }
  };

  // Placeholder categories - in a real app, these would come from API or settings
  const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Salary', 'Freelance', 'Other'];
  const filterBarBg = useColorModeValue('white', 'neutral.800');

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl" fontFamily="font.secondary" color={useColorModeValue('neutral.800', 'white')}>
          Transactions
        </Heading>
        <Button 
          leftIcon={<Icon as={LuPlus} />}
          colorScheme="primary" 
          onClick={handleAddTransaction}
        >
          Add Transaction
        </Button>
      </Flex>

      <Box bg={filterBarBg} p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <HStack spacing={4} wrap="wrap" align="flex-end">
          <VStack align="flex-start" spacing={1} flexGrow={{ base: 1, md: 'initial' }} w={{ base: '48%', md: 'auto' }}>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('neutral.600', 'neutral.300')}>Type</Text>
            <Select name="type" value={filters.type} onChange={handleFilterChange} focusBorderColor="primary.500">
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </VStack>
          <VStack align="flex-start" spacing={1} flexGrow={{ base: 1, md: 'initial' }} w={{ base: '48%', md: 'auto' }}>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('neutral.600', 'neutral.300')}>Category</Text>
            <Select name="category" value={filters.category} onChange={handleFilterChange} focusBorderColor="primary.500">
              {categories.map(cat => <option key={cat.toLowerCase()} value={cat.toLowerCase()}>{cat}</option>)}
            </Select>
          </VStack>
          <VStack align="flex-start" spacing={1} flexGrow={{ base: 1, md: 'initial' }} w={{ base: '48%', md: 'auto' }}>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('neutral.600', 'neutral.300')}>Date From</Text>
            <Input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} focusBorderColor="primary.500" />
          </VStack>
          <VStack align="flex-start" spacing={1} flexGrow={{ base: 1, md: 'initial' }} w={{ base: '48%', md: 'auto' }}>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('neutral.600', 'neutral.300')}>Date To</Text>
            <Input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} focusBorderColor="primary.500" />
          </VStack>
          <Button 
            leftIcon={<Icon as={LuFilter} />} 
            colorScheme="neutral" 
            variant="outline"
            onClick={handleApplyFilters}
            alignSelf="flex-end"
            mt={{ base: 4, md: 0 }}
            w={{ base: '100%', md: 'auto' }}
            borderColor={useColorModeValue('neutral.300', 'neutral.600')}
            _hover={{ bg: useColorModeValue('neutral.100', 'neutral.700')}}
          >
            Apply Filters
          </Button>
        </HStack>
      </Box>

      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" h="200px">
          <Spinner size="xl" color="primary.500" />
        </Flex>
      ) : error ? (
        <Text color="error.500" textAlign="center" py={4}>{error}</Text>
      ) : (
        <TransactionTable 
          transactions={transactions} 
          onEdit={handleEditTransaction} 
          onDelete={handleDeleteTransaction} 
        />
      )}

      {/* <TransactionModal 
        isOpen={isOpen} 
        onClose={onClose} 
        transaction={editingTransaction}
        // onSave={handleSaveTransaction} // Placeholder for save logic
      /> */}
    </Box>
  );
};

export default TransactionsPage;
