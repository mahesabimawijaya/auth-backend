export type GoogleAuthResponse = {
  provider: "google";
  sub: string;
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  given_name: string;
  family_name: string;
  email_verified: boolean;
  verified: boolean;
  language: string;
  email: string;
  emails: [{ value: string; type: string }];
  photos: [{ value: string; type: string }];
  picture: string;
};