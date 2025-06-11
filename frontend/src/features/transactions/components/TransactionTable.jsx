import React, { useState, useMemo } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, IconButton, Tag, Text, HStack, Button, Box, Icon, Flex, useColorModeValue,
} from '@chakra-ui/react';
import { LuEdit, LuTrash2, LuArrowUp, LuArrowDown } from 'react-icons/lu';

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({ transactions = [], onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Handle date sorting specifically if dates are strings
        if (sortConfig.key === 'date') {
            const dateA = new Date(a[sortConfig.key]);
            const dateB = new Date(b[sortConfig.key]);
            if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        }
        // General sorting for other keys
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedTransactions, currentPage]);

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return <Icon as={sortConfig.direction === 'ascending' ? LuArrowUp : LuArrowDown} ml={1} boxSize={3}/>;
    }
    return <Icon as={LuArrowDown} ml={1} boxSize={3} opacity={0.3} />;
  };
  
  const headerColor = useColorModeValue('neutral.600', 'neutral.300');
  const headerBg = useColorModeValue('neutral.50', 'neutral.700'); // Slightly different from table body for distinction
  const borderColor = useColorModeValue('neutral.200', 'neutral.600');
  const rowHoverBg = useColorModeValue('neutral.100', 'neutral.750');
  const tableBg = useColorModeValue('white', 'neutral.800');

  if (transactions.length === 0) {
    return <Text p={4} textAlign="center" color={useColorModeValue('neutral.600', 'neutral.300')}>No transactions to display.</Text>;
  }

  return (
    <Box bg={tableBg} borderRadius="lg" boxShadow="md" overflow="hidden">
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th onClick={() => requestSort('date')} cursor="pointer" color={headerColor} _hover={{ bg: rowHoverBg }}>Date {getSortIcon('date')}</Th>
              <Th onClick={() => requestSort('description')} cursor="pointer" color={headerColor} _hover={{ bg: rowHoverBg }}>Description {getSortIcon('description')}</Th>
              <Th onClick={() => requestSort('category')} cursor="pointer" color={headerColor} _hover={{ bg: rowHoverBg }}>Category {getSortIcon('category')}</Th>
              <Th onClick={() => requestSort('type')} cursor="pointer" color={headerColor} _hover={{ bg: rowHoverBg }}>Type {getSortIcon('type')}</Th>
              <Th onClick={() => requestSort('amount')} isNumeric cursor="pointer" color={headerColor} _hover={{ bg: rowHoverBg }}>Amount {getSortIcon('amount')}</Th>
              <Th color={headerColor}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedTransactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const amountColor = isIncome ? 'success.500' : 'error.500';
              const formattedAmount = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(transaction.amount);

              return (
                <Tr key={transaction.id} _hover={{ bg: rowHoverBg }}>
                  <Td borderColor={borderColor}>{new Date(transaction.date).toLocaleDateString()}</Td>
                  <Td borderColor={borderColor} maxW="200px" isTruncated title={transaction.description}>{transaction.description}</Td>
                  <Td borderColor={borderColor}>{transaction.category}</Td>
                  <Td borderColor={borderColor}>
                    <Tag colorScheme={isIncome ? 'green' : 'red'} size="sm" variant="subtle">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Tag>
                  </Td>
                  <Td isNumeric color={amountColor} fontWeight="medium" borderColor={borderColor}>
                    {isIncome ? '+' : '-'}{formattedAmount.replace('$-','-').replace('$','')}
                  </Td>
                  <Td borderColor={borderColor}>
                    <HStack spacing={1}>
                      <IconButton
                        icon={<Icon as={LuEdit} />}
                        aria-label="Edit transaction"
                        size="xs"
                        variant="ghost"
                        colorScheme="neutral"
                        onClick={() => onEdit(transaction)}
                      />
                      <IconButton
                        icon={<Icon as={LuTrash2} />}
                        aria-label="Delete transaction"
                        size="xs"
                        variant="ghost"
                        colorScheme="error"
                        onClick={() => onDelete(transaction.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Flex justifyContent="space-between" alignItems="center" p={3} borderTopWidth="1px" borderColor={borderColor}>
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            isDisabled={currentPage === 1}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Text fontSize="sm" color={useColorModeValue('neutral.600', 'neutral.300')}>Page {currentPage} of {totalPages}</Text>
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            isDisabled={currentPage === totalPages}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default TransactionTable;
