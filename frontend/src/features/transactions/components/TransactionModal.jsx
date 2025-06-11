import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage
} from '@chakra-ui/react';

// Placeholder categories - in a real app, these might come from an API or config
const categories = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'gift', label: 'Gift' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'rent_mortgage', label: 'Rent/Mortgage' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'education', label: 'Education' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

const TransactionModal = ({ isOpen, onClose, onSubmit, transactionData }) => {
  const isEditMode = Boolean(transactionData);
  const initialFormState = {
    type: 'expense', // 'income' or 'expense'
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && transactionData) {
      setFormData({
        type: transactionData.type || 'expense',
        amount: transactionData.amount ? Math.abs(transactionData.amount).toString() : '', // Ensure amount is positive for input
        category: transactionData.category || '',
        date: transactionData.date ? new Date(transactionData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: transactionData.description || '',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({}); // Clear errors when modal opens or data changes
  }, [isOpen, transactionData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAmountChange = (valueString) => {
    setFormData((prev) => ({ ...prev, amount: valueString }));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: null }));
    }
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0.';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required.';
    }
    // Basic date validation (e.g. not empty, could be more complex)
    try {
      new Date(formData.date).toISOString();
    } catch (error) {
      newErrors.date = 'Invalid date format.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      // Amount should be negative for expenses if your backend expects that
      // For now, sending the absolute value and type separately
      amount: parseFloat(formData.amount),
    };
    onSubmit(submissionData, transactionData?.id);
    handleClose();
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader color="neutral.800" fontFamily="fontSecondary">
          {isEditMode ? 'Edit Transaction' : 'Add New Transaction'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={errors.type}>
              <FormLabel color="neutral.700" fontSize="sm">Type</FormLabel>
              <RadioGroup onChange={handleTypeChange} value={formData.type} name="type">
                <Stack direction="row" spacing={5}>
                  <Radio value="income" colorScheme="green">
                    Income
                  </Radio>
                  <Radio value="expense" colorScheme="red">
                    Expense
                  </Radio>
                </Stack>
              </RadioGroup>
              {errors.type && <FormErrorMessage>{errors.type}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={errors.amount}>
              <FormLabel color="neutral.700" fontSize="sm">Amount</FormLabel>
              <NumberInput
                value={formData.amount}
                onChange={handleAmountChange}
                precision={2}
                step={0.01}
                min={0.01}
              >
                <NumberInputField placeholder="0.00" name="amount" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {errors.amount && <FormErrorMessage>{errors.amount}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={errors.category}>
              <FormLabel color="neutral.700" fontSize="sm">Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Select a category"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
              {errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={errors.date}>
              <FormLabel color="neutral.700" fontSize="sm">Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel color="neutral.700" fontSize="sm">Description (Optional)</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Lunch with colleagues"
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose} mr={3} variant="outline">
            Cancel
          </Button>
          <Button colorScheme="primary" type="submit">
            {isEditMode ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionModal;
