import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Flex,
  Select,
  Input,
  Button,
  Spinner,
  Text,
  Grid,
  FormControl,
  FormLabel,
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { LuCalendarDays, LuBarChart, LuPieChart, LuTrendingUp } from 'react-icons/lu';
import SpendingByCategoryChart from '../features/reports/components/SpendingByCategoryChart';
import IncomeVsExpenseChart from '../features/reports/components/IncomeVsExpenseChart';
// import { apiClient } from '../services/api'; // Placeholder for API calls

// Mock API service
const mockReportService = {
  getSpendingByCategory: async ({ startDate, endDate }) => {
    console.log('Fetching spending by category for:', startDate, endDate);
    await new Promise(res => setTimeout(res, 500));
    return [
      { category: 'Food', amount: Math.random() * 500, color: '#3B82F6' },
      { category: 'Transport', amount: Math.random() * 200, color: '#EF4444' },
      { category: 'Utilities', amount: Math.random() * 300, color: '#F59E0B' },
      { category: 'Entertainment', amount: Math.random() * 150, color: '#10B981' },
      { category: 'Other', amount: Math.random() * 100, color: '#6B7280' },
    ];
  },
  getIncomeVsExpense: async ({ startDate, endDate }) => {
    console.log('Fetching income vs expense for:', startDate, endDate);
    await new Promise(res => setTimeout(res, 500));
    return {
      income: Math.random() * 5000 + 2000,
      expenses: Math.random() * 3000 + 1000,
    };
  },
  getFinancialTrend: async ({ startDate, endDate }) => {
    console.log('Fetching financial trend for:', startDate, endDate);
    await new Promise(res => setTimeout(res, 500));
    // Mock data for a line chart (e.g., net balance over 6 months)
    return [
      { name: 'Jan', income: 3000, expenses: 2000 }, 
      { name: 'Feb', income: 3200, expenses: 2200 }, 
      { name: 'Mar', income: 2800, expenses: 1900 }, 
      { name: 'Apr', income: 3500, expenses: 2500 }, 
      { name: 'May', income: 3300, expenses: 2300 }, 
      { name: 'Jun', income: 4000, expenses: 2000 },
    ];
  }
};

const ReportsPage = () => {
  const [spendingData, setSpendingData] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState({ income: 0, expenses: 0 });
  const [financialTrendData, setFinancialTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const calculateDateRange = (period) => {
    const today = new Date();
    let startDate, endDate = today;
    switch (period) {
      case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last_3_months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        break;
      case 'year_to_date':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'current_month':
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
    }
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  const fetchReportsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentRange = selectedPeriod === 'custom' ? dateRange : calculateDateRange(selectedPeriod);
      
      const [spending, incomeExpense, trend] = await Promise.all([
        mockReportService.getSpendingByCategory(currentRange),
        mockReportService.getIncomeVsExpense(currentRange),
        mockReportService.getFinancialTrend(currentRange),
      ]);
      setSpendingData(spending);
      setIncomeExpenseData(incomeExpense);
      setFinancialTrendData(trend);
    } catch (err) {
      setError('Failed to fetch report data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, selectedPeriod]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const handlePeriodChange = (e) => {
    const period = e.target.value;
    setSelectedPeriod(period);
    if (period !== 'custom') {
      const newRange = calculateDateRange(period);
      setDateRange(newRange);
    }
  };

  const handleDateChange = (e) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerateReport = () => {
    fetchReportsData();
  };

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ base: 'flex-start', md: 'center' }} mb={6}>
        <Heading as="h1" size="xl" fontFamily="secondary" color="neutral.800">
          Financial Reports
        </Heading>
      </Flex>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, auto) 1fr' }} gap={4} alignItems="flex-end">
          <FormControl>
            <FormLabel htmlFor="report-period" fontSize="sm">Period</FormLabel>
            <Select id="report-period" value={selectedPeriod} onChange={handlePeriodChange}>
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="year_to_date">Year to Date</option>
              <option value="custom">Custom Range</option>
            </Select>
          </FormControl>

          {selectedPeriod === 'custom' && (
            <>
              <FormControl>
                <FormLabel htmlFor="startDate" fontSize="sm">From</FormLabel>
                <Input type="date" id="startDate" name="startDate" value={dateRange.startDate} onChange={handleDateChange} />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="endDate" fontSize="sm">To</FormLabel>
                <Input type="date" id="endDate" name="endDate" value={dateRange.endDate} onChange={handleDateChange} />
              </FormControl>
            </>
          )}
          <Button 
            leftIcon={<Icon as={LuCalendarDays} />} 
            colorScheme="primary" 
            onClick={handleGenerateReport} 
            isLoading={isLoading}
            w={{ base: '100%', lg: 'auto' }}
            mt={{ base: 4, lg: 0 }}
            gridColumn={{lg: selectedPeriod === 'custom' ? 'span 1': 'span 3 / span 3'}}
            justifySelf={{lg: 'flex-end'}}
          >
            Generate Report
          </Button>
        </Grid>
      </Box>

      {isLoading && (
        <Flex justifyContent="center" alignItems="center" minHeight="300px">
          <Spinner size="xl" color="primary.500" />
        </Flex>
      )}
      {error && <Text color="error.500">{error}</Text>}

      {!isLoading && !error && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <SpendingByCategoryChart data={spendingData} />
          <IncomeVsExpenseChart data={incomeExpenseData} />
        </SimpleGrid>
      )}
      
      {!isLoading && !error && (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Heading size="md" fontFamily="secondary" mb={4} color="neutral.700">
            <Icon as={LuTrendingUp} mr={2} verticalAlign="middle" />
            Financial Trend (Net Balance)
          </Heading>
          {/* Placeholder for Financial Trend Chart - e.g., using Recharts LineChart */}
          <Box h="300px" bg="neutral.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
            <Text color="neutral.500" fontSize="lg">Line Chart Placeholder</Text>
          </Box>
          {/* You would map financialTrendData to chart data here */}
          {/* Example: <LineChart data={financialTrendData.map(d => ({ name: d.name, net: d.income - d.expenses }))} /> */}
        </Box>
      )}
    </Box>
  );
};

export default ReportsPage;
