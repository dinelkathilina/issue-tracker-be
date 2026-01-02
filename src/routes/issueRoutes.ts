import { Router } from 'express';
import * as issueController from '../controllers/issueController';
import { authenticate } from '../middleware/auth.middleware';
import {
    validateIssueCreation,
    validateIssueUpdate,
} from '../middleware/validation.middleware';

const router = Router();

// All issue routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/issues
 * @desc    Create a new issue
 * @access  Private
 */
router.post('/', validateIssueCreation, issueController.createIssue);

/**
 * @route   GET /api/issues
 * @desc    Get all issues with filters and pagination
 * @access  Private
 * @query   search, status, priority, severity, page, limit, sortBy, order
 */
router.get('/', issueController.getIssues);

/**
 * @route   GET /api/issues/counts
 * @desc    Get issue counts by status
 * @access  Private
 */
router.get('/counts', issueController.getStatusCounts);

/**
 * @route   GET /api/issues/:id
 * @desc    Get a specific issue by ID
 * @access  Private
 */
router.get('/:id', issueController.getIssueById);

/**
 * @route   PUT /api/issues/:id
 * @desc    Update an issue
 * @access  Private
 */
router.put('/:id', validateIssueUpdate, issueController.updateIssue);

/**
 * @route   PATCH /api/issues/:id/resolve
 * @desc    Mark an issue as resolved
 * @access  Private
 */
router.patch('/:id/resolve', issueController.resolveIssue);

/**
 * @route   PATCH /api/issues/:id/close
 * @desc    Mark an issue as closed
 * @access  Private
 */
router.patch('/:id/close', issueController.closeIssue);

/**
 * @route   DELETE /api/issues/:id
 * @desc    Delete an issue
 * @access  Private
 */
router.delete('/:id', issueController.deleteIssue);

export default router;
