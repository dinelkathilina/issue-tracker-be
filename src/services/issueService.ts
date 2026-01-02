import Issue, { IIssue } from '../models/Issue';

interface GetIssuesParams {
    search?: string;
    status?: string;
    priority?: string;
    page: number;
    limit: number;
}

// 1. Create Issue
export const createIssue = async (issueData: Partial<IIssue>, userId: string) => {
    const issue = await Issue.create({ ...issueData, createdBy: userId as any });
    return issue;
};

// 2. Get Issues (Search + Filter + Pagination)
export const getIssues = async ({ search, status, priority, page, limit }: GetIssuesParams) => {
    const query: any = {};

    // Text Search Logic
    if (search) {
        query.$text = { $search: search };
    }

    // Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;

    // Run Count and Find in parallel for speed
    const [issues, total] = await Promise.all([
        Issue.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email') // Join User info
            .lean(), // Convert to plain JS object (Faster)

        Issue.countDocuments(query)
    ]);

    return {
        data: issues,
        meta: {
            total,
            page,
            pages: Math.ceil(total / limit),
        },
    };
};

// 3. Update Issue
export const updateIssue = async (id: string, updateData: Partial<IIssue>) => {
    const issue = await Issue.findByIdAndUpdate(id, updateData, { new: true });
    if (!issue) throw new Error('Issue not found');
    return issue;
};

// 4. Get Stats
export const getIssueStats = async () => {
    return await Issue.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
};