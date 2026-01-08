import { Document } from "mongoose";

export enum IssueStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
}

export enum IssuePriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

export enum IssueSeverity {
  MINOR = "Minor",
  MAJOR = "Major",
  CRITICAL = "Critical",
}

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IIssue extends Document {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity?: IssueSeverity;
  createdBy: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface IssueFilterQuery extends PaginationQuery {
  search?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  severity?: IssueSeverity;
  createdBy?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StatusCounts {
  [IssueStatus.OPEN]: number;
  [IssueStatus.IN_PROGRESS]: number;
  [IssueStatus.RESOLVED]: number;
  [IssueStatus.CLOSED]: number;
  total: number;
}
