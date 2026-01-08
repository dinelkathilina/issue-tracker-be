import { Issue } from '../models/Issue';
import {
    IIssue,
    IssueFilterQuery,
    PaginatedResponse,
    StatusCounts,
    IssueStatus,
} from '../types';
import { AppError } from '../middleware/error.middleware';

interface CreateIssueInput {
    title: string;
    description: string;
    priority: string;
    severity?: string;
    status?: string;
    createdBy: string;
}

interface UpdateIssueInput {
    title?: string;
    description?: string;
    priority?: string;
    severity?: string;
    status?: string;
}

export const createIssue = async (input: CreateIssueInput): Promise<IIssue> => {
    const issue = await Issue.create(input);
    return issue;
};

export const getIssues = async (
    query: IssueFilterQuery
): Promise<PaginatedResponse<IIssue>> => {
    const {
        search,
        status,
        priority,
        severity,
        createdBy,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
    } = query;

    // Build filter object
    const filter: any = {};

    if (createdBy) {
        filter.createdBy = createdBy;
    }

    if (status) {
        filter.status = status;
    }

    if (priority) {
        filter.priority = priority;
    }

    if (severity) {
        filter.severity = severity;
    }

    // Add text search if provided
    if (search) {
        filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [issues, totalItems] = await Promise.all([
        Issue.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'email')
            .lean(),
        Issue.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
        data: issues as IIssue[],
        pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

export const getIssueById = async (id: string): Promise<IIssue> => {
    const issue = await Issue.findById(id).populate('createdBy', 'email');

    if (!issue) {
        throw new AppError('Issue not found', 404);
    }

    return issue;
};

export const updateIssue = async (
    id: string,
    updates: UpdateIssueInput
): Promise<IIssue> => {
    const issue = await Issue.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    if (!issue) {
        throw new AppError('Issue not found', 404);
    }

    return issue;
};

export const resolveIssue = async (id: string): Promise<IIssue> => {
    const issue = await Issue.findByIdAndUpdate(
        id,
        { $set: { status: IssueStatus.RESOLVED } },
        { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    if (!issue) {
        throw new AppError('Issue not found', 404);
    }

    return issue;
};

export const closeIssue = async (id: string): Promise<IIssue> => {
    const issue = await Issue.findByIdAndUpdate(
        id,
        { $set: { status: IssueStatus.CLOSED } },
        { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    if (!issue) {
        throw new AppError('Issue not found', 404);
    }

    return issue;
};

export const deleteIssue = async (id: string): Promise<void> => {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
        throw new AppError('Issue not found', 404);
    }
};

export const getStatusCounts = async (userId: string): Promise<StatusCounts> => {
    const counts = await Issue.aggregate([
        {
            $match: { createdBy: userId },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    const statusCounts: StatusCounts = {
        [IssueStatus.OPEN]: 0,
        [IssueStatus.IN_PROGRESS]: 0,
        [IssueStatus.RESOLVED]: 0,
        [IssueStatus.CLOSED]: 0,
        total: 0,
    };

    counts.forEach((item) => {
        statusCounts[item._id as IssueStatus] = item.count;
        statusCounts.total += item.count;
    });

    return statusCounts;
};
