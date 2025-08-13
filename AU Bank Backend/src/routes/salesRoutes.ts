import { Router, Request, Response } from 'express';
import DataService from '../services/DataService';
import { FilteredSalesQuery } from '../types/Sale';

const router = Router();
const dataService = new DataService();

// GET /api/sales/states - Get all unique states
router.get('/states', (req: Request, res: Response) => {
  try {
    const states = dataService.getStates();
    
    res.json({
      success: true,
      data: states,
      count: states.length
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/sales/date-range/:state - Get min/max dates for a specific state
router.get('/date-range/:state', (req: Request, res: Response) => {
  try {
    const { state } = req.params;
    
    if (!state || !state.trim()) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    const dateRange = dataService.getDateRangeForState(state);
    
    if (!dateRange) {
      return res.status(404).json({
        success: false,
        error: `No sales data found for state: ${state}`
      });
    }

    res.json({
      success: true,
      data: {
        state: state,
        ...dateRange
      }
    });
  } catch (error) {
    console.error('Error fetching date range:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/sales/data - Get filtered sales data with pagination
router.get('/data', (req: Request, res: Response) => {
  try {
    const filters: FilteredSalesQuery = {
      state: req.query.state as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      city: req.query.city as string,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };

    const result = dataService.getFilteredSales(filters);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching filtered sales data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/sales/stats - Get statistics with optional filters
router.get('/stats', (req: Request, res: Response) => {
  try {
    const filters = {
      state: req.query.state as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string
    };

    // Remove undefined/empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value.trim())
    );

    const stats = dataService.getSalesStats(Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined);
    
    res.json({
      success: true,
      data: stats,
      filters: cleanFilters // Include applied filters in response for reference
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/sales-by-city', (req: Request, res: Response) => {
  try {
    const { state, startDate, endDate } = req.query;

    const data = dataService.getSalesByCity({
    state: state as string,
    startDate: startDate as string,
    endDate: endDate as string
  });
    
    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('Error fetching filtered sales by city:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
