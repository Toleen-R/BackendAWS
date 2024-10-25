export interface User {
  id: string
  name: string
  email: string
  password: string
  campaign: Campaign[]
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
    }
  }
}

export interface Email {
  id: string
  subject: string
  content: string
  campaignId: string
  campaign: Campaign[]
  recipients: string[]
}

export interface Campaign {
  id: string
  companyName: string
  companyDescription: string
  productDescription: string
  targetAudience: string
  userId: string
  user: User
  emails: Email[]
}

export interface RequestCampaign {
  companyName: string;
  companyDescription: string;
  productDescription: string;
  targetAudience: string;
  createdAtDate: string;
  userId: string;
  emails: {
    subject: string;
    content: string;
    recipients: string[];
  }[];
}
export interface RequestUser {
  name: string,
  email: string,
  password: string
}

// interface for githubStrategy
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  profileUrl: string;
  emails: Array<{ value: string }>;
}

