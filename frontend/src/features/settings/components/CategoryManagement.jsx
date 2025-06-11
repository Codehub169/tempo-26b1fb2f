import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Spinner,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { LuPlus, LuEdit2, LuTrash2, LuTag, LuSave } from 'react-icons/lu';

// Placeholder for API service calls
const mockCategoryService = {
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 'cat1', name: 'Groceries', type: 'expense' },
      { id: 'cat2', name: 'Salary', type: 'income' },
      { id: 'cat3', name: 'Utilities', type: 'expense' },
      { id: 'cat4', name: 'Freelance', type: 'income' },
      { id: 'cat5', name: 'Entertainment', type: 'expense' },
    ];
  },
  addCategory: async (category) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Adding category:', category);
    return { ...category, id: `cat${Date.now()}` };
  },
  updateCategory: async (id, category) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating category:', id, category);
    return { ...category, id };
  },
  deleteCategory: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleting category:', id);
    return { message: 'Category deleted' };
  },
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('expense'); // 'income' or 'expense'
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'neutral.800');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const fetchedCategories = await mockCategoryService.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      toast({ title: 'Error fetching categories', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
    setIsLoading(false);
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setCategoryType(category ? category.type : 'expense');
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryType('expense');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast({ title: 'Category name cannot be empty', status: 'warning', duration: 2000, isClosable: true });
      return;
    }
    setIsLoading(true);
    try {
      if (editingCategory) {
        await mockCategoryService.updateCategory(editingCategory.id, { name: categoryName, type: categoryType });
        toast({ title: 'Category updated', status: 'success', duration: 2000, isClosable: true });
      } else {
        await mockCategoryService.addCategory({ name: categoryName, type: categoryType });
        toast({ title: 'Category added', status: 'success', duration: 2000, isClosable: true });
      }
      fetchCategories(); // Refresh list
      handleCloseModal();
    } catch (error) {
      toast({ title: 'Error saving category', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This might affect existing transactions.')) return;
    setIsLoading(true);
    try {
      await mockCategoryService.deleteCategory(id);
      toast({ title: 'Category deleted', status: 'info', duration: 2000, isClosable: true });
      fetchCategories(); // Refresh list
    } catch (error) {
      toast({ title: 'Error deleting category', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
    setIsLoading(false);
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg={cardBg} boxShadow="md">
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="lg" fontFamily="secondary">Manage Categories</Heading>
        <Button leftIcon={<LuPlus />} colorScheme="primary" onClick={() => handleOpenModal()}>
          Add Category
        </Button>
      </HStack>

      {isLoading && !categories.length ? (
        <Spinner thickness="4px" speed="0.65s" emptyColor="neutral.200" color="primary.500" size="xl" />
      ) : categories.length === 0 && !isLoading ? (
        <Text>No categories found. Add some to get started!</Text>
      ) : (
        <Wrap spacing={3}>
          {categories.map((cat) => (
            <WrapItem key={cat.id}>
              <Tag 
                size="lg" 
                borderRadius="full" 
                variant="subtle" 
                colorScheme={cat.type === 'income' ? 'green' : 'red'}
                py={2} px={3}
              >
                <Icon as={LuTag} mr={2} />
                <TagLabel>{cat.name}</TagLabel>
                <HStack spacing={1} ml={2}>
                    <IconButton 
                        icon={<LuEdit2 />} 
                        size="xs" 
                        variant="ghost" 
                        aria-label="Edit category" 
                        onClick={() => handleOpenModal(cat)}
                        colorScheme={cat.type === 'income' ? 'green' : 'red'}
                    />
                    <IconButton 
                        icon={<LuTrash2 />} 
                        size="xs" 
                        variant="ghost" 
                        aria-label="Delete category" 
                        onClick={() => handleDelete(cat.id)}
                        colorScheme={cat.type === 'income' ? 'green' : 'red'}
                    />
                </HStack>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}

      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>{editingCategory ? 'Edit Category' : 'Add New Category'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired mb={4}>
              <FormLabel>Category Name</FormLabel>
              <Input 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)} 
                placeholder="e.g., Groceries, Salary"
              />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Category Type</FormLabel>
                <HStack spacing={4}>
                    <Button 
                        onClick={() => setCategoryType('expense')}
                        colorScheme={categoryType === 'expense' ? 'red' : 'gray'}
                        variant={categoryType === 'expense' ? 'solid' : 'outline'}
                        flex={1}
                    >
                        Expense
                    </Button>
                    <Button 
                        onClick={() => setCategoryType('income')}
                        colorScheme={categoryType === 'income' ? 'green' : 'gray'}
                        variant={categoryType === 'income' ? 'solid' : 'outline'}
                        flex={1}
                    >
                        Income
                    </Button>
                </HStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal} mr={3} variant="ghost">Cancel</Button>
            <Button colorScheme="primary" type="submit" isLoading={isLoading} leftIcon={<LuSave />}>
              {editingCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CategoryManagement;
