import mongoose, { Schema } from 'mongoose';
import { IIssue, IssueStatus, IssuePriority, IssueSeverity } from '../types';

const issueSchema = new Schema<IIssue>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [10, 'Description must be at least 10 characters long'],
        },
        status: {
            type: String,
            enum: Object.values(IssueStatus),
            default: IssueStatus.OPEN,
        },
        priority: {
            type: String,
            enum: Object.values(IssuePriority),
            required: [true, 'Priority is required'],
        },
        severity: {
            type: String,
            enum: Object.values(IssueSeverity),
            required: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
issueSchema.index({ status: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ createdAt: -1 });
issueSchema.index({ createdBy: 1 });

// Text index for search functionality
issueSchema.index({ title: 'text', description: 'text' });

export const Issue = mongoose.model<IIssue>('Issue', issueSchema);
