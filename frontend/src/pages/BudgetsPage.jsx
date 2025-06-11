import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Button,
  Flex,
  Spinner,
  Text,
  useDisclosure,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import BudgetList from '../features/budgets/components/BudgetList';
import BudgetFormModal from '../features/budgets/components/BudgetFormModal';
// import { apiClient } from '../services/api'; // Placeholder for API calls

// Mock API service
const mockBudgetService = {
  getBudgets: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate fetching budgets
    return [
      { id: '1', category: 'Food', amount: 500, period: 'monthly', spent: 350, createdAt: '2024-07-01T10:00:00Z' },
      { id: '2', category: 'Transport', amount: 150, period: 'monthly', spent: 100, createdAt: '2024-07-01T10:00:00Z' },
      { id: '3', category: 'Entertainment', amount: 200, period: 'monthly', spent: 210, createdAt: '2024-07-01T10:00:00Z' },
    ];
  },
  createBudget: async (budgetData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Creating budget:', budgetData);
    return { id: Date.now().toString(), ...budgetData, spent: 0, createdAt: new Date().toISOString() };
  },
  updateBudget: async (budgetId, budgetData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating budget:', budgetId, budgetData);
    return { id: budgetId, ...budgetData, spent: Math.random() * budgetData.amount }; // Mock spent amount
  },
  deleteBudget: async (budgetId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleting budget:', budgetId);
    return { message: 'Budget deleted successfully' };
  },
};

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null); // For editing mode
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' }); // For success/error messages from API

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await apiClient.get('/budgets');
      // setBudgets(response.data);
      const data = await mockBudgetService.getBudgets();
      setBudgets(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch budgets.');
      setApiMessage({ type: 'error', text: err.message || 'Failed to fetch budgets.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleAddBudget = () => {
    setEditingBudget(null); // Ensure not in edit mode
    onModalOpen();
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    onModalOpen();
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setIsLoading(true);
      try {
        // await apiClient.del(`/budgets/${budgetId}`);
        await mockBudgetService.deleteBudget(budgetId);
        setApiMessage({ type: 'success', text: 'Budget deleted successfully!' });
        fetchBudgets(); // Refresh list
      } catch (err) {
        setError(err.message || 'Failed to delete budget.');
        setApiMessage({ type: 'error', text: err.message || 'Failed to delete budget.' });
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = async (budgetData, budgetId) => {
    setIsLoading(true);
    setError(null);
    try {
      if (budgetId) {
        // Update existing budget
        // await apiClient.put(`/budgets/${budgetId}`, budgetData);
        await mockBudgetService.updateBudget(budgetId, budgetData);
        setApiMessage({ type: 'success', text: 'Budget updated successfully!' });
      } else {
        // Create new budget
        // await apiClient.post('/budgets', budgetData);
        await mockBudgetService.createBudget(budgetData);
        setApiMessage({ type: 'success', text: 'Budget created successfully!' });
      }
      fetchBudgets(); // Refresh list
      onModalClose();
    } catch (err) {
      setError(err.message || 'Failed to save budget.');
      setApiMessage({ type: 'error', text: err.message || 'Failed to save budget.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" color="neutral.800" fontFamily="fontSecondary">
          Manage Budgets
        </Heading>
        <Button
          leftIcon={<Icon as={LuPlus} />}
          colorScheme="primary"
          onClick={handleAddBudget}
        >
          Add New Budget
        </Button>
      </Flex>

      {apiMessage.text && (
        <Alert 
          status={apiMessage.type === 'success' ? 'success' : 'error'} 
          mb={4} 
          borderRadius="md"
        >
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>{apiMessage.type === 'success' ? 'Success!' : 'Error!'}</AlertTitle>
            <AlertDescription display="block">{apiMessage.text}</AlertDescription>
          </Box>
          <CloseButton position="absolute" right="8px" top="8px" onClick={() => setApiMessage({ type: '', text: ''})} />
        </Alert>
      )}

      {isLoading && !budgets.length ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="primary.500" />
        </Flex>
      ) : error && !budgets.length ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <BudgetList
          budgets={budgets}
          onEdit={handleEditBudget}
          onDelete={handleDeleteBudget}
          isLoading={isLoading} // Pass loading state for individual item updates
        />
      )}

      <BudgetFormModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        onSubmit={handleFormSubmit}
        budgetData={editingBudget}
      />
    </Box>
  );
};

export default BudgetsPage;
