/**
 * [Youtube link]: https://youtu.be/MrQ6xQx6-y4?si=ZvMuDQ2d51UtUx7d
 */

export interface responseData {
  "Company Name": string;
  "YC URL": string;
}

export interface FounderData {
  name: string;
  [key: string]: string;
}

export interface JobData {
  role: string;
  location: string;
  url?: string;
}

export interface LaunchPost {
  title?: string;
  link: string;
}

export interface YCCompanyData {
  name: string;
  url?: string;
  founded?: string;
  teamSize?: number;
  location?: string;
  founders?: FounderData[];
  jobs?: JobData[];
  launchPosts?: LaunchPost;
}
