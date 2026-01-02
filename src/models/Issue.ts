import mongoose, { Schema, Document } from 'mongoose';

export enum IssueStatus { OPEN = 'Open', IN_PROGRESS = 'In Progress', RESOLVED = 'Resolved' }
export enum IssuePriority { LOW = 'Low', MEDIUM = 'Medium', HIGH = 'High' }

export interface IIssue extends Document {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: mongoose.Schema.Types.ObjectId; // Reference to User
}

const IssueSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(IssueStatus), 
    default: IssueStatus.OPEN,
    index: true // Index for fast filtering by status
  },
  priority: { 
    type: String, 
    enum: Object.values(IssuePriority), 
    default: IssuePriority.MEDIUM 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// COMPOUND INDEX for optimized search + filtering
// Allows searching text AND filtering by status efficiently
IssueSchema.index({ title: 'text', description: 'text' }); 

export default mongoose.model<IIssue>('Issue', IssueSchema);