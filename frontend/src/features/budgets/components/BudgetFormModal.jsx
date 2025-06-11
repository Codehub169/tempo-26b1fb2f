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
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
} from '@chakra-ui/react';

// Placeholder categories - in a real app, these might come from an API or config
// Should be consistent with categories used for transactions if applicable
const budgetCategories = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'rent_mortgage', label: 'Rent/Mortgage' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'education', label: 'Education' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'travel', label: 'Travel' },
  { value: 'savings', label: 'Savings' },
  { value: 'debt_repayment', label: 'Debt Repayment' },
  { value: 'other', label: 'Other' },
];

const budgetPeriods = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

const BudgetFormModal = ({ isOpen, onClose, onSubmit, budgetData }) => {
  const isEditMode = Boolean(budgetData);
  const initialFormState = {
    category: '',
    amount: '',
    period: 'monthly', // Default period
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && budgetData) {
      setFormData({
        category: budgetData.category || '',
        amount: budgetData.amount ? budgetData.amount.toString() : '',
        period: budgetData.period || 'monthly',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({}); // Clear errors when modal opens or data changes
  }, [isOpen, budgetData, isEditMode]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0.';
    }
    if (!formData.period) {
      newErrors.period = 'Period is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    onSubmit(submissionData, budgetData?.id);
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
          {isEditMode ? 'Edit Budget' : 'Create New Budget'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={errors.category}>
              <FormLabel color="neutral.700" fontSize="sm">Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Select a category"
              >
                {budgetCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
              {errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={errors.amount}>
              <FormLabel color="neutral.700" fontSize="sm">Budget Amount</FormLabel>
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

            <FormControl isRequired isInvalid={errors.period}>
              <FormLabel color="neutral.700" fontSize="sm">Period</FormLabel>
              <Select
                name="period"
                value={formData.period}
                onChange={handleChange}
              >
                {budgetPeriods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              {errors.period && <FormErrorMessage>{errors.period}</FormErrorMessage>}
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose} mr={3} variant="outline">
            Cancel
          </Button>
          <Button colorScheme="primary" type="submit">
            {isEditMode ? 'Save Changes' : 'Create Budget'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BudgetFormModal;
