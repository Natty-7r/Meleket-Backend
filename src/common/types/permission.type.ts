// Permissions for User Model
export enum UserPermissions {
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
}

// Permissions for Business Model
export enum BusinessPermissions {
  CREATE_BUSINESS = 'CREATE_BUSINESS',
  READ_BUSINESS = 'READ_BUSINESS',
  UPDATE_BUSINESS = 'UPDATE_BUSINESS',
  DELETE_BUSINESS = 'DELETE_BUSINESS',
}

// Permissions for Admin Model
export enum AdminPermissions {
  CREATE_ADMIN = 'CREATE_ADMIN',
  READ_ADMIN = 'READ_ADMIN',
  UPDATE_ADMIN = 'UPDATE_ADMIN',
  DELETE_ADMIN = 'DELETE_ADMIN',
}

// Permissions for Profile Model
export enum ProfilePermissions {
  CREATE_PROFILE = 'CREATE_PROFILE',
  READ_PROFILE = 'READ_PROFILE',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  DELETE_PROFILE = 'DELETE_PROFILE',
}

// Permissions for Category Model
export enum CategoryPermissions {
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  READ_CATEGORY = 'READ_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
}

// Permissions for BusinessPackage Model
export enum BusinessPackagePermissions {
  CREATE_BUSINESS_PACKAGE = 'CREATE_BUSINESS_PACKAGE',
  READ_BUSINESS_PACKAGE = 'READ_BUSINESS_PACKAGE',
  UPDATE_BUSINESS_PACKAGE = 'UPDATE_BUSINESS_PACKAGE',
  DELETE_BUSINESS_PACKAGE = 'DELETE_BUSINESS_PACKAGE',
}

// Permissions for Bill Model
export enum BillPermissions {
  CREATE_BILL = 'CREATE_BILL',
  READ_BILL = 'READ_BILL',
  UPDATE_BILL = 'UPDATE_BILL',
  DELETE_BILL = 'DELETE_BILL',
}

// Permissions for Review Model
export enum ReviewPermissions {
  CREATE_REVIEW = 'CREATE_REVIEW',
  READ_REVIEW = 'READ_REVIEW',
  UPDATE_REVIEW = 'UPDATE_REVIEW',
  DELETE_REVIEW = 'DELETE_REVIEW',
}

// Permissions for Rating Model
export enum RatingPermissions {
  CREATE_RATING = 'CREATE_RATING',
  READ_RATING = 'READ_RATING',
  UPDATE_RATING = 'UPDATE_RATING',
  DELETE_RATING = 'DELETE_RATING',
}

// Permissions for Story Model
export enum StoryPermissions {
  CREATE_STORY = 'CREATE_STORY',
  READ_STORY = 'READ_STORY',
  UPDATE_STORY = 'UPDATE_STORY',
  DELETE_STORY = 'DELETE_STORY',
}

// Permissions for Log Model
export enum LogPermissions {
  CREATE_LOG = 'CREATE_LOG',
  READ_LOG = 'READ_LOG',
  UPDATE_LOG = 'UPDATE_LOG',
  DELETE_LOG = 'DELETE_LOG',
}

// Permissions for OTP Model
export enum OTPPermissions {
  CREATE_OTP = 'CREATE_OTP',
  READ_OTP = 'READ_OTP',
  UPDATE_OTP = 'UPDATE_OTP',
  DELETE_OTP = 'DELETE_OTP',
}

export type PermissionsList =
  | UserPermissions
  | BusinessPermissions
  | AdminPermissions
  | ProfilePermissions
  | CategoryPermissions
  | BusinessPackagePermissions
  | BillPermissions
  | ReviewPermissions
  | RatingPermissions
  | StoryPermissions
  | LogPermissions
  | OTPPermissions
